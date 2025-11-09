export function extractLinksFromText(text: string): string[] {
  if (!text) return [];
  const regex =
    /(https?:\/\/[^\s"'<>]+(?:\.[^\s"'<>]+)*(?:\/[^\s"'<>]*)?)/gi;
  const matches = text.match(regex);
  return matches ? [...new Set(matches)] : [];
}
