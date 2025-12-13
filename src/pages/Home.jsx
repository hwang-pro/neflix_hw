import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { 
  fetchPopularMovies, 
  fetchNowPlaying, 
  fetchTopRated, 
  fetchUpcoming 
} from '../utils/api';
import { useToast } from '../hooks/useToast';
import { useWishlist } from '../hooks/useWishlist';
import '../styles/Home.css';

function Home() {
  // Custom Hook 사용
  const { toast, showToast } = useToast(2000);
  const { isWished, handleToggleWish: toggleWish } = useWishlist();

  // 상태 관리
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 영화 데이터 로드
  useEffect(() => {
    loadAllMovies();
  }, []);

  // 모든 영화 섹션 로드
  const loadAllMovies = async () => {
    try {
      setLoading(true);

      // 4개의 API를 병렬로 호출
      const [popularRes, nowPlayingRes, topRatedRes, upcomingRes] = await Promise.all([
        fetchPopularMovies(1),
        fetchNowPlaying(1),
        fetchTopRated(1),
        fetchUpcoming(1)
      ]);

      // 성공 시 데이터 설정
      if (popularRes.success) setPopularMovies(popularRes.data);
      if (nowPlayingRes.success) setNowPlayingMovies(nowPlayingRes.data);
      if (topRatedRes.success) setTopRatedMovies(topRatedRes.data);
      if (upcomingRes.success) setUpcomingMovies(upcomingRes.data);

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

  // 로딩 중
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home-container">
      {/* 토스트 메시지 */}
      {toast.show && (
        <div className="toast">
          {toast.message}
        </div>
      )}

      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🎬 영화의 모든 것</h1>
          <p className="hero-subtitle">Netflix Clone에서 최신 영화를 만나보세요</p>
        </div>
      </section>

      {/* 섹션 1: 인기 영화 */}
      <MovieSection 
        title="🔥 인기 영화"
        movies={popularMovies}
        onToggleWish={handleToggleWish}
      />

      {/* 섹션 2: 현재 상영 중 */}
      <MovieSection 
        title="🎥 현재 상영 중"
        movies={nowPlayingMovies}
        onToggleWish={handleToggleWish}
      />

      {/* 섹션 3: 최고 평점 */}
      <MovieSection 
        title="⭐ 최고 평점"
        movies={topRatedMovies}
        onToggleWish={handleToggleWish}
      />

      {/* 섹션 4: 개봉 예정 */}
      <MovieSection 
        title="📅 개봉 예정"
        movies={upcomingMovies}
        onToggleWish={handleToggleWish}
      />
    </div>
  );
}

// 영화 섹션 컴포넌트
function MovieSection({ title, movies, onToggleWish }) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="movie-section">
      <h2 className="section-title">{title}</h2>
      <div className="movie-list">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isWished={isWished(movie.id)}
            onToggleWish={onToggleWish}
          />
        ))}
      </div>
    </section>
  );
}

export default Home;


