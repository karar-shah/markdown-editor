import { marked } from "marked";

export const convertMarkdownToHTML = (markdown: string): any => {
  return marked(markdown);
};
