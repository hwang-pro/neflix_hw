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
  // 랜덤한 추천 영화 선택
  const featuredMovie = popularMovies[0];

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
      {featuredMovie && (
        <section
          className="hero-section"
          style={{
            backgroundImage: `linear-gradient(to top, #141414, transparent 50%),
                            linear-gradient(to right, #141414 0%, transparent 50%),
                            url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-overview">{featuredMovie.overview?.slice(0, 150)}...</p>
            <div className="hero-buttons">
              <button className="play-btn">
                <span className="icon">▶</span> 재생
              </button>
              <button className="info-btn">
                <span className="icon">ⓘ</span> 상세 정보
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 섹션 1: 오늘의 TOP 10 */}
      <section className="movie-section top-10-section">
        <h2 className="section-title">오늘 대한민국의 TOP 10 시리즈</h2>
        <div className="movie-list top-10-list">
          {popularMovies.slice(0, 10).map((movie, index) => (
            <div key={movie.id} className="top-10-item">
              <span className="rank-number">{index + 1}</span>
              <MovieCard
                movie={movie}
                isWished={isWished(movie.id)}
                onToggleWish={handleToggleWish}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 섹션 2: 인기 영화 */}
      <MovieSection
        title="🔥 인기 영화"
        movies={popularMovies}
        isWished={isWished}
        onToggleWish={handleToggleWish}
      />

      {/* 섹션 3: 현재 상영 중 */}
      <MovieSection
        title="🎥 현재 상영 중"
        movies={nowPlayingMovies}
        isWished={isWished}
        onToggleWish={handleToggleWish}
      />

      {/* 섹션 4: 최고 평점 */}
      <MovieSection
        title="⭐ 최고 평점"
        movies={topRatedMovies}
        isWished={isWished}
        onToggleWish={handleToggleWish}
      />

      {/* 섹션 5: 개봉 예정 */}
      <MovieSection
        title="📅 개봉 예정"
        movies={upcomingMovies}
        isWished={isWished}
        onToggleWish={handleToggleWish}
      />
    </div>
  );
}

// 영화 섹션 컴포넌트
function MovieSection({ title, movies, isWished, onToggleWish }) {
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


