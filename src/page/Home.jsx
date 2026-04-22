import { useEffect, useState } from "react";
import { getTopHeadlines } from "../services/newsApi";
import NewsCard from "../components/NewsCard";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      const data = await getTopHeadlines(category);
      setArticles(data);
    };
    fetchNews();
  }, [category]);

  return (
    <div className="container">
      <h1>Tin tức mới nhất</h1>

      <div className="categories">
        <button onClick={() => setCategory("")}>Tất cả</button>
        <button onClick={() => setCategory("business")}>Business</button>
        <button onClick={() => setCategory("technology")}>Technology</button>
        <button onClick={() => setCategory("sports")}>Sports</button>
        <button onClick={() => setCategory("health")}>Health</button>
      </div>

      <div className="news-grid">
        {articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
}