import { useState, useEffect } from 'react';
import { toggleWishlist, isInWishlist, getWishlist } from '../utils/storage';

/**
 * 찜 목록을 관리하는 Custom Hook
 * @returns {Object} { wishlist, isWished, handleToggleWish, refreshWishlist }
 */
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // 초기 찜 목록 로드
  useEffect(() => {
    refreshWishlist();
  }, []);

  const refreshWishlist = () => {
    const movies = getWishlist();
    setWishlist(movies);
  };

  const checkIsWished = (movieId) => {
    return isInWishlist(movieId);
  };

  const handleToggleWish = (movie) => {
    const result = toggleWishlist(movie);
    refreshWishlist();
    return result;
  };

  return {
    wishlist,
    isWished: checkIsWished,
    handleToggleWish,
    refreshWishlist
  };
};






