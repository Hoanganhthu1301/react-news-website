import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaRedditAlien,
} from "react-icons/fa";

const categories = [
  "World News",
  "Politics",
  "Business",
  "Technology",
  "Health",
  "Sports",
  "Culture",
  "Podcast",
];

const blockedDomains = [
  "washingtonpost.com",
  "cnn.com",
  "bloomberg.com",
  "nytimes.com",
  "nbcboston.com",
  "nbcnews.com",
  "usatoday.com",
  "reuters.com",
  "people.com",
  "pagesix.com",
  "medicalxpress.com",
  "globalresearch.ca",
  "yahoo.com",
  "yahoo.co.uk",
  "ew.com",
  "fandom.com",
  "screenrant.com",
  "thegamer.com",
  "teslarati.com",
  "wsj.com",
  "gigazine.net",
];

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

  const dedupeArticles = (list) =>
    list.filter(
      (article, index, self) =>
        index === self.findIndex((item) => item.url === article.url)
    );

  const filterReadableArticles = (list) =>
    (list || []).filter((article) => {
      try {
        if (!article?.url) return false;
        const hostname = new URL(article.url).hostname;
        return !blockedDomains.some((domain) => hostname.includes(domain));
      } catch {
        return false;
      }
    });

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

      const response = await fetch(
        `http://localhost:5000/api/news?category=${encodeURIComponent(categoryName)}`
      );

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Failed to fetch news");
      }

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
              const response = await fetch(
                `http://localhost:5000/api/news?category=${encodeURIComponent(category)}`
              );

              const data = await response.json();

              if (!response.ok || data.status === "error") return [];
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
      if (!article?.url) {
        throw new Error("Thiếu link bài báo");
      }

      const cleanedUrl = String(article.url || "")
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

      const response = await fetch(
        `http://localhost:5000/api/article?url=${encodeURIComponent(cleanedUrl)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `${data.message || "Không đọc được full bài báo"} | ${
            data.error || "No backend error"
          } | status: ${data.status || response.status}`
        );
      }

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

  const getPreviewParagraphs = (article) => {
    const paragraphs = [];

    if (article?.description) {
      paragraphs.push(article.description);
    }

    if (article?.content) {
      paragraphs.push(article.content.replace(/\s*\[\+\d+\s*chars\]/, ""));
    }

    if (paragraphs.length === 0) {
      paragraphs.push("No content available.");
    }

    return paragraphs;
  };

  const getFullTextParagraphs = () => {
    if (!fullArticle?.textContent) return [];

    return fullArticle.textContent
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => item.length > 30);
  };

  const renderListPage = () => (
    <div className="page-wrap">
      <TopBar />
      <Header
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
        onLogoClick={closeArticle}
      />

      <main className="container news-list-page">
        <section className="section-header">
          <h2>{activeCategory.toUpperCase()}</h2>
        </section>

        {loading && <p className="empty-message">Loading articles...</p>}
        {!loading && error && <p className="empty-message">{error}</p>}

        {!loading && !error && (
          <section className="news-grid">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <article
                  className="news-card"
                  key={`${article.url || article.title}-${index}`}
                  onClick={() => openArticle(article)}
                >
                  <div className="news-card-image-wrap">
                    <img
                      src={article.urlToImage || "/no-image.jpg"}
                      alt={article.title || "News image"}
                      className="news-card-image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/no-image.jpg";
                      }}
                    />
                  </div>

                  <div className="news-card-body">
                    <h3>{article.title || "Untitled article"}</h3>
                    <div className="meta">
                      <span>{article.author || article.source?.name || "Unknown"}</span>
                      <span className="dot"></span>
                      <span>
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-message">No readable articles in this category yet.</p>
            )}
          </section>
        )}
      </main>

      <Footer onLogoClick={closeArticle} />
    </div>
  );

  const renderDetailPage = () => {
    const fullTextParagraphs = getFullTextParagraphs();

    return (
      <div className="page-wrap">
        <TopBar showSearch onSearchClick={() => setSearchOpen(true)} />
        <Header
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
          onLogoClick={closeArticle}
        />

        {searchOpen && (
          <div className="search-overlay" onClick={() => setSearchOpen(false)}>
            <div className="search-panel" onClick={(e) => e.stopPropagation()}>
              <div className="search-panel-header">
                <h3>Search articles</h3>
                <button onClick={() => setSearchOpen(false)}>✕</button>
              </div>

              <input
                type="text"
                placeholder="Type to search any topic..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="search-input"
                autoFocus
              />

              <div className="search-results">
                {searchedArticles.length > 0 ? (
                  searchedArticles.slice(0, 8).map((article, index) => (
                    <div
                      key={`${article.url || article.title}-${index}`}
                      className="search-result-item"
                      onClick={() => {
                        setSearchOpen(false);
                        openArticle(article);
                      }}
                    >
                      <img
                        src={article.urlToImage || "/no-image.jpg"}
                        alt={article.title || "result"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/no-image.jpg";
                        }}
                      />
                      <div>
                        <p className="search-result-title">
                          {article.title || "Untitled article"}
                        </p>
                        <span className="search-result-source">
                          {article.source?.name || "Unknown source"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="search-empty">No matching articles.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <main className="detail-container">
          <button className="back-btn" onClick={closeArticle}>
            ← Back to news
          </button>

          <div className="detail-hero">
            <img
              src={selectedArticle?.urlToImage || "/no-image.jpg"}
              alt={selectedArticle?.title || "News detail"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/no-image.jpg";
              }}
            />
          </div>

          <div className="author-row">
            <div className="author-avatar">
              {(selectedArticle?.author || selectedArticle?.source?.name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="author-info">
              <strong>
                {selectedArticle?.author ||
                  selectedArticle?.source?.name ||
                  "Unknown author"}
              </strong>
              <span>
                {selectedArticle?.publishedAt
                  ? new Date(selectedArticle.publishedAt).toLocaleDateString()
                  : "No date"}
              </span>
            </div>
          </div>

          <div className="detail-divider"></div>

          <h1 className="detail-title">
            {fullArticle?.title || selectedArticle?.title || "Untitled article"}
          </h1>

          <div className="detail-divider"></div>

          <div className="detail-content">
            {articleLoading ? (
              <p>Loading full article...</p>
            ) : fullTextParagraphs.length > 0 ? (
              fullTextParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              getPreviewParagraphs(selectedArticle).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            )}

            {articleError && (
              <p className="soft-note">Đang hiển thị bản tóm tắt của bài viết.</p>
            )}

            {selectedArticle?.url && (
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noreferrer"
                className="read-original-btn"
              >
                Read original article
              </a>
            )}
          </div>

          <div className="detail-divider"></div>

          {similarNews.length > 0 && (
            <section className="similar-section">
              <h2>SIMILAR NEWS</h2>

              <div className="similar-grid">
                {similarNews.map((article, index) => (
                  <article
                    key={`${article.url || article.title}-${index}`}
                    className="similar-card"
                    onClick={() => openArticle(article)}
                  >
                    <img
                      src={article.urlToImage || "/no-image.jpg"}
                      alt={article.title || "Similar news"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/no-image.jpg";
                      }}
                    />
                    <h3>{article.title || "Untitled article"}</h3>
                    <div className="meta">
                      <span>{article.author || article.source?.name || "Unknown"}</span>
                      <span className="dot"></span>
                      <span>
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer onLogoClick={closeArticle} />
      </div>
    );
  };

  return selectedArticle ? renderDetailPage() : renderListPage();
}

function TopBar({ showSearch = false, onSearchClick }) {
  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <span>◉ {formattedDate}</span>

        {showSearch ? (
          <div className="topbar-right-wrap">
            <span className="topbar-menu">The Menu</span>
            <span className="topbar-arrow">›</span>
            <button className="search-btn" onClick={onSearchClick}>
              <SearchIcon />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Header({ activeCategory, onCategoryClick, onLogoClick }) {
  return (
    <>
      <header className="site-header">
        <div className="container top-header-block">
          <div className="logo-wrap">
            <div className="logo" onClick={onLogoClick}>
              <img src="/logo-news.png" alt="TheNEWS" className="site-logo-image" />
            </div>
          </div>
        </div>
      </header>

      <div className="nav-sticky">
        <div className="container nav-sticky-inner">
          <nav className="nav">
            {categories.map((item) => (
              <button
                key={item}
                className={activeCategory === item ? "active" : ""}
                onClick={() => onCategoryClick(item)}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
function SearchIcon() {
  return (
    <svg
      className="search-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function Footer({ onLogoClick }) {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-logo" onClick={onLogoClick}>
          <img src="/logo-news.png" alt="TheNEWS" className="footer-logo-image" />
        </div>
      </div>

      <div className="container footer-bottom">
        <span>◉ Copyright © 2024 - The News - All rights reserved</span>
        <div className="socials">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>

          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>

          <a
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>

          <a
            href="https://www.reddit.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Reddit"
          >
            <FaRedditAlien />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default App;