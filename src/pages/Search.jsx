import { useState, useEffect, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { 
  searchMovies, 
  fetchGenres, 
  fetchMoviesByGenre 
} from '../utils/api';
import { isInWishlist, toggleWishlist } from '../utils/storage';
import '../styles/Search.css';

function Search() {
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, rating, release_date
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // 장르 목록 로드
  useEffect(() => {
    loadGenres();
  }, []);

  // 장르 목록 가져오기
  const loadGenres = async () => {
    try {
      const result = await fetchGenres();
      if (result.success) {
        setGenres(result.data);
      }
    } catch (error) {
      console.error('장르 목록 로드 실패:', error);
    }
  };

  // 검색어로 영화 검색
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      showToast('검색어를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      setSelectedGenre(null); // 장르 필터 초기화

      const result = await searchMovies(searchQuery);
      
      if (result.success) {
        setMovies(result.data);
        applyFilters(result.data);
        if (result.data.length === 0) {
          showToast('검색 결과가 없습니다.');
        }
      } else {
        showToast(result.message || '검색에 실패했습니다.');
        setMovies([]);
        setFilteredMovies([]);
      }
    } catch (error) {
      console.error('검색 실패:', error);
      showToast('검색 중 오류가 발생했습니다.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // 장르로 필터링
  const handleGenreClick = async (genreId) => {
    try {
      setLoading(true);
      setHasSearched(true);
      setSearchQuery(''); // 검색어 초기화
      setSelectedGenre(genreId);

      const result = await fetchMoviesByGenre(genreId);
      
      if (result.success) {
        setMovies(result.data);
        applyFilters(result.data);
        if (result.data.length === 0) {
          showToast('해당 장르의 영화가 없습니다.');
        }
      } else {
        showToast('영화를 불러오는데 실패했습니다.');
        setMovies([]);
        setFilteredMovies([]);
      }
    } catch (error) {
      console.error('장르별 영화 로드 실패:', error);
      showToast('영화를 불러오는 중 오류가 발생했습니다.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // 찜하기 토글
  const handleToggleWish = (movie) => {
    const result = toggleWishlist(movie);
    showToast(result.message);
  };

  // 토스트 메시지 표시
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2000);
  };

  // 필터링 적용 함수
  const applyFilters = (movieList) => {
    let filtered = [...movieList];

    // 평점 필터
    if (minRating > 0) {
      filtered = filtered.filter(movie => 
        movie.vote_average >= minRating
      );
    }

    // 개봉년도 필터
    if (year) {
      filtered = filtered.filter(movie => {
        if (!movie.release_date) return false;
        const movieYear = new Date(movie.release_date).getFullYear();
        return movieYear.toString() === year;
      });
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0);
        case 'release_date':
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
          return dateB - dateA;
        case 'popularity':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    setFilteredMovies(filtered);
  };

  // 필터 변경 시 적용
  useEffect(() => {
    if (movies.length > 0) {
      applyFilters(movies);
    } else {
      setFilteredMovies([]);
    }
  }, [movies, applyFilters]);

  // 검색 초기화
  const handleReset = () => {
    setSearchQuery('');
    setMovies([]);
    setFilteredMovies([]);
    setSelectedGenre(null);
    setMinRating(0);
    setSortBy('popularity');
    setYear('');
    setHasSearched(false);
  };

  return (
    <div className="search-container">
      {/* 토스트 메시지 */}
      {toast.show && (
        <div className="toast">
          {toast.message}
        </div>
      )}

      {/* 검색 헤더 */}
      <div className="search-header">
        <h1 className="search-title">🔍 찾아보기</h1>
        <p className="search-subtitle">원하는 영화를 검색하거나 장르별로 탐색해보세요</p>
      </div>

      {/* 검색바 */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="영화 제목을 입력하세요..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            검색
          </button>
          {(searchQuery || hasSearched) && (
            <button 
              type="button" 
              onClick={handleReset} 
              className="reset-btn"
            >
              초기화
            </button>
          )}
        </div>
      </form>

      {/* 필터 섹션 */}
      <div className="filters-section">
        {/* 장르 필터 */}
        <div className="filter-group">
          <h3 className="filter-title">🎭 장르별 탐색</h3>
          <div className="genre-list">
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* 필터링 옵션 */}
        {hasSearched && movies.length > 0 && (
          <div className="filter-options">
            <h3 className="filter-title">🔧 필터링 옵션</h3>
            
            {/* 평점 필터 */}
            <div className="filter-item">
              <label htmlFor="minRating">최소 평점: {minRating > 0 ? `${minRating}+` : '전체'}</label>
              <input
                type="range"
                id="minRating"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="rating-slider"
              />
            </div>

            {/* 정렬 옵션 */}
            <div className="filter-item">
              <label htmlFor="sortBy">정렬 기준:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popularity">인기순</option>
                <option value="rating">평점순</option>
                <option value="release_date">개봉일순</option>
              </select>
            </div>

            {/* 개봉년도 필터 */}
            <div className="filter-item">
              <label htmlFor="year">개봉년도:</label>
              <input
                type="number"
                id="year"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="전체"
                className="year-input"
              />
            </div>

            {/* 필터 초기화 버튼 */}
            {(minRating > 0 || sortBy !== 'popularity' || year) && (
              <button
                onClick={() => {
                  setMinRating(0);
                  setSortBy('popularity');
                  setYear('');
                }}
                className="filter-reset-btn"
              >
                필터 초기화
              </button>
            )}
          </div>
        )}
      </div>

      {/* 로딩 중 */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* 검색 결과 */}
          {hasSearched && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="results-title">
                  {selectedGenre 
                    ? `${genres.find(g => g.id === selectedGenre)?.name} 영화`
                    : `"${searchQuery}" 검색 결과`
                  }
                </h2>
                <p className="results-count">
                  총 {filteredMovies.length}개의 영화
                  {filteredMovies.length !== movies.length && (
                    <span className="filtered-count">
                      (전체 {movies.length}개 중)
                    </span>
                  )}
                </p>
              </div>

              {filteredMovies.length > 0 ? (
                <div className="movie-grid">
                  {filteredMovies.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isWished={isInWishlist(movie.id)}
                      onToggleWish={handleToggleWish}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎬</div>
                  <h3>검색 결과가 없습니다</h3>
                  <p>다른 검색어나 장르를 시도해보세요</p>
                </div>
              )}
            </div>
          )}

          {/* 초기 상태 */}
          {!hasSearched && (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>영화를 검색해보세요</h3>
              <p>검색어를 입력하거나 장르를 선택하여 영화를 찾아보세요</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Search;
