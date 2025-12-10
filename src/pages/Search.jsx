import { useState, useEffect } from 'react';
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
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
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
        if (result.data.length === 0) {
          showToast('검색 결과가 없습니다.');
        }
      } else {
        showToast(result.message || '검색에 실패했습니다.');
        setMovies([]);
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
        if (result.data.length === 0) {
          showToast('해당 장르의 영화가 없습니다.');
        }
      } else {
        showToast('영화를 불러오는데 실패했습니다.');
        setMovies([]);
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

  // 검색 초기화
  const handleReset = () => {
    setSearchQuery('');
    setMovies([]);
    setSelectedGenre(null);
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

      {/* 장르 필터 */}
      <div className="genre-section">
        <h2 className="genre-title">장르별 탐색</h2>
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
                  총 {movies.length}개의 영화
                </p>
              </div>

              {movies.length > 0 ? (
                <div className="movie-grid">
                  {movies.map(movie => (
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
