import { getImageUrl } from '../utils/api';
import '../styles/MovieCard.css';

function MovieCard({ movie, isWished, onToggleWish }) {
  // 영화 데이터 검증
  if (!movie) return null;

  const handleCardClick = (e) => {
    // 하트 아이콘 클릭 시에는 카드 클릭 무시
    if (e.target.closest('.wishlist-btn')) return;

    // 카드 클릭 시 찜하기 토글 (선택사항 - 영화 상세 페이지 이동 등으로 활용 가능)
    // onToggleWish(movie);
  };

  const handleWishClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onToggleWish(movie);
  };

  return (
    <div
      className={`movie-card ${isWished ? 'wished' : ''}`}
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
            {movie.overview && (
              <p className="movie-overview">
                {movie.overview.length > 80
                  ? `${movie.overview.substring(0, 80)}...`
                  : movie.overview}
              </p>
            )}
            <div className="movie-meta">
              {movie.vote_average > 0 && (
                <span className="movie-rating">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
              )}
              {movie.release_date && (
                <span className="movie-year">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
