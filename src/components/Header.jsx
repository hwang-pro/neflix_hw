import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, getCurrentUser, logout } from '../utils/storage';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 상태 관리
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  
  // 로그인 상태 확인
  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setCurrentUser(getCurrentUser() || '');
  }, [location]); // 페이지 이동할 때마다 확인
  
  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setCurrentUser('');
    navigate('/signin');
  };
  
  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // 현재 페이지 확인 (메뉴 하이라이트용)
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // 로그인 안 했으면 Header 안 보이게
  if (!loggedIn) {
    return null;
  }
  
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* 로고 */}
        <Link to="/" className="logo">
          <h1>🎬 NETFLIX</h1>
        </Link>
        
        {/* 네비게이션 메뉴 (데스크탑) */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            홈
          </Link>
          <Link 
            to="/popular" 
            className={`nav-link ${isActive('/popular') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            대세 콘텐츠
          </Link>
          <Link 
            to="/search" 
            className={`nav-link ${isActive('/search') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            찾아보기
          </Link>
          <Link 
            to="/wishlist" 
            className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            내가 찜한 리스트
          </Link>
        </nav>
        
        {/* 사용자 정보 & 로그아웃 */}
        <div className="user-section">
          <span className="user-email">{currentUser}</span>
          <button onClick={handleLogout} className="logout-btn">
            로그아웃
          </button>
        </div>
        
        {/* 햄버거 메뉴 (모바일) */}
        <button 
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="메뉴"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;



