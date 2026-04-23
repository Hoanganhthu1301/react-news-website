import { cleanArticleUrl } from "../utils/articleUtils";

const API_BASE = "http://localhost:5000";

export const fetchNewsByCategory = async (categoryName) => {
  const response = await fetch(
    `${API_BASE}/api/news?category=${encodeURIComponent(categoryName)}`
  );

  const data = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data.message || "Failed to fetch news");
  }

  return data;
};

export const fetchFullArticle = async (url) => {
  const cleanedUrl = cleanArticleUrl(url);

  const response = await fetch(
    `${API_BASE}/api/article?url=${encodeURIComponent(cleanedUrl)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `${data.message || "Không đọc được full bài báo"} | ${
        data.error || "No backend error"
      } | status: ${data.status || response.status}`
    );
  }

  return data;
};