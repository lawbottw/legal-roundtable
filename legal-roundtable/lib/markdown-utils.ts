// lib/markdown-utils.ts

/**
 * Extracts the first H1 heading from markdown content
 * @param content - The markdown content to extract H1 from
 * @returns The text of the first H1 heading, or null if no H1 is found
 */
export function extractH1FromMarkdown(content: string): string | null {
  if (!content || typeof content !== 'string') {
    return null;
  }
  
  // Regular expression to match markdown H1 headings
  // This matches both # Heading and setext-style H1 (underlined with ===)
  const h1Regex = /^#\s+(.+)$/m;
  const setextH1Regex = /^(.+)\n={3,}\s*$/m;
  
  // First, try to match the standard H1 pattern (# Heading)
  const h1Match = content.match(h1Regex);
  if (h1Match && h1Match[1]) {
    return h1Match[1].trim();
  }
  
  // Then try to match setext-style H1
  const setextMatch = content.match(setextH1Regex);
  if (setextMatch && setextMatch[1]) {
    return setextMatch[1].trim();
  }
  
  // No H1 found
  return null;
}