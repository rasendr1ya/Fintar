import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import pg from "pg";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATABASE_URL = process.env.DATABASE_URL;

async function setupViaPg() {
  const sqlPath = path.join(__dirname, "../../supabase/migrations/20240420000000_initial_schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  console.log("🔌 Connecting to database via pg...");
  const pool = new pg.Pool({ connectionString: DATABASE_URL });

  try {
    await pool.query(sql);
    console.log("✅ Schema created successfully via pg!");
  } catch (err) {
    console.error("❌ Error executing SQL:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function checkTables() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { error } = await supabase.from("units").select("id").limit(1);
  return !error;
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const tablesExist = await checkTables();
  if (tablesExist) {
    console.log("✅ Tables already exist. Skipping schema creation.");
    return;
  }

  console.log("📋 Tables not found. Creating schema...\n");

  if (DATABASE_URL) {
    await setupViaPg();
  } else {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  DATABASE_URL not found in .env.local");
    console.log("");
    console.log("To set up the database automatically, add DATABASE_URL to .env.local:");
    console.log("");
    console.log("  1. Go to Supabase Dashboard → Settings → Database");
    console.log("  2. Copy the Connection String (URI) under 'Connection string'");
    console.log("  3. Add to .env.local:");
    console.log("     DATABASE_URL=postgresql://postgres.[ref]:[password]@...");
    console.log("  4. Run: npm run setup-db");
    console.log("");
    console.log("OR run the SQL manually:");
    console.log("  1. Go to Supabase Dashboard → SQL Editor");
    console.log("  2. Copy & paste the contents of:");
    console.log(`     ${path.join(__dirname, "../../supabase/migrations/20240420000000_initial_schema.sql")}`);
    console.log("  3. Click Run");
    console.log("  4. Then run: npm run seed");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(1);
  }
}

main().catch(console.error);
