import styles from "./Home.module.css";
import TopBar from "../../components/TopBar/TopBar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import NewsCard from "../../components/NewsCard/NewsCard";

function Home({
  activeCategory,
  loading,
  error,
  articles,
  onCategoryClick,
  onLogoClick,
  onOpenArticle,
}) {
  return (
    <div className={styles.pageWrap}>
      <TopBar />
      <Header
        activeCategory={activeCategory}
        onCategoryClick={onCategoryClick}
        onLogoClick={onLogoClick}
      />

      <main className={styles.newsListPage}>
        <section className={styles.sectionHeader}>
          <h2>{activeCategory.toUpperCase()}</h2>
        </section>

        {loading && <p className={styles.emptyMessage}>Loading articles...</p>}
        {!loading && error && <p className={styles.emptyMessage}>{error}</p>}

        {!loading && !error && (
          <section className={styles.newsGrid}>
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <NewsCard
                  key={`${article.url || article.title}-${index}`}
                  article={article}
                  onClick={onOpenArticle}
                />
              ))
            ) : (
              <p className={styles.emptyMessage}>
                No readable articles in this category yet.
              </p>
            )}
          </section>
        )}
      </main>

      <Footer onLogoClick={onLogoClick} />
    </div>
  );
}

export default Home;