import { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import { getWishlist, toggleWishlist } from '../utils/storage';
import '../styles/Wishlist.css';

function Wishlist() {
  // 상태 관리
  const [wishlistMovies, setWishlistMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'infinite'
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showTopButton, setShowTopButton] = useState(false);
  const loadingRef = useRef(false);
  const itemsPerPage = 20;

  // 페이지 로드 시 찜 목록 불러오기
  useEffect(() => {
    loadWishlist();
  }, []);

  // 찜 목록 로드
  const loadWishlist = () => {
    const movies = getWishlist();
    setWishlistMovies(movies);
    
    // View 모드에 따라 표시할 영화 설정
    if (viewMode === 'table') {
      // Table View: 모든 영화 표시
      setDisplayedMovies(movies);
    } else {
      // Infinite Scroll: 첫 페이지만 표시
      setDisplayedMovies(movies.slice(0, itemsPerPage));
      setCurrentPage(1);
    }
    
    setLoading(false);
  };

  // View 모드 변경
  useEffect(() => {
    if (wishlistMovies.length > 0) {
      if (viewMode === 'table') {
        // Table View: 모든 영화 표시
        setDisplayedMovies(wishlistMovies);
      } else {
        // Infinite Scroll: 첫 페이지부터 시작
        setDisplayedMovies(wishlistMovies.slice(0, itemsPerPage));
        setCurrentPage(1);
      }
    } else {
      setDisplayedMovies([]);
    }
  }, [viewMode, wishlistMovies]);

  // 무한 스크롤: 다음 페이지 로드
  const loadMoreMovies = useCallback(() => {
    if (loadingRef.current || viewMode !== 'infinite') return;
    
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const nextMovies = wishlistMovies.slice(startIndex, endIndex);
    
    if (nextMovies.length > 0) {
      loadingRef.current = true;
      setLoadingMore(true);
      
      setTimeout(() => {
        setDisplayedMovies(prev => [...prev, ...nextMovies]);
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
        loadingRef.current = false;
      }, 500);
    }
  }, [viewMode, currentPage, wishlistMovies]);

  // 스크롤 이벤트 감지 (무한 스크롤용)
  useEffect(() => {
    if (viewMode === 'infinite') {
      const handleScroll = () => {
        // Top 버튼 표시/숨김
        if (window.scrollY > 500) {
          setShowTopButton(true);
        } else {
          setShowTopButton(false);
        }

        // 스크롤이 끝에 도달했는지 확인
        if (
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
          !loadingRef.current &&
          displayedMovies.length < wishlistMovies.length
        ) {
          loadMoreMovies();
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [viewMode, displayedMovies.length, wishlistMovies.length, loadMoreMovies]);

  // 맨 위로 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 찜하기 토글 (제거)
  const handleToggleWish = (movie) => {
    const result = toggleWishlist(movie);
    showToast(result.message);
    
    // 목록 새로고침
    loadWishlist();
  };

  // 토스트 메시지 표시
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2000);
  };

  // 모든 찜 목록 제거
  const handleClearAll = () => {
    if (window.confirm('모든 찜 목록을 삭제하시겠습니까?')) {
      localStorage.removeItem('wishlist');
      setWishlistMovies([]);
      showToast('모든 찜 목록이 삭제되었습니다.');
    }
  };

  return (
    <div className="wishlist-container">
      {/* 토스트 메시지 */}
      {toast.show && (
        <div className="toast">
          {toast.message}
        </div>
      )}

      {/* 헤더 섹션 */}
      <div className="wishlist-header">
        <div className="header-content">
          <h1 className="wishlist-title">❤️ 내가 찜한 리스트</h1>
          <p className="wishlist-subtitle">나중에 보고 싶은 영화들을 모아보세요</p>
        </div>
        <div className="header-actions">
          {/* View 모드 선택 */}
          {wishlistMovies.length > 0 && (
            <div className="view-mode-selector">
              <button
                onClick={() => setViewMode('table')}
                className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              >
                📋 Table View
              </button>
              <button
                onClick={() => setViewMode('infinite')}
                className={`view-mode-btn ${viewMode === 'infinite' ? 'active' : ''}`}
              >
                ♾️ Infinite Scroll
              </button>
            </div>
          )}
          {wishlistMovies.length > 0 && (
            <button onClick={handleClearAll} className="clear-all-btn">
              전체 삭제
            </button>
          )}
        </div>
      </div>

      {/* 찜 목록 */}
      {wishlistMovies.length > 0 && (
        <>
          {/* 통계 정보 */}
          <div className="wishlist-stats">
            <span className="stats-text">
              총 <strong>{wishlistMovies.length}</strong>개의 영화
              {viewMode === 'infinite' && displayedMovies.length < wishlistMovies.length && (
                <span className="displayed-count">
                  (표시: {displayedMovies.length}개)
                </span>
              )}
            </span>
          </div>

          {/* 영화 그리드 */}
          <div className={`movie-grid ${viewMode === 'table' ? 'table-view' : 'infinite-view'}`}>
            {displayedMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                genres={[]}
                isWished={true}
                onToggleWish={handleToggleWish}
              />
            ))}
          </div>

          {/* 무한 스크롤 로딩 */}
          {viewMode === 'infinite' && loadingMore && (
            <div className="loading-more">
              <div className="loading-spinner"></div>
              <p>더 많은 영화를 불러오는 중...</p>
            </div>
          )}

          {/* 무한 스크롤 완료 메시지 */}
          {viewMode === 'infinite' && 
           !loadingMore && 
           displayedMovies.length >= wishlistMovies.length && 
           wishlistMovies.length > itemsPerPage && (
            <div className="load-complete">
              <p>모든 영화를 불러왔습니다.</p>
            </div>
          )}

          {/* Top 버튼 (Infinite Scroll 모드) */}
          {viewMode === 'infinite' && showTopButton && (
            <button onClick={scrollToTop} className="top-button">
              ↑ Top
            </button>
          )}
        </>
      )}

      {/* 빈 상태 */}
      {wishlistMovies.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">💔</div>
          <h3>찜한 영화가 없습니다</h3>
          <p>영화 카드의 하트 아이콘을 클릭하여 찜 목록에 추가해보세요</p>
          <div className="empty-actions">
            <a href="/" className="browse-btn">
              영화 둘러보기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlist;


