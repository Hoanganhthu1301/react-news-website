import axios from "axios";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

export const getTopHeadlines = async (category = "") => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        country: "us",
        category: category || undefined,
        apiKey: API_KEY,
      },
    });
    return response.data.articles || [];
  } catch (error) {
    console.error("Lỗi lấy top headlines:", error);
    return [];
  }
};

export const searchNews = async (keyword) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: keyword,
        sortBy: "publishedAt",
        language: "en",
        apiKey: API_KEY,
      },
    });
    return response.data.articles || [];
  } catch (error) {
    console.error("Lỗi search news:", error);
    return [];
  }
};