import styles from "./SearchOverlay.module.css";

function SearchOverlay({
  searchKeyword,
  setSearchKeyword,
  searchedArticles,
  onClose,
  onSelectArticle,
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Search articles</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          type="text"
          placeholder="Type to search any topic..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className={styles.input}
          autoFocus
        />

        <div className={styles.results}>
          {searchedArticles.length > 0 ? (
            searchedArticles.slice(0, 8).map((article, index) => (
              <div
                key={`${article.url || article.title}-${index}`}
                className={styles.resultItem}
                onClick={() => onSelectArticle(article)}
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
                  <p className={styles.resultTitle}>
                    {article.title || "Untitled article"}
                  </p>
                  <span className={styles.resultSource}>
                    {article.source?.name || "Unknown source"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No matching articles.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;