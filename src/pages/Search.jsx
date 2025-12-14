import { useState, useEffect, useRef } from 'react';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import {
  searchMovies,
  fetchGenres,
  fetchFilteredMovies
} from '../utils/api';
import { useToast } from '../hooks/useToast';
import { useWishlist } from '../hooks/useWishlist';
import '../styles/Search.css';

function Search() {
  // Custom Hook 사용
  const { toast, showToast } = useToast(2000);
  const { isWished, handleToggleWish: toggleWish } = useWishlist();

  // useRef를 사용한 DOM 참조
  const searchInputRef = useRef(null);
  const observerTarget = useRef(null);

  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // View mode: 'table' or 'infinite'
  const [viewMode, setViewMode] = useState('infinite');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 필터 상태
  const [filters, setFilters] = useState({
    genreId: '',
    minRating: '',
    year: '',
    sortBy: 'popularity.desc'
  });

  // 장르 목록 로드
  useEffect(() => {
    loadGenres();
  }, []);

  // 페이지 로드 시 검색 입력 필드에 자동 포커스
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Scroll event listener for "scroll to top" button
  useEffect(() => {
    if (viewMode === 'infinite') {
      const handleScroll = () => {
        setShowScrollTop(window.scrollY > 500);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [viewMode]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (viewMode !== 'infinite' || !hasSearched) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading) {
          loadMoreMovies();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [viewMode, hasMore, isLoadingMore, loading, currentPage, hasSearched]);

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
      setCurrentPage(1);

      const result = await searchMovies(searchQuery, 1);

      if (result.success) {
        setMovies(result.data);
        setTotalPages(result.totalPages || 1);
        setHasMore(1 < (result.totalPages || 1));

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

  // 필터 적용
  const applyFilters = async (page = 1, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }
      setHasSearched(true);

      const result = await fetchFilteredMovies(filters, page);

      if (result.success) {
        if (append) {
          setMovies(prev => [...prev, ...result.data]);
        } else {
          setMovies(result.data);
        }
        setCurrentPage(page);
        setTotalPages(result.totalPages || 1);
        setHasMore(page < (result.totalPages || 1));

        if (result.data.length === 0 && !append) {
          showToast('필터 조건에 맞는 영화가 없습니다.');
        }
      } else {
        showToast('영화를 불러오는데 실패했습니다.');
        if (!append) setMovies([]);
      }
    } catch (error) {
      console.error('필터링 실패:', error);
      showToast('영화를 불러오는 중 오류가 발생했습니다.');
      if (!append) setMovies([]);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Load more for infinite scroll
  const loadMoreMovies = async () => {
    if (isLoadingMore || !hasMore) return;

    const nextPage = currentPage + 1;

    if (searchQuery.trim()) {
      // Search mode
      try {
        setIsLoadingMore(true);
        const result = await searchMovies(searchQuery, nextPage);

        if (result.success) {
          setMovies(prev => [...prev, ...result.data]);
          setCurrentPage(nextPage);
          setHasMore(nextPage < (result.totalPages || 1));
        }
      } catch (error) {
        console.error('추가 검색 결과 로드 실패:', error);
      } finally {
        setIsLoadingMore(false);
      }
    } else {
      // Filter mode
      applyFilters(nextPage, true);
    }
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 필터 적용 버튼
  const handleApplyFilters = () => {
    setSearchQuery(''); // 검색어 초기화
    setCurrentPage(1);
    applyFilters(1, false);
  };

  // 찜하기 토글
  const handleToggleWish = (movie) => {
    const result = toggleWish(movie);
    showToast(result.message);
  };

  // 전체 초기화
  const handleReset = () => {
    setSearchQuery('');
    setMovies([]);
    setHasSearched(false);
    setCurrentPage(1);
    setFilters({
      genreId: '',
      minRating: '',
      year: '',
      sortBy: 'popularity.desc'
    });
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지네이션 (Table View)
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      if (searchQuery.trim()) {
        // Search mode: reload from API
        const loadPage = async () => {
          try {
            setLoading(true);
            const result = await searchMovies(searchQuery, page);
            if (result.success) {
              setMovies(result.data);
              setCurrentPage(page);
              setTotalPages(result.totalPages || 1);
            }
          } catch (error) {
            console.error('페이지 로드 실패:', error);
          } finally {
            setLoading(false);
          }
        };
        loadPage();
      } else {
        // Filter mode: reload from API
        applyFilters(page, false);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageClick(1)} className="page-number">1</button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-start" className="dots">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`page-number ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-end" className="dots">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageClick(totalPages)} className="page-number">
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  // 현재 연도 계산
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // Table View에서 표시할 영화 목록 (첫 20개만)
  const displayMovies = viewMode === 'table' ? movies.slice(0, 20) : movies;

  return (
    <div className={`search-container ${viewMode === 'table' ? 'table-view' : 'infinite-view'}`}>
      {/* 토스트 메시지 */}
      {toast.show && (
        <div className="toast">
          {toast.message}
        </div>
      )}

      {/* 검색 헤더 */}
      <div className="search-header">
        <h1 className="search-title">🔍 찾아보기</h1>
        <p className="search-subtitle">원하는 영화를 검색하고 다양한 필터로 탐색해보세요</p>

        {/* View Mode Toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <span className="toggle-icon">📋</span>
            Table View
          </button>
          <button
            className={`toggle-btn ${viewMode === 'infinite' ? 'active' : ''}`}
            onClick={() => setViewMode('infinite')}
          >
            <span className="toggle-icon">∞</span>
            Infinite Scroll
          </button>
        </div>
      </div>

      {/* 검색바 */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="영화 제목을 입력하세요..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍 검색
          </button>
        </div>
      </form>

      {/* 필터 패널 */}
      <div className="filter-panel">
        <h2 className="filter-title">🎛️ 고급 필터</h2>

        <div className="filter-grid">
          {/* 장르 필터 */}
          <div className="filter-group">
            <label className="filter-label">장르</label>
            <select
              value={filters.genreId}
              onChange={(e) => handleFilterChange('genreId', e.target.value)}
              className="filter-select"
            >
              <option value="">모든 장르</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* 평점 필터 */}
          <div className="filter-group">
            <label className="filter-label">최소 평점</label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="filter-select"
            >
              <option value="">전체</option>
              <option value="9">⭐ 9.0 이상</option>
              <option value="8">⭐ 8.0 이상</option>
              <option value="7">⭐ 7.0 이상</option>
              <option value="6">⭐ 6.0 이상</option>
              <option value="5">⭐ 5.0 이상</option>
            </select>
          </div>

          {/* 개봉년도 필터 */}
          <div className="filter-group">
            <label className="filter-label">개봉년도</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="filter-select"
            >
              <option value="">전체</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </div>

          {/* 정렬 */}
          <div className="filter-group">
            <label className="filter-label">정렬</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="popularity.desc">인기순 (높은순)</option>
              <option value="popularity.asc">인기순 (낮은순)</option>
              <option value="vote_average.desc">평점순 (높은순)</option>
              <option value="vote_average.asc">평점순 (낮은순)</option>
              <option value="release_date.desc">개봉일 (최신순)</option>
              <option value="release_date.asc">개봉일 (오래된순)</option>
            </select>
          </div>
        </div>

        {/* 필터 버튼 */}
        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="apply-filter-btn">
            ✨ 필터 적용
          </button>
          <button onClick={handleReset} className="reset-filter-btn">
            🔄 초기화
          </button>
        </div>
      </div>

      {/* 로딩 중 */}
      {loading && movies.length === 0 ? (
        <Loading />
      ) : (
        <>
          {/* 검색 결과 */}
          {hasSearched && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="results-title">
                  {searchQuery
                    ? `"${searchQuery}" 검색 결과`
                    : '필터 결과'
                  }
                </h2>
                <p className="results-count">
                  총 {movies.length}개의 영화
                </p>
              </div>

              {displayMovies.length > 0 ? (
                <>
                  <div className="movie-grid">
                    {displayMovies.map(movie => (
                      <MovieCard
                        key={`${movie.id}-${viewMode}`}
                        movie={movie}
                        isWished={isWished(movie.id)}
                        onToggleWish={handleToggleWish}
                      />
                    ))}
                  </div>

                  {/* Infinite Scroll: Observer Target & Loading */}
                  {viewMode === 'infinite' && (
                    <>
                      <div ref={observerTarget} className="observer-target" />
                      {isLoadingMore && (
                        <div className="loading-more">
                          <div className="spinner"></div>
                          <p>더 많은 영화를 불러오는 중...</p>
                        </div>
                      )}
                      {!hasMore && movies.length > 0 && (
                        <div className="no-more-content">
                          <p>모든 영화를 불러왔습니다 🎬</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Table View: 페이지네이션 */}
                  {viewMode === 'table' && totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                      >
                        ◀ 이전
                      </button>

                      <div className="page-numbers">
                        {renderPageNumbers()}
                      </div>

                      <button
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                      >
                        다음 ▶
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎬</div>
                  <h3>검색 결과가 없습니다</h3>
                  <p>다른 검색어나 필터를 시도해보세요</p>
                </div>
              )}
            </div>
          )}

          {/* 초기 상태 */}
          {!hasSearched && (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>영화를 검색해보세요</h3>
              <p>검색어를 입력하거나 필터를 적용하여 영화를 찾아보세요</p>
            </div>
          )}
        </>
      )}

      {/* Scroll to Top Button (Infinite Scroll only) */}
      {viewMode === 'infinite' && showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <span className="arrow-up">↑</span>
          <span className="top-text">TOP</span>
        </button>
      )}
    </div>
  );
}

export default Search;
