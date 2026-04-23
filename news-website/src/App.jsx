import { useEffect, useMemo, useState } from "react";
import styles from "./App.module.css";
import Home from "./pages/Home/Home";
import ArticleDetail from "./pages/ArticleDetail/ArticleDetail";
import { categories } from "./constants/newsData";
import { dedupeArticles, filterReadableArticles } from "./utils/articleUtils";
import { fetchFullArticle, fetchNewsByCategory } from "./services/newsApi";

function App() {
  const [activeCategory, setActiveCategory] = useState("World News");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullArticle, setFullArticle] = useState(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const searchedArticles = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    const sourceData = allArticles.length ? allArticles : articles;

    if (!keyword) return sourceData;

    return sourceData.filter((article) => {
      const title = article.title?.toLowerCase() || "";
      const source = article.source?.name?.toLowerCase() || "";
      const author = article.author?.toLowerCase() || "";
      const desc = article.description?.toLowerCase() || "";

      return (
        title.includes(keyword) ||
        source.includes(keyword) ||
        author.includes(keyword) ||
        desc.includes(keyword)
      );
    });
  }, [allArticles, articles, searchKeyword]);

  const fetchNews = async (categoryName) => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchNewsByCategory(categoryName);
      const filteredArticles = filterReadableArticles(data.articles || []);

      setArticles(filteredArticles);
      setAllArticles((prev) => dedupeArticles([...prev, ...filteredArticles]));
    } catch (err) {
      console.error("Fetch news error:", err);
      setArticles([]);
      setError("Không tải được tin tức.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const preloadAllCategories = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            try {
              const data = await fetchNewsByCategory(category);
              return filterReadableArticles(data.articles || []);
            } catch {
              return [];
            }
          })
        );

        setAllArticles(dedupeArticles(results.flat()));
      } catch (err) {
        console.error("Preload all categories error:", err);
      }
    };

    preloadAllCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedArticle(null);
    setFullArticle(null);
    setArticleError("");
    setSearchOpen(false);
    setSearchKeyword("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openArticle = async (article) => {
    setSelectedArticle(article);
    setFullArticle(null);
    setArticleError("");
    setArticleLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      if (!article?.url) throw new Error("Thiếu link bài báo");
      const data = await fetchFullArticle(article.url);
      setFullArticle(data);
    } catch (err) {
      console.error("Fetch full article error:", err);

      const msg = String(err.message || "");

      if (msg.includes("451")) {
        setArticleError("Nguồn báo này bị giới hạn pháp lý hoặc khu vực.");
      } else if (msg.includes("401")) {
        setArticleError("Nguồn báo này yêu cầu đăng nhập hoặc có paywall.");
      } else if (msg.includes("403")) {
        setArticleError("Nguồn báo này chặn đọc full bài.");
      } else if (msg.includes("ECONNRESET")) {
        setArticleError("Nguồn báo đã đóng kết nối.");
      } else if (msg.includes("socket hang up")) {
        setArticleError("Nguồn báo từ chối kết nối.");
      } else if (msg.includes("timeout")) {
        setArticleError("Nguồn báo phản hồi quá chậm.");
      } else {
        setArticleError("Đang hiển thị bản tóm tắt của bài viết.");
      }
    } finally {
      setArticleLoading(false);
    }
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    setFullArticle(null);
    setArticleError("");
    setArticleLoading(false);
    setSearchOpen(false);
    setSearchKeyword("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const similarNews = useMemo(() => {
    if (!selectedArticle) return [];
    return articles.filter((item) => item.url !== selectedArticle.url).slice(0, 3);
  }, [articles, selectedArticle]);

  return (
    <div className={styles.app}>
      {selectedArticle ? (
        <ArticleDetail
          activeCategory={activeCategory}
          selectedArticle={selectedArticle}
          fullArticle={fullArticle}
          articleLoading={articleLoading}
          articleError={articleError}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          searchedArticles={searchedArticles}
          onCategoryClick={handleCategoryClick}
          onLogoClick={closeArticle}
          onCloseArticle={closeArticle}
          onOpenArticle={openArticle}
          similarNews={similarNews}
        />
      ) : (
        <Home
          activeCategory={activeCategory}
          loading={loading}
          error={error}
          articles={articles}
          onCategoryClick={handleCategoryClick}
          onLogoClick={closeArticle}
          onOpenArticle={openArticle}
        />
      )}
    </div>
  );
}

export default App;