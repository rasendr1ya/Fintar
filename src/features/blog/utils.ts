import type { ArticlePublisher } from "@/types/database";

export type PublisherDisplay = {
  label: string;
  initials: string;
  isFintarTeam: boolean;
};

export function getPublisherDisplay(
  publisher: ArticlePublisher,
  authorFallback: string | null
): PublisherDisplay {
  if (!publisher) {
    const label = authorFallback?.trim() || "Tim Fintar";
    return {
      label,
      initials: label === "Tim Fintar" ? "F" : label.slice(0, 1).toUpperCase(),
      isFintarTeam: label === "Tim Fintar",
    };
  }

  if (publisher.admin_role === "dev") {
    return { label: "Tim Fintar", initials: "F", isFintarTeam: true };
  }

  const words = publisher.username.trim().split(/\s+/);
  const initials =
    words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase();

  return { label: publisher.username, initials, isFintarTeam: false };
}
