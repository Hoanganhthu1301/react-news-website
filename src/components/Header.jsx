import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">News Website</div>
      <nav>
        <Link to="/">Trang chủ</Link>
        <Link to="/search">Tìm kiếm</Link>
      </nav>
    </header>
  );
}