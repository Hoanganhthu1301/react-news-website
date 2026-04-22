export default function NewsCard({ article }) {
  return (
    <div className="news-card">
      <img
        src={article.urlToImage || "https://via.placeholder.com/300x180?text=No+Image"}
        alt={article.title}
      />
      <div className="news-card-content">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <a href={article.url} target="_blank" rel="noreferrer">
          Xem chi tiết
        </a>
      </div>
    </div>
  );
}