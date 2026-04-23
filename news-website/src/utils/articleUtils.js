import { blockedDomains } from "../constants/newsData";

export const dedupeArticles = (list = []) =>
  list.filter(
    (article, index, self) =>
      index === self.findIndex((item) => item.url === article.url)
  );

export const filterReadableArticles = (list = []) =>
  list.filter((article) => {
    try {
      if (!article?.url) return false;
      const hostname = new URL(article.url).hostname;
      return !blockedDomains.some((domain) => hostname.includes(domain));
    } catch {
      return false;
    }
  });

export const getPreviewParagraphs = (article) => {
  const paragraphs = [];

  if (article?.description) paragraphs.push(article.description);
  if (article?.content) {
    paragraphs.push(article.content.replace(/\s*\[\+\d+\s*chars\]/, ""));
  }

  if (!paragraphs.length) {
    paragraphs.push("No content available.");
  }

  return paragraphs;
};

export const getFullTextParagraphs = (fullArticle) => {
  if (!fullArticle?.textContent) return [];

  return fullArticle.textContent
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => item.length > 30);
};

export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "No date";

export const cleanArticleUrl = (url = "") =>
  String(url)
    .replace(/\\u003d/g, "=")
    .replace(/\\u0026/g, "&")
    .replace(/\\u002f/g, "/")
    .replace(/\u003d/g, "=")
    .replace(/\u0026/g, "&")
    .replace(/\u002f/g, "/")
    .replace(/\\=/g, "=")
    .replace(/\\&/g, "&")
    .replace(/\\\//g, "/")
    .replace("https://abcnews.com/", "https://abcnews.go.com/");