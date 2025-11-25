export function tokenize(text) {
  return text
    .replace(/\n/g, " ")
    .replace(/[^\w\s]/g, "") // remove punctuation
    .toLowerCase()
    .split(/\s+/);
}
