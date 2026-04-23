import styles from "./TopBar.module.css";
import SearchIcon from "../SearchIcon/SearchIcon";

function TopBar({ showSearch = false, onSearchClick }) {
  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={styles.topbar}>
      <div className={styles.inner}>
        <span>◉ {formattedDate}</span>

        {showSearch && (
          <div className={styles.rightWrap}>
            <span className={styles.menu}>The Menu</span>
            <span className={styles.arrow}>›</span>
            <button className={styles.searchBtn} onClick={onSearchClick}>
              <SearchIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;