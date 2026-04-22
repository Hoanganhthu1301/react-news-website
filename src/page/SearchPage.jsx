import { useState } from "react";
import { searchNews } from "../services/newsApi";
import NewsCard from "../components/NewsCard";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    const data = await searchNews(keyword);
    setArticles(data);
  };

  return (
    <div className="container">
      <h1>Tìm kiếm tin tức</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Nhập từ khóa..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">Tìm</button>
      </form>

      <div className="news-grid">
        {articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
}