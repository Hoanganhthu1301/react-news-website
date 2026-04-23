import styles from "./SimilarNews.module.css";

function SimilarNews({ articles, onOpenArticle }) {
  if (!articles.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>SIMILAR NEWS</h2>
      <div className={styles.underline}></div>

      <div className={styles.grid}>
        {articles.map((article, index) => (
          <article
            key={`${article.url || article.title}-${index}`}
            className={styles.card}
            onClick={() => onOpenArticle(article)}
          >
            <img
              src={article.urlToImage || "/no-image.jpg"}
              alt={article.title || "Similar news"}
              className={styles.image}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/no-image.jpg";
              }}
            />

            <h3 className={styles.cardTitle}>
              {article.title || "Untitled article"}
            </h3>

            <div className={styles.meta}>
              <span>{article.source?.name || "World News"}</span>
              <span className={styles.dot}></span>
              <span>
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Sep 9, 2024"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SimilarNews;