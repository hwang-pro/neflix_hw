import { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { fetchPopularMovies } from '../utils/api';
import { useToast } from '../hooks/useToast';
import { useWishlist } from '../hooks/useWishlist';
import '../styles/Popular.css';

function Popular() {
  // Custom Hook 사용
  const { toast, showToast } = useToast(2000);
  const { isWished, handleToggleWish: toggleWish } = useWishlist();

  // useRef를 사용한 DOM 참조
  const scrollPositionRef = useRef(0);
  const containerRef = useRef(null);
  const loadingRef = useRef(false);

  // View 모드: 'table' 또는 'infinite'
  const [viewMode, setViewMode] = useState('table');

  // 상태 관리
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  // 페이지 로드 시 영화 데이터 가져오기
  useEffect(() => {
    loadMovies(1, false);
  }, []);

  // View 모드 변경 시 초기화
  useEffect(() => {
    if (viewMode === 'table') {
      // Table View: 첫 페이지로 리셋
      loadMovies(1, false);
      setShowTopButton(false);
    } else {
      // Infinite Scroll: 첫 페이지부터 시작
      loadMovies(1, false);
    }
  }, [viewMode]);

  // 무한 스크롤: 다음 페이지 로드
  const loadMoreMovies = useCallback(async () => {
    if (currentPage < totalPages && !loadingRef.current) {
      loadingRef.current = true;
      setLoadingMore(true);

      try {
        const result = await fetchPopularMovies(currentPage + 1);

        if (result.success) {
          setMovies(prev => [...prev, ...result.data]);
          setCurrentPage(prev => prev + 1);
        } else {
          showToast('영화 데이터를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('영화 데이터 로드 실패:', error);
        showToast('영화 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoadingMore(false);
        loadingRef.current = false;
      }
    }
  }, [currentPage, totalPages, showToast]);

  // 스크롤 이벤트 감지 (무한 스크롤용)
  useEffect(() => {
    if (viewMode === 'infinite') {
      const handleScroll = () => {
        // Top 버튼 표시/숨김
        if (window.scrollY > 500) {
          setShowTopButton(true);
        } else {
          setShowTopButton(false);
        }

        // 스크롤이 끝에 도달했는지 확인
        if (
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
          !loadingRef.current &&
          currentPage < totalPages
        ) {
          loadMoreMovies();
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [viewMode, currentPage, totalPages, loadMoreMovies]);

  // 페이지 변경 전 스크롤 위치 저장 (Table View용)
  useEffect(() => {
    if (viewMode === 'table') {
      scrollPositionRef.current = window.scrollY;
    }
  }, [currentPage, viewMode]);

  // 영화 데이터 로드 함수
  const loadMovies = async (page, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
        loadingRef.current = true;
      } else {
        setLoading(true);
      }

      const result = await fetchPopularMovies(page);

      if (result.success) {
        if (append) {
          // 무한 스크롤: 기존 영화에 추가
          setMovies(prev => [...prev, ...result.data]);
        } else {
          // Table View: 기존 영화 교체
          setMovies(result.data);
        }
        setCurrentPage(page);
        setTotalPages(result.totalPages);

        // Table View일 때 스크롤을 최상단으로 이동
        if (viewMode === 'table' && !append) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        showToast('영화 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('영화 데이터 로드 실패:', error);
      showToast('영화 데이터를 불러오는데 실패했습니다.');
    } finally {
      if (append) {
        setLoadingMore(false);
        loadingRef.current = false;
      } else {
        setLoading(false);
      }
    }
  };

  // 찜하기 토글
  const handleToggleWish = (movie) => {
    const result = toggleWish(movie);
    showToast(result.message);
  };

  // View 모드 전환
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Top 버튼 클릭
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 이전 페이지로 이동 (Table View용)
  const handlePrevPage = () => {
    if (currentPage > 1) {
      loadMovies(currentPage - 1, false);
    }
  };

  // 다음 페이지로 이동 (Table View용)
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      loadMovies(currentPage + 1, false);
    }
  };

  // 특정 페이지로 이동
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      loadMovies(page);
    }
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
    <div
      ref={containerRef}
      className={`popular-container ${viewMode === 'table' ? 'table-view' : 'infinite-view'}`}
    >
      {/* 토스트 메시지 */}
      {toast.show && (
        <div className="toast">
          {toast.message}
        </div>
      )}

      {/* 헤더 섹션 */}
      <div className="popular-header">
        <div className="header-content">
          <div>
            <h1 className="popular-title">🔥 대세 콘텐츠</h1>
            <p className="popular-subtitle">
              지금 가장 인기있는 영화들을 만나보세요
            </p>
          </div>

          {/* View 모드 선택 버튼 */}
          <div className="view-mode-selector">
            <button
              onClick={() => handleViewModeChange('table')}
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
            >
              📋 Table View
            </button>
            <button
              onClick={() => handleViewModeChange('infinite')}
              className={`view-mode-btn ${viewMode === 'infinite' ? 'active' : ''}`}
            >
              ♾️ 무한 스크롤
            </button>
          </div>
        </div>
      </div>

      {/* 로딩 중 */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* 영화 그리드 */}
          <div className={`movie-grid ${viewMode === 'table' ? 'table-grid' : 'infinite-grid'}`}>
            {movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isWished={isWished(movie.id)}
                onToggleWish={handleToggleWish}
              />
            ))}
          </div>

          {/* Table View: 페이지네이션 */}
          {viewMode === 'table' && totalPages > 1 && (
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
          )}

          {/* Table View: 페이지 정보 */}
          {viewMode === 'table' && (
            <div className="page-info">
              페이지 {currentPage} / {totalPages}
            </div>
          )}

          {/* Infinite Scroll: 로딩 더보기 */}
          {viewMode === 'infinite' && loadingMore && (
            <div className="loading-more">
              <Loading />
              <p>더 많은 영화를 불러오는 중...</p>
            </div>
          )}

          {/* Infinite Scroll: 더 이상 없음 */}
          {viewMode === 'infinite' && currentPage >= totalPages && movies.length > 0 && (
            <div className="no-more-movies">
              <p>모든 영화를 불러왔습니다.</p>
            </div>
          )}

          {/* Top 버튼 (무한 스크롤 모드일 때만) */}
          {viewMode === 'infinite' && showTopButton && (
            <button
              onClick={handleScrollToTop}
              className="top-button"
              aria-label="맨 위로"
            >
              ↑ Top
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Popular;


