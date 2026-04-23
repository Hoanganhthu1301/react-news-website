import styles from "./ArticleDetail.module.css";
import TopBar from "../../components/TopBar/TopBar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SearchOverlay from "../../components/SearchOverlay/SearchOverlay";
import SimilarNews from "../../components/SimilarNews/SimilarNews";
import {
  getPreviewParagraphs,
  getFullTextParagraphs,
} from "../../utils/articleUtils";

function ArticleDetail({
  activeCategory,
  selectedArticle,
  fullArticle,
  articleLoading,
  articleError,
  searchOpen,
  setSearchOpen,
  searchKeyword,
  setSearchKeyword,
  searchedArticles,
  onCategoryClick,
  onLogoClick,
  onCloseArticle,
  onOpenArticle,
  similarNews,
}) {
  const fullTextParagraphs = getFullTextParagraphs(fullArticle);
  const previewParagraphs = getPreviewParagraphs(selectedArticle);

  const paragraphs =
    !articleLoading && fullTextParagraphs.length > 0
      ? fullTextParagraphs
      : previewParagraphs;

  return (
    <div className={styles.pageWrap}>
      <TopBar showSearch onSearchClick={() => setSearchOpen(true)} />

      <Header
        activeCategory={activeCategory}
        onCategoryClick={onCategoryClick}
        onLogoClick={onLogoClick}
      />

      {searchOpen && (
        <SearchOverlay
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          searchedArticles={searchedArticles}
          onClose={() => setSearchOpen(false)}
          onSelectArticle={(article) => {
            setSearchOpen(false);
            onOpenArticle(article);
          }}
        />
      )}

      <main className={styles.detailContainer}>
        <div className={styles.heroWrap}>
          <img
            src={selectedArticle?.urlToImage || "/no-image.jpg"}
            alt={selectedArticle?.title || "News detail"}
            className={styles.heroImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/no-image.jpg";
            }}
          />
        </div>

        <div className={styles.authorSection}>
          <div className={styles.authorRow}>
            <div className={styles.authorAvatar}>
              {(selectedArticle?.author || selectedArticle?.source?.name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className={styles.authorInfo}>
              <strong>
                {selectedArticle?.author ||
                  selectedArticle?.source?.name ||
                  "Unknown author"}
              </strong>
              <span>
                {selectedArticle?.publishedAt
                  ? new Date(selectedArticle.publishedAt).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : "No date"}
              </span>
            </div>
          </div>
        </div>

        <h1 className={styles.detailTitle}>
          {fullArticle?.title || selectedArticle?.title || "UNTITLED ARTICLE"}
        </h1>

        <div className={styles.contentDivider}></div>

        <div className={styles.detailContent}>
          {articleLoading ? (
            <p>Loading full article...</p>
          ) : (
            paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          )}

          {articleError && (
            <p className={styles.softNote}>
              Showing summary version of this article.
            </p>
          )}

          {selectedArticle?.url && (
            <a
              href={selectedArticle.url}
              target="_blank"
              rel="noreferrer"
              className={styles.readOriginalBtn}
            >
              Read original article
            </a>
          )}
        </div>

        <div className={styles.sectionDivider}></div>

        <SimilarNews articles={similarNews} onOpenArticle={onOpenArticle} />
      </main>

      <Footer onLogoClick={onLogoClick} />
    </div>
  );
}

export default ArticleDetail;