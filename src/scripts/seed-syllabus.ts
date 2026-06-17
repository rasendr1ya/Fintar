import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const SILABUS_DIR = path.resolve(process.cwd(), "agent_docs", "silabus");

interface SyllabusMeta {
  number: number;
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  target: string;
  prerequisite: string;
}

interface ParsedQuestion {
  order: number;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ParsedLessonPlan {
  order: number;
  title: string;
  questionOrders: number[];
}

interface ParsedSyllabus {
  meta: SyllabusMeta;
  questions: ParsedQuestion[];
  lessonPlans: ParsedLessonPlan[];
  materialHtml: string;
}

// ─── LaTeX cleanup helpers ─────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text
    .replace(/\\&/g, "&")
    .replace(/\\%/g, "%")
    .replace(/\\_/g, "_")
    .replace(/\\#/g, "#")
    .replace(/\\\$/g, "$")
    .replace(/\\\{/g, "{")
    .replace(/\\\}/g, "}")
    .replace(/\\textasciitilde\{\}/g, "~")
    .replace(/\\textbullet\{\}/g, "•")
    .replace(/\\ldots\{\}/g, "…")
    .replace(/\\ldots/g, "…")
    .replace(/\\,/g, " ")
    .replace(/---/g, "—")
    .replace(/--/g, "–")
    .replace(/``/g, '"')
    .replace(/''/g, '"')
    .replace(/`/g, "'")
    .replace(/'/g, "'")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ");
}

function stripInlineCommands(text: string): string {
  return text
    .replace(/\\textbf\{([^}]*)\}/g, "$1")
    .replace(/\\textit\{([^}]*)\}/g, "$1")
    .replace(/\\emph\{([^}]*)\}/g, "$1")
    .replace(/\\underline\{([^}]*)\}/g, "$1")
    .replace(/\\small\s*/g, "")
    .replace(/\\large\s*/g, "")
    .replace(/\\normalsize\s*/g, "")
    .replace(/\\footnotesize\s*/g, "")
    .replace(/\\scriptsize\s*/g, "")
    .replace(/\\tiny\s*/g, "")
    .replace(/\\centering\s*/g, "")
    .replace(/\\raggedright\s*/g, "")
    .replace(/\\noindent\s*/g, "")
    .replace(/\\medskip\s*/g, "\n")
    .replace(/\\bigskip\s*/g, "\n")
    .replace(/\\smallskip\s*/g, "\n")
    .replace(/\\quad/g, " ")
    .replace(/\\qquad/g, "  ")
    .replace(/\\fa[A-Za-z]+/g, "")
    .replace(/\\addlinespace/g, "")
    .replace(/\\toprule|\\midrule|\\bottomrule|\\hline/g, "")
    .replace(/\\\[|\\\]/g, "")
    .replace(/\\item\[[^\]]*\]/g, "•")
    .replace(/\\item\s+/g, "• ")
    .replace(/\\rp\{([^}]*)\}/g, "Rp $1")
    .replace(/\\Rp\{([^}]*)\}/g, "Rp $1")
    .replace(/\\color\{[^}]*\}/g, "")
    .replace(/\\textcolor\{[^}]*\}\{([^}]*)\}/g, "$1")
    .replace(/\\colorbox\{[^}]*\}/g, "")
    .replace(/\\definecolor\{[^}]*\}\{[^}]*\}\{[^}]*\}/g, "")
    .replace(/\\badge\{[^}]*\}\{([^}]*)\}/g, "$1")
    .replace(/\\correct\{([^}]*)\}/g, "$1")
    .replace(/\\wrong\{([^}]*)\}/g, "$1")
    .replace(/\\neutral\{([^}]*)\}/g, "$1")
    .replace(/\\textbf\{([^}]*)\}/g, "$1")
    .replace(/\\textit\{([^}]*)\}/g, "$1")
    .replace(/\\emph\{([^}]*)\}/g, "$1")
    .replace(/\\underline\{([^}]*)\}/g, "$1");
}

function removeEnvironmentBlocks(text: string, envNames: string[]): string {
  let result = text;
  for (const envName of envNames) {
    const begin = `\\begin{${envName}}`;
    const end = `\\end{${envName}}`;
    let out = "";
    let i = 0;
    while (true) {
      const idx = result.indexOf(begin, i);
      if (idx === -1) {
        out += result.slice(i);
        break;
      }
      out += result.slice(i, idx);
      const endIdx = result.indexOf(end, idx + begin.length);
      if (endIdx === -1) {
        // Malformed; skip the begin tag but keep rest
        i = idx + begin.length;
        continue;
      }
      i = endIdx + end.length;
    }
    result = out;
  }
  return result;
}

function cleanPlainText(text: string): string {
  let t = normalizeText(text);
  t = stripInlineCommands(t);
  // Drop entire LaTeX environments that cannot be rendered as plain text
  t = removeEnvironmentBlocks(t, [
    "center",
    "tabular",
    "tabularx",
    "tikzpicture",
    "axis",
    "align",
    "align*",
    "equation",
    "equation*",
    "figure",
    "table",
    "lstlisting",
    "verbatim",
    "itemize",
    "enumerate",
    "description",
    "quote",
    "quotation",
  ]);
  // Remove remaining stray backslash commands
  t = t.replace(/\\[A-Za-z]+\*?(?:\[[^\]]*\])?\s*/g, " ");
  t = t.replace(/\\[A-Za-z]+\*?(?:\{[^}]*\})?\s*/g, " ");
  // Math mode inline
  t = t.replace(/\$([^$]+)\$/g, "$1");
  // Clean whitespace
  t = t.replace(/\n\s*\n\s*\n/g, "\n\n");
  t = t.replace(/[ \t]+/g, " ");
  return t.trim();
}

// ─── Brace-balanced parsing helpers ────────────────────────────────────────

function readBraceArg(tex: string, startIndex: number): { value: string; nextIndex: number } | null {
  let i = startIndex;
  while (i < tex.length && /\s/.test(tex[i])) i++;
  if (tex[i] !== "{") return null;
  i++;
  let depth = 1;
  let value = "";
  while (i < tex.length && depth > 0) {
    const ch = tex[i];
    if (ch === "\\" && i + 1 < tex.length) {
      value += tex[i];
      value += tex[i + 1];
      i += 2;
      continue;
    }
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth > 0) value += ch;
    i++;
  }
  return { value, nextIndex: i };
}

function findEnvironment(
  tex: string,
  envName: string,
  startIndex = 0
): { args: string[]; content: string; endIndex: number } | null {
  const beginStr = `\\begin{${envName}}`;
  const idx = tex.indexOf(beginStr, startIndex);
  if (idx === -1) return null;

  let pos = idx + beginStr.length;
  const args: string[] = [];

  // Read optional arguments while next non-whitespace is {
  while (true) {
    while (pos < tex.length && /\s/.test(tex[pos])) pos++;
    if (pos < tex.length && tex[pos] === "[") {
      const arg = readBraceArg(tex.replace(/\[/g, "{").replace(/\]/g, "}"), pos - 1);
      if (arg) {
        args.push(arg.value);
        pos = arg.nextIndex;
        continue;
      }
    }
    if (pos < tex.length && tex[pos] === "{") {
      const arg = readBraceArg(tex, pos);
      if (arg) {
        args.push(arg.value);
        pos = arg.nextIndex;
        continue;
      }
    }
    break;
  }

  const endStr = `\\end{${envName}}`;
  const endIdx = tex.indexOf(endStr, pos);
  if (endIdx === -1) return null;

  const content = tex.substring(pos, endIdx);
  return { args, content, endIndex: endIdx + endStr.length };
}

function extractAllEnvironments(tex: string, envName: string): { args: string[]; content: string }[] {
  const results: { args: string[]; content: string }[] = [];
  let start = 0;
  while (true) {
    const found = findEnvironment(tex, envName, start);
    if (!found) break;
    results.push({ args: found.args, content: found.content });
    start = found.endIndex;
  }
  return results;
}

// ─── Title / metadata extraction ───────────────────────────────────────────

function extractTitleInfo(tex: string): Partial<SyllabusMeta> {
  const titlePageEnd = tex.indexOf("\\end{titlepage}");
  const titlePageTex = tex.substring(0, titlePageEnd > 0 ? titlePageEnd : 500);
  const normalizedTitlePage = normalizeText(titlePageTex);

  const titleMatches = [...normalizedTitlePage.matchAll(/\\fontsize\{\d+\}\{\d+\}\\selectfont\\textbf\{([^}]+)\}/g)];
  let mainTitle = titleMatches.length >= 2
    ? cleanPlainText(titleMatches.slice(1).map((m) => m[1]).join(" ")).trim()
    : (titleMatches[0] ? cleanPlainText(titleMatches[0][1]).trim() : "");

  const subtitleMatch =
    normalizedTitlePage.match(/\\fontsize\{1[46]\}\{[12]\d\}\\selectfont(?:\\textbf)?\{([^}]+)\}/) ||
    normalizedTitlePage.match(/\\fontsize\{1[46]\}\{[12]\d\}\\selectfont\s+([^}\n\\]+)/);

  let subtitle = subtitleMatch ? cleanPlainText(subtitleMatch[1]).trim() : "";

  if (subtitle && /^(&|dan\s)/i.test(subtitle)) {
    mainTitle = `${mainTitle} ${subtitle}`;
    subtitle = "";
  }

  const silabusMatch = tex.match(/\\textbf\{Silabus\}\s*&\s*(\d+)\s+dari\s+10/);
  const levelMatch = tex.match(/\\textbf\{Level\}\s*&\s*.*?\\badge\{[^}]*\}\{([^}]+)\}/);
  const targetMatch = tex.match(/\\textbf\{Target\}\s*&\s*([^\\]+)/);
  const durationMatch = tex.match(/\\textbf\{Durasi Belajar\}\s*&\s*([^\\]+)/);
  const prereqMatch = tex.match(/\\textbf\{Prasyarat\}\s*&\s*([^\\]+)/);

  return {
    number: silabusMatch ? parseInt(silabusMatch[1], 10) : 0,
    title: mainTitle,
    subtitle,
    level: levelMatch ? cleanPlainText(levelMatch[1]).trim() : "PEMULA",
    target: targetMatch ? cleanPlainText(targetMatch[1]).trim() : "",
    duration: durationMatch ? cleanPlainText(durationMatch[1]).trim() : "",
    prerequisite: prereqMatch ? cleanPlainText(prereqMatch[1]).trim() : "",
  };
}

// ─── Subsection extraction for lessons ─────────────────────────────────────

function extractSubsectionTitles(tex: string): string[] {
  const titles: string[] = [];
  const regex = /\\subsection\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(tex)) !== null) {
    titles.push(cleanPlainText(match[1]).trim());
  }
  return titles;
}

function buildLessonPlans(subsections: string[]): ParsedLessonPlan[] {
  const safeTitle = (idx: number) => {
    const t = subsections[idx]?.trim();
    return t && t.length > 0 ? t : `Materi Inti — Bagian ${idx + 1}`;
  };

  return [
    { order: 1, title: safeTitle(0), questionOrders: [1, 2, 3, 4, 5] },
    { order: 2, title: safeTitle(1), questionOrders: [6, 7, 8, 9, 10] },
    { order: 3, title: safeTitle(2), questionOrders: [11, 12, 13, 14, 15] },
  ];
}

// ─── Question parsing ──────────────────────────────────────────────────────

function extractDifficulty(args: string[]): string {
  const joined = args.join(" ");
  const badgeMatch = joined.match(/\\badge\{[^}]*\}\{([^}]+)\}/);
  if (badgeMatch) return cleanPlainText(badgeMatch[1]).toUpperCase();
  return "MUDAH";
}

function parseQuestionOptions(content: string): { questionText: string; options: string[] } {
  const enumRegex = /\\begin\{enumerate\}\[label=\\textbf\{\\Alph\*\.\}[^\]]*\]([\s\S]*?)\\end\{enumerate\}/;
  const enumMatch = content.match(enumRegex);

  let questionText = content;
  let options: string[] = [];

  if (enumMatch) {
    questionText = content.substring(0, enumMatch.index).trim();
    const optionsBlock = enumMatch[1];
    options = optionsBlock
      .split(/\\item\s+/)
      .map((s) => cleanPlainText(s).trim())
      .filter((s) => s.length > 0);
  }

  return { questionText: cleanPlainText(questionText), options };
}

function extractCorrectLetter(answerContent: string): string | null {
  const patterns = [
    /Jawaban\s+Benar:\s*([A-E])\b/i,
    /Jawaban\s+Benar:\s*([A-E])\s*—/i,
    /Jawaban\s+Benar:\s*([A-E])\s*-/i,
  ];

  for (const pattern of patterns) {
    const match = answerContent.match(pattern);
    if (match) return match[1].toUpperCase();
  }

  const correctBlockMatch = answerContent.match(/\\correct\{([^}]*)\}/);
  if (correctBlockMatch) {
    const inner = correctBlockMatch[1];
    const letterMatch = inner.match(/([A-E])\s*[—–-]/);
    if (letterMatch) return letterMatch[1].toUpperCase();
    const simpleLetterMatch = inner.match(/\b([A-E])\b/);
    if (simpleLetterMatch) return simpleLetterMatch[1].toUpperCase();
  }

  return null;
}

function extractQuestions(tex: string): ParsedQuestion[] {
  const quizBoxes = extractAllEnvironments(tex, "quizbox");
  const answerBoxes = extractAllEnvironments(tex, "answerbox");

  const answerMap = new Map<number, string>();
  for (const box of answerBoxes) {
    const order = parseInt(box.args[0] || "0", 10);
    const letter = extractCorrectLetter(box.content);
    if (letter) answerMap.set(order, letter);
  }

  const questions: ParsedQuestion[] = [];
  for (const box of quizBoxes) {
    const order = parseInt(box.args[0] || "0", 10);
    const difficulty = extractDifficulty(box.args.slice(1));
    const { questionText, options } = parseQuestionOptions(box.content);

    const letter = answerMap.get(order);
    let correctAnswer = options[0] || "";
    if (letter) {
      const idx = letter.charCodeAt(0) - "A".charCodeAt(0);
      if (idx >= 0 && idx < options.length) correctAnswer = options[idx];
    }

    if (questionText && options.length >= 2) {
      questions.push({ order, difficulty, question: questionText, options, correctAnswer });
    }
  }

  return questions.sort((a, b) => a.order - b.order);
}

// ─── Material HTML conversion ──────────────────────────────────────────────

function latexToHtml(tex: string): string {
  let html = tex;

  // Normalize common escapes
  html = normalizeText(html);

  // Sections
  html = html.replace(/\\section\{([^}]+)\}/g, "<h2>$1</h2>");
  html = html.replace(/\\subsection\{([^}]+)\}/g, "<h3>$1</h3>");
  html = html.replace(/\\subsubsection\{([^}]+)\}/g, "<h4>$1</h4>");

  // Inline formatting
  html = html.replace(/\\textbf\{([^}]+)\}/g, "<strong>$1</strong>");
  html = html.replace(/\\textit\{([^}]+)\}/g, "<em>$1</em>");
  html = html.replace(/\\emph\{([^}]+)\}/g, "<em>$1</em>");
  html = html.replace(/\\underline\{([^}]+)\}/g, "<u>$1</u>");

  // Lists
  html = html.replace(/\\begin\{itemize\}[^\}]*\]/g, "<ul>");
  html = html.replace(/\\begin\{itemize\}/g, "<ul>");
  html = html.replace(/\\end\{itemize\}/g, "</ul>");
  html = html.replace(/\\begin\{enumerate\}[^\]]*\]/g, "<ol>");
  html = html.replace(/\\begin\{enumerate\}/g, "<ol>");
  html = html.replace(/\\end\{enumerate\}/g, "</ol>");
  html = html.replace(/\\item\s+([^\n]+)/g, "<li>$1</li>");

  // Colored boxes -> div with class
  html = html.replace(
    /\\begin\{cfpbox\}/g,
    '<div class="cfp-box">'
  );
  html = html.replace(/\\end\{cfpbox\}/g, "</div>");
  html = html.replace(/\\begin\{keybox\}/g, '<div class="key-box">');
  html = html.replace(/\\end\{keybox\}/g, "</div>");
  html = html.replace(/\\begin\{casebox\}\{([^}]*)\}/g, '<div class="case-box"><h4>Studi Kasus: $1</h4>');
  html = html.replace(/\\end\{casebox\}/g, "</div>");
  html = html.replace(/\\begin\{(warningbox|warnbox)\}/g, '<div class="warning-box">');
  html = html.replace(/\\end\{(warningbox|warnbox)\}/g, "</div>");
  html = html.replace(/\\begin\{ojkbox\}/g, '<div class="ojk-box">');
  html = html.replace(/\\end\{ojkbox\}/g, "</div>");

  // Center/tabular/tikz — strip heavy LaTeX blocks
  html = html.replace(/\\begin\{center\}[\s\S]*?\\end\{center\}/g, "");
  html = html.replace(/\\begin\{tabular[x]?\}[^}]*\}[\s\S]*?\\end\{tabular[x]?\}/g, "");
  html = html.replace(/\\begin\{tabular\}[^}]*\}[\s\S]*?\\end\{tabular\}/g, "");
  html = html.replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g, "");
  html = html.replace(/\\begin\{axis\}\[[\s\S]*?\\end\{axis\}/g, "");
  html = html.replace(/\\begin\{align\*\}[\s\S]*?\\end\{align\*\}/g, "");

  // Math
  html = html.replace(/\$([^$]+)\$/g, "$1");

  // Remove remaining commands that are not meaningful in HTML
  html = html.replace(/\\[A-Za-z]+\*?(?:\[[^\]]*\])?(?:\{[^}]*\})?\s*/g, " ");

  // Paragraphs
  html = html.replace(/\n\s*\n/g, "</p>\n<p>");
  html = "<p>" + html + "</p>";

  // Clean empty tags and whitespace
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/<p>\s*<h(\d)>/g, "<h$1>");
  html = html.replace(/<\/h(\d)>\s*<\/p>/g, "</h$1>");
  html = html.replace(/<p>\s*(<div)/g, "$1");
  html = html.replace(/(<\/div>)\s*<\/p>/g, "$1");
  html = html.replace(/<\/li>\s*<li>/g, "</li>\n<li>");
  html = html.replace(/[ \t]+/g, " ");
  html = html.replace(/\n\s*\n/g, "\n");

  return html.trim();
}

function extractMaterialHtml(tex: string): string {
  const materiStart = tex.indexOf("\\section{Materi Inti}");
  if (materiStart === -1) return "";

  const kuisStart = tex.indexOf("\\section{Kuis", materiStart);
  const studiKasusStart = tex.indexOf("\\section{Studi Kasus}", materiStart);

  let end = tex.length;
  if (kuisStart !== -1) end = Math.min(end, kuisStart);
  if (studiKasusStart !== -1) end = Math.min(end, studiKasusStart);

  const materialTex = tex.substring(materiStart, end);
  return latexToHtml(materialTex);
}

// ─── File parsing ──────────────────────────────────────────────────────────

function parseSyllabusFile(filePath: string): ParsedSyllabus {
  const tex = fs.readFileSync(filePath, "utf-8");
  const meta = extractTitleInfo(tex) as SyllabusMeta;
  const questions = extractQuestions(tex);
  const subsections = extractSubsectionTitles(tex);
  const lessonPlans = buildLessonPlans(subsections);
  const materialHtml = extractMaterialHtml(tex);

  return { meta, questions, lessonPlans, materialHtml };
}

// ─── UUID helpers ──────────────────────────────────────────────────────────

function unitId(number: number): string {
  const n = number.toString().padStart(4, "0");
  const suffix = (1000 + number).toString().padStart(12, "0");
  return `a1b2c3d4-${n}-4000-8000-${suffix}`;
}

function lessonId(unitNumber: number, lessonOrder: number): string {
  const u = unitNumber.toString().padStart(4, "0");
  const l = lessonOrder.toString().padStart(4, "0");
  const suffix = (unitNumber * 100000000 + lessonOrder * 1000000).toString().padStart(12, "0");
  return `b2c3d4e5-${u}-${l}-8000-${suffix}`;
}

function challengeId(unitNumber: number, lessonOrder: number, qIndex: number): string {
  const u = unitNumber.toString().padStart(4, "0");
  const l = lessonOrder.toString().padStart(4, "0");
  const suffix = (unitNumber * 100000000 + lessonOrder * 1000000 + qIndex).toString().padStart(12, "0");
  return `f6a7b8c9-${u}-${l}-8000-${suffix}`;
}

function articleId(number: number): string {
  const n = number.toString().padStart(4, "0");
  const suffix = (1000 + number).toString().padStart(12, "0");
  return `e5f6a7b8-${n}-4000-8000-${suffix}`;
}

// Original dummy seed data IDs that should be cleaned up
const OLD_DUMMY_UNIT_IDS = [
  "a1b2c3d4-0001-4000-8000-000000000001",
  "a1b2c3d4-0002-4000-8000-000000000002",
  "a1b2c3d4-0003-4000-8000-000000000003",
];

const SYLLABUS_TITLES = [
  "Kenali Uangmu",
  "Atur Pengeluaran",
  "Dana Darurat",
  "Utang Cerdas",
  "Mulai Investasi",
  "Kekuatan Bunga Majemuk",
  "Proteksi Finansial",
  "Investasi Saham",
  "Pajak",
  "Perencanaan Keuangan Jangka Panjang",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 80);
}

const colors = [
  "#7C3AED",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#0D7A6B",
  "#185FA5",
  "#534AB7",
  "#BA7517",
  "#1D9E75",
  "#2D3A8C",
];

// ─── Cleanup ───────────────────────────────────────────────────────────────

async function cleanupExistingSyllabusData() {
  console.log("\n🧹 Cleaning up existing syllabus data...");

  const { data: existingUnits } = await supabase
    .from("units")
    .select("id, title")
    .or(SYLLABUS_TITLES.map((t) => `title.ilike.${t}%`).join(","));
  const existingUnitIds = existingUnits?.map((u) => u.id) || [];
  console.log(`  Found ${existingUnitIds.length} existing syllabus units`);

  const { data: existingLessons } = await supabase
    .from("lessons")
    .select("id, title")
    .or(SYLLABUS_TITLES.map((t) => `title.ilike.${t}%`).join(","));
  const existingLessonIds = existingLessons?.map((l) => l.id) || [];
  console.log(`  Found ${existingLessonIds.length} existing syllabus lessons`);

  if (existingLessonIds.length > 0) {
    const { error: delChallengesError } = await supabase
      .from("challenges")
      .delete()
      .in("lesson_id", existingLessonIds);
    if (delChallengesError) {
      console.error("Error deleting existing challenges:", delChallengesError);
      process.exit(1);
    }
    console.log(`  🗑️  Deleted existing syllabus challenges`);
  }

  if (existingLessonIds.length > 0) {
    const { error: delLessonsError } = await supabase
      .from("lessons")
      .delete()
      .in("id", existingLessonIds);
    if (delLessonsError) {
      console.error("Error deleting existing lessons:", delLessonsError);
      process.exit(1);
    }
    console.log(`  🗑️  Deleted existing syllabus lessons`);
  }

  if (existingUnitIds.length > 0) {
    const { error: delUnitsError } = await supabase
      .from("units")
      .delete()
      .in("id", existingUnitIds);
    if (delUnitsError) {
      console.error("Error deleting existing units:", delUnitsError);
      process.exit(1);
    }
    console.log(`  🗑️  Deleted existing syllabus units`);
  }

  const { error: delDummyUnitsError } = await supabase
    .from("units")
    .delete()
    .in("id", OLD_DUMMY_UNIT_IDS);
  if (delDummyUnitsError) {
    console.error("Error deleting old dummy units:", delDummyUnitsError);
    process.exit(1);
  }

  const { error: delArticlesError } = await supabase
    .from("articles")
    .delete()
    .eq("category", "Silabus");
  if (delArticlesError) {
    console.error("Error deleting old syllabus articles:", delArticlesError);
    process.exit(1);
  }
  console.log(`  🗑️  Deleted old syllabus articles`);
}

// ─── Main seed ─────────────────────────────────────────────────────────────

async function seedSyllabus() {
  const files = fs
    .readdirSync(SILABUS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".tex"))
    .sort((a, b) => {
      const na = parseInt(a.replace(/\D/g, ""), 10) || 0;
      const nb = parseInt(b.replace(/\D/g, ""), 10) || 0;
      return na - nb;
    });

  if (files.length === 0) {
    console.error("No .tex files found in", SILABUS_DIR);
    process.exit(1);
  }

  console.log(`📂 Found ${files.length} syllabus files\n`);

  const parsed: ParsedSyllabus[] = [];
  for (const file of files) {
    const filePath = path.join(SILABUS_DIR, file);
    const data = parseSyllabusFile(filePath);
    console.log(
      `✅ Parsed ${file}: ${data.meta.title} — ${data.questions.length} questions — ${data.lessonPlans.length} lessons`
    );
    parsed.push(data);
  }

  parsed.sort((a, b) => a.meta.number - b.meta.number);

  await cleanupExistingSyllabusData();

  // ─── Units ───
  console.log("\n📦 Upserting units...");
  const unitsData = parsed.map((p) => ({
    id: unitId(p.meta.number),
    title: p.meta.title,
    description: p.meta.subtitle,
    order_index: p.meta.number,
    color_theme: colors[(p.meta.number - 1) % colors.length],
    tags: [slugify(p.meta.level), `silabus-${p.meta.number}`],
    is_deleted: false,
  }));

  const { error: unitsError } = await supabase.from("units").upsert(unitsData, { onConflict: "id" });
  if (unitsError) {
    console.error("Error upserting units:", unitsError);
    process.exit(1);
  }
  console.log(`  ✅ ${unitsData.length} units upserted`);

  // ─── Lessons ───
  console.log("\n📚 Upserting lessons...");
  const lessonsData: any[] = [];
  for (const p of parsed) {
    for (const plan of p.lessonPlans) {
      lessonsData.push({
        id: lessonId(p.meta.number, plan.order),
        unit_id: unitId(p.meta.number),
        title: plan.title,
        order_index: plan.order,
        is_deleted: false,
      });
    }
  }

  const { error: lessonsError } = await supabase.from("lessons").upsert(lessonsData, { onConflict: "id" });
  if (lessonsError) {
    console.error("Error upserting lessons:", lessonsError);
    process.exit(1);
  }
  console.log(`  ✅ ${lessonsData.length} lessons upserted`);

  // ─── Challenges ───
  console.log("\n🎯 Upserting challenges...");
  const challengesData: any[] = [];
  for (const p of parsed) {
    for (const plan of p.lessonPlans) {
      for (let i = 0; i < plan.questionOrders.length; i++) {
        const qOrder = plan.questionOrders[i];
        const q = p.questions.find((qq) => qq.order === qOrder);
        if (!q) {
          console.warn(`  ⚠️  Question ${qOrder} not found for unit ${p.meta.number} lesson ${plan.order}`);
          continue;
        }
        challengesData.push({
          id: challengeId(p.meta.number, plan.order, i + 1),
          lesson_id: lessonId(p.meta.number, plan.order),
          type: "SELECT",
          question: q.question,
          options: q.options,
          correct_answer: q.correctAnswer,
          order_index: i + 1,
          is_deleted: false,
        });
      }
    }
  }

  const { error: challengesError } = await supabase.from("challenges").upsert(challengesData, { onConflict: "id" });
  if (challengesError) {
    console.error("Error upserting challenges:", challengesError);
    process.exit(1);
  }
  console.log(`  ✅ ${challengesData.length} challenges upserted`);

  // ─── Articles ───
  console.log("\n📰 Upserting articles...");
  const baseDate = new Date("2026-06-17T00:00:00.000Z");
  const articlesData = parsed.map((p) => {
    const createdAt = new Date(baseDate.getTime() + (10 - p.meta.number) * 60 * 1000).toISOString();
    return {
      id: articleId(p.meta.number),
      slug: slugify(p.meta.subtitle ? `${p.meta.title} ${p.meta.subtitle}` : p.meta.title),
      title: p.meta.subtitle ? `${p.meta.title}: ${p.meta.subtitle}` : p.meta.title,
      summary: `Materi silabus ${p.meta.number} — ${p.meta.title}. Level: ${p.meta.level}. Durasi: ${p.meta.duration}.`,
      content: p.materialHtml || `<p>Materi lengkap silabus ${p.meta.number} tentang ${p.meta.title}.</p>`,
      cover_image: null,
      category: "Silabus",
      tags: [slugify(p.meta.level), `silabus-${p.meta.number}`],
      read_time_minutes: parseInt(p.meta.duration.replace(/\D/g, ""), 10) || 60,
      author: "Tim Fintar",
      is_featured: p.meta.number === 1,
      is_published: true,
      is_deleted: false,
      view_count: 0,
      created_at: createdAt,
    };
  });

  const { error: articlesError } = await supabase.from("articles").upsert(articlesData, { onConflict: "id" });
  if (articlesError) {
    console.error("Error upserting articles:", articlesError);
    process.exit(1);
  }
  console.log(`  ✅ ${articlesData.length} articles upserted`);

  console.log("\n✅ Syllabus seed complete! (Idempotent — safe to re-run)");
}

seedSyllabus().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
