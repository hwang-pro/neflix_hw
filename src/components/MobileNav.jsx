import { Link, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/storage';
import '../styles/MobileNav.css';

function MobileNav() {
  const location = useLocation();

  if (!isLoggedIn()) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-nav">
      <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
        <span className="mobile-nav-icon">🏠</span>
        <span className="mobile-nav-label">홈</span>
      </Link>
      <Link
        to="/popular"
        className={`mobile-nav-item ${isActive('/popular') ? 'active' : ''}`}
      >
        <span className="mobile-nav-icon">🔥</span>
        <span className="mobile-nav-label">대세</span>
      </Link>
      <Link
        to="/search"
        className={`mobile-nav-item ${isActive('/search') ? 'active' : ''}`}
      >
        <span className="mobile-nav-icon">🔍</span>
        <span className="mobile-nav-label">찾기</span>
      </Link>
      <Link
        to="/wishlist"
        className={`mobile-nav-item ${isActive('/wishlist') ? 'active' : ''}`}
      >
        <span className="mobile-nav-icon">❤️</span>
        <span className="mobile-nav-label">찜</span>
      </Link>
    </nav>
  );
}

export default MobileNav;


