import styles from "./NewsCard.module.css";
import { formatDate } from "../../utils/articleUtils";

function NewsCard({ article, onClick }) {
  return (
    <article className={styles.card} onClick={() => onClick(article)}>
      <div className={styles.imageWrap}>
        <img
          src={article.urlToImage || "/no-image.jpg"}
          alt={article.title || "News image"}
          className={styles.image}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/no-image.jpg";
          }}
        />
      </div>

      <div className={styles.body}>
        <h3>{article.title || "Untitled article"}</h3>

        <div className={styles.meta}>
          <span>{article.author || article.source?.name || "Unknown"}</span>
          <span className={styles.dot}></span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;