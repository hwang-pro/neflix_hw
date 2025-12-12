import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getWishlist, toggleWishlist } from '../utils/storage';
import '../styles/Wishlist.css';

function Wishlist() {
  // 상태 관리
  const [wishlistMovies, setWishlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  // 페이지 로드 시 찜 목록 불러오기
  useEffect(() => {
    loadWishlist();
  }, []);

  // 찜 목록 로드
  const loadWishlist = () => {
    const movies = getWishlist();
    setWishlistMovies(movies);
    setLoading(false);
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
        <h1 className="wishlist-title">❤️ 내가 찜한 리스트</h1>
        <p className="wishlist-subtitle">나중에 보고 싶은 영화들을 모아보세요</p>
      </div>

      {/* 찜 목록 */}
      {wishlistMovies.length > 0 && (
        <>
          {/* 통계 정보 */}
          <div className="wishlist-stats">
            <span className="stats-text">
              총 <strong>{wishlistMovies.length}</strong>개의 영화
            </span>
          </div>

          {/* 영화 그리드 */}
          <div className="movie-grid">
            {wishlistMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isWished={true}
                onToggleWish={handleToggleWish}
              />
            ))}
          </div>
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


