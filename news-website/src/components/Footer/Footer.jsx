import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaRedditAlien,
} from "react-icons/fa";
import styles from "./Footer.module.css";

function Footer({ onLogoClick }) {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerTop}>
        <div className={styles.footerLogo} onClick={onLogoClick}>
          <img
            src="/logo-news.png"
            alt="TheNEWS"
            className={styles.footerLogoImage}
          />
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>◉ Copyright © 2024 - The News - All rights reserved</span>

        <div className={styles.socials}>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
            <FaYoutube />
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>
          <a href="https://www.reddit.com/" target="_blank" rel="noreferrer">
            <FaRedditAlien />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;