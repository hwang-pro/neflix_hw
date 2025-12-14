import { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { fetchPopularMovies } from '../utils/api';
import { isInWishlist, toggleWishlist } from '../utils/storage';
import '../styles/Popular.css';

function Popular() {
  // View mode: 'table' or 'infinite'
  const [viewMode, setViewMode] = useState('table');

  // 상태 관리
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Infinite scroll specific
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  // 페이지 로드 시 영화 데이터 가져오기
  useEffect(() => {
    loadMovies(1, true);
  }, []);

  // View mode 변경 시 초기화
  useEffect(() => {
    if (viewMode === 'table') {
      // Table view로 전환 시 첫 페이지로 리셋
      setMovies([]);
      loadMovies(1, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Infinite scroll로 전환 시 첫 페이지로 리셋
      setMovies([]);
      setCurrentPage(1);
      setHasMore(true);
      loadMovies(1, true);
    }
  }, [viewMode]);

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
    if (viewMode !== 'infinite') return;

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
  }, [viewMode, hasMore, isLoadingMore, loading, currentPage]);

  // 영화 데이터 로드 함수
  const loadMovies = async (page, replace = false) => {
    try {
      setLoading(true);
      const result = await fetchPopularMovies(page);

      if (result.success) {
        if (replace) {
          setMovies(result.data);
        } else {
          setMovies(prev => [...prev, ...result.data]);
        }
        setCurrentPage(page);
        setTotalPages(result.totalPages);
        setHasMore(page < result.totalPages);

        // 페이지 변경 시 스크롤을 최상단으로 이동 (table view only)
        if (viewMode === 'table') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        showToast('영화 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('영화 데이터 로드 실패:', error);
      showToast('영화 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Load more for infinite scroll
  const loadMoreMovies = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const result = await fetchPopularMovies(nextPage);

      if (result.success) {
        setMovies(prev => [...prev, ...result.data]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < result.totalPages);
      }
    } catch (error) {
      console.error('추가 영화 로드 실패:', error);
    } finally {
      setIsLoadingMore(false);
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

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 1) {
      loadMovies(currentPage - 1, true);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      loadMovies(currentPage + 1, true);
    }
  };

  // 특정 페이지로 이동
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      loadMovies(page, true);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지 번호 렌더링 (최대 5개씩)
  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // 처음 페이지
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className="page-number"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-start" className="dots">...</span>);
      }
    }

    // 중간 페이지들
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

    // 마지막 페이지
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-end" className="dots">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className="page-number"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={`popular-container ${viewMode === 'table' ? 'table-view' : 'infinite-view'}`}>
      {/* 토스트 메시지 */}
      {toast.show && (
        <div className="toast">
          {toast.message}
        </div>
      )}

      {/* 헤더 섹션 */}
      <div className="popular-header">
        <h1 className="popular-title">🔥 대세 콘텐츠</h1>
        <p className="popular-subtitle">
          지금 가장 인기있는 영화들을 만나보세요
        </p>

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

      {/* 로딩 중 (초기 로딩만) */}
      {loading && movies.length === 0 ? (
        <Loading />
      ) : (
        <>
          {/* 영화 그리드 */}
          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard
                key={`${movie.id}-${viewMode}`}
                movie={movie}
                isWished={isInWishlist(movie.id)}
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
            <>
              <div className="pagination">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ◀ 이전
                </button>

                <div className="page-numbers">
                  {renderPageNumbers()}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  다음 ▶
                </button>
              </div>

              {/* 페이지 정보 */}
              <div className="page-info">
                페이지 {currentPage} / {totalPages}
              </div>
            </>
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

export default Popular;