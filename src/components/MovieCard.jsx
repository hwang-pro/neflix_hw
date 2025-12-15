import { useState } from 'react';
import { getImageUrl } from '../utils/api';
import '../styles/MovieCard.css';

function MovieCard({ movie, genres = [], isWished, onToggleWish }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 영화 데이터 검증
  if (!movie) return null;

  // 장르 이름 가져오기
  const getGenreNames = (genreIds) => {
    if (!genreIds || !Array.isArray(genreIds) || genreIds.length === 0) return [];
    if (!genres || genres.length === 0) return [];
    
    return genreIds
      .map(id => genres.find(g => g.id === id))
      .filter(Boolean)
      .map(g => g.name)
      .slice(0, 2); // 최대 2개만 표시
  };

  const genreNames = getGenreNames(movie.genre_ids);

  const handleCardClick = (e) => {
    // 하트 아이콘 클릭 시에는 카드 클릭 무시
    if (e.target.closest('.wishlist-btn')) return;

    // 모바일 등에서 카드 탭 시 설명 토글
    setIsExpanded(prev => !prev);
  };

  const handleWishClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onToggleWish(movie);
  };

  return (
    <div
      className={`movie-card ${isWished ? 'wished' : ''} ${isExpanded ? 'expanded' : ''}`}
      onClick={handleCardClick}
    >
      {/* 영화 포스터 */}
      <div className="movie-poster">
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/placeholder-movie.jpg'; // 포스터 없을 때 대체 이미지
            }}
          />
        ) : (
          <div className="no-poster">
            <span>{movie.title}</span>
          </div>
        )}

        {/* 찜하기 버튼 */}
        <button
          className={`wishlist-btn ${isWished ? 'active' : ''}`}
          onClick={handleWishClick}
          aria-label={isWished ? '찜 목록에서 제거' : '찜 목록에 추가'}
        >
          <span className="heart-icon">
            {isWished ? '❤️' : '🤍'}
          </span>
        </button>

        {/* 호버 오버레이 */}
        <div className="movie-overlay">
          <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            
            {/* 영화 설명 (overview) - 필수 */}
            {movie.overview && (
              <div className="movie-overview">
                {movie.overview.length > 100 
                  ? `${movie.overview.substring(0, 100)}...` 
                  : movie.overview}
              </div>
            )}
            
            {/* 영화 평점 (Optional) */}
            {movie.vote_average && (
              <div className="movie-rating">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>
            )}
            
            {/* 영화 개봉일 (Optional) */}
            {movie.release_date && (
              <div className="movie-year">
                📅 {new Date(movie.release_date).getFullYear()}
              </div>
            )}
            
            {/* 영화 장르 (Optional) */}
            {genreNames.length > 0 && (
              <div className="movie-genres">
                🎭 {genreNames.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
