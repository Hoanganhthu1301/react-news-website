import styles from "./Header.module.css";
import { categories } from "../../constants/newsData";

function Header({ activeCategory, onCategoryClick, onLogoClick }) {
  return (
    <>
      <header className={styles.siteHeader}>
        <div className={styles.topHeaderBlock}>
          <div className={styles.logoWrap}>
            <div className={styles.logo} onClick={onLogoClick}>
              <img
                src="/logo-news.png"
                alt="TheNEWS"
                className={styles.siteLogoImage}
              />
            </div>
          </div>
        </div>
      </header>

      <div className={styles.navSticky}>
        <div className={styles.navStickyInner}>
          <nav className={styles.nav}>
            {categories.map((item) => (
              <button
                key={item}
                className={activeCategory === item ? styles.active : ""}
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

export default Header;