import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { useToast } from '../hooks/useToast';
import { useWishlist } from '../hooks/useWishlist';
import '../styles/Wishlist.css';

function Wishlist() {
  // Custom Hook 사용
  const { toast, showToast } = useToast(2000);
  const { wishlist, handleToggleWish: toggleWish, refreshWishlist } = useWishlist();

  // 상태 관리
  const [loading, setLoading] = useState(true);

  // 페이지 로드 시 찜 목록 불러오기
  useEffect(() => {
    refreshWishlist();
    setLoading(false);
  }, [refreshWishlist]);

  // 찜하기 토글 (제거)
  const handleToggleWish = (movie) => {
    const result = toggleWish(movie);
    showToast(result.message);
    refreshWishlist();
  };

  // 모든 찜 목록 제거
  const handleClearAll = () => {
    if (window.confirm('모든 찜 목록을 삭제하시겠습니까?')) {
      localStorage.removeItem('wishlist');
      refreshWishlist();
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
        {wishlist.length > 0 && (
          <button onClick={handleClearAll} className="clear-all-btn">
            전체 삭제
          </button>
        )}
      </div>

      {/* 찜 목록 */}
      {wishlist.length > 0 && (
        <>
          {/* 통계 정보 */}
          <div className="wishlist-stats">
            <span className="stats-text">
              총 <strong>{wishlist.length}</strong>개의 영화
            </span>
          </div>

          {/* 영화 그리드 */}
          <div className="movie-grid">
            {wishlist.map(movie => (
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
      {wishlist.length === 0 && !loading && (
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


