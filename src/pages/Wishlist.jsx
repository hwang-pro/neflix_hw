import { useState, useEffect } from 'react';
import '../styles/Wishlist.css';

function Wishlist() {
  // 상태 관리
  const [wishlistMovies, setWishlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="wishlist-container">
      {/* 헤더 섹션 */}
      <div className="wishlist-header">
        <h1 className="wishlist-title">❤️ 내가 찜한 리스트</h1>
        <p className="wishlist-subtitle">나중에 보고 싶은 영화들을 모아보세요</p>
      </div>
    </div>
  );
}

export default Wishlist;


