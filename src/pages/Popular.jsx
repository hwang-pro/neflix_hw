import { useState, useEffect, useRef } from 'react';
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

  // useRef를 사용한 스크롤 위치 저장
  const scrollPositionRef = useRef(0);

  // 상태 관리
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // 페이지 로드 시 영화 데이터 가져오기
  useEffect(() => {
    loadMovies(1);
  }, []);

  // 페이지 변경 전 스크롤 위치 저장
  useEffect(() => {
    scrollPositionRef.current = window.scrollY;
  }, [currentPage]);

  // 영화 데이터 로드 후 스크롤 위치 복원
  useEffect(() => {
    if (movies.length > 0 && !loading) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPositionRef.current, behavior: 'smooth' });
      }, 100);
    }
  }, [movies, loading]);

  // 영화 데이터 로드 함수
  const loadMovies = async (page) => {
    try {
      setLoading(true);
      const result = await fetchPopularMovies(page);

      if (result.success) {
        setMovies(result.data);
        setCurrentPage(page);
        setTotalPages(result.totalPages);
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

  // 찜하기 토글
  const handleToggleWish = (movie) => {
    const result = toggleWish(movie);
    showToast(result.message);
  };

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 1) {
      loadMovies(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      loadMovies(currentPage + 1);
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
    <div className="popular-container">
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
      </div>

      {/* 로딩 중 */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* 영화 그리드 */}
          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isWished={isWished(movie.id)}
                onToggleWish={handleToggleWish}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
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

          {/* 페이지 정보 */}
          <div className="page-info">
            페이지 {currentPage} / {totalPages}
          </div>
        </>
      )}
    </div>
  );
}

export default Popular;


