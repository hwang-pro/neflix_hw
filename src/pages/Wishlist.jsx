import { useState, useEffect } from 'react';
import { getWishlist } from '../utils/storage';
import '../styles/Wishlist.css';

function Wishlist() {
  // 상태 관리
  const [wishlistMovies, setWishlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="wishlist-container">
      {/* 헤더 섹션 */}
      <div className="wishlist-header">
        <h1 className="wishlist-title">❤️ 내가 찜한 리스트</h1>
        <p className="wishlist-subtitle">나중에 보고 싶은 영화들을 모아보세요</p>
      </div>

      {/* 통계 정보 */}
      {wishlistMovies.length > 0 && (
        <div className="wishlist-stats">
          <span className="stats-text">
            총 <strong>{wishlistMovies.length}</strong>개의 영화
          </span>
        </div>
      )}
    </div>
  );
}

export default Wishlist;


