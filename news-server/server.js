import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/news", async (req, res) => {
  try {
    const categoryName = req.query.category || "World News";

    if (categoryName === "World News") {
      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: "world OR international OR global",
          language: "en",
          sortBy: "publishedAt",
          pageSize: 12,
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      return res.json(response.data);
    }

    const categoryMap = {
      Politics: "general",
      Business: "business",
      Technology: "technology",
      Health: "health",
      Sports: "sports",
      Culture: "entertainment",
      Podcast: "science",
    };

    const apiCategory = categoryMap[categoryName] || "general";

    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us",
        category: apiCategory,
        pageSize: 12,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error("=== LỖI /api/news ===");
    console.error("message:", error.message);
    console.error("status:", error.response?.status);
    console.error("data:", error.response?.data);

    return res.status(500).json({
      message: "Không lấy được danh sách tin",
      error: error.response?.data || error.message,
    });
  }
});

app.get("/api/article", async (req, res) => {
  try {
    let articleUrl = req.query.url;

    if (!articleUrl) {
      return res.status(400).json({ message: "Thiếu url bài báo" });
    }

    articleUrl = decodeURIComponent(articleUrl)
      .replace(/\\u003d/g, "=")
      .replace(/\\u0026/g, "&")
      .replace(/\\u002f/g, "/")
      .replace(/\u003d/g, "=")
      .replace(/\u0026/g, "&")
      .replace(/\u002f/g, "/")
      .replace(/\\=/g, "=")
      .replace(/\\&/g, "&")
      .replace(/\\\//g, "/");

    articleUrl = articleUrl.replace(
      "https://abcnews.com/",
      "https://abcnews.go.com/"
    );

    console.log("=== ĐANG ĐỌC BÀI ===");
    console.log("URL:", articleUrl);

    const htmlResponse = await axios.get(articleUrl, {
      timeout: 90000,
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
        Referer: "https://www.google.com/",
      },
    });

    console.log("Status:", htmlResponse.status);

    const dom = new JSDOM(htmlResponse.data, { url: articleUrl });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent?.trim()) {
      console.log("Readability parse fail");
      return res.status(422).json({
        message: "Không trích xuất được nội dung bài báo",
        error: "Readability parse returned empty content",
        status: 422,
      });
    }

    return res.json({
      title: article.title,
      byline: article.byline,
      excerpt: article.excerpt,
      content: article.content,
      textContent: article.textContent,
      siteName: article.siteName,
      length: article.length,
    });
  } catch (error) {
    console.error("=== LỖI /api/article ===");
    console.error("message:", error.message);
    console.error("status:", error.response?.status);
    console.error("url:", req.query.url);

    return res.status(500).json({
      message: "Không đọc được full bài báo",
      error: error.message,
      status: error.response?.status || 500,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});