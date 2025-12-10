// TMDB API 연동 함수
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 이미지 URL 생성 헬퍼 함수
export const getImageUrl = (path) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${path}`;
};

// API 호출 기본 설정
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'ko-KR'
  }
});

// 에러 핸들링 헬퍼 함수
const handleApiError = (error) => {
  console.error('API 호출 에러:', error);
  if (error.response) {
    // 서버가 응답했지만 에러 상태 코드
    return {
      success: false,
      message: `API 에러: ${error.response.status}`,
      data: null
    };
  } else if (error.request) {
    // 요청은 보냈지만 응답이 없음
    return {
      success: false,
      message: '서버 응답이 없습니다.',
      data: null
    };
  } else {
    // 요청 설정 중 에러
    return {
      success: false,
      message: '요청 설정 중 에러가 발생했습니다.',
      data: null
    };
  }
};

// 인기 영화 조회
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await apiClient.get('/movie/popular', {
      params: { page }
    });
    return {
      success: true,
      data: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// 현재 상영 중인 영화 조회
export const fetchNowPlaying = async (page = 1) => {
  try {
    const response = await apiClient.get('/movie/now_playing', {
      params: { page }
    });
    return {
      success: true,
      data: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// 최고 평점 영화 조회
export const fetchTopRated = async (page = 1) => {
  try {
    const response = await apiClient.get('/movie/top_rated', {
      params: { page }
    });
    return {
      success: true,
      data: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// 개봉 예정 영화 조회
export const fetchUpcoming = async (page = 1) => {
  try {
    const response = await apiClient.get('/movie/upcoming', {
      params: { page }
    });
    return {
      success: true,
      data: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// 장르별 영화 조회
export const fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await apiClient.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page
      }
    });
    return {
      success: true,
      data: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// 장르 목록 조회
export const fetchGenres = async () => {
  try {
    const response = await apiClient.get('/genre/movie/list');
    return {
      success: true,
      data: response.data.genres
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// 영화 검색
export const searchMovies = async (query, page = 1) => {
  try {
    if (!query || query.trim() === '') {
      return {
        success: false,
        message: '검색어를 입력해주세요.',
        data: []
      };
    }
    
    const response = await apiClient.get('/search/movie', {
      params: {
        query: query.trim(),
        page
      }
    });
    return {
      success: true,
      data: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// 영화 상세 정보 조회
export const fetchMovieDetail = async (movieId) => {
  try {
    const response = await apiClient.get(`/movie/${movieId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// 필터링된 영화 검색 (장르, 평점, 정렬 등)
export const fetchFilteredMovies = async (filters = {}, page = 1) => {
  try {
    const params = {
      page,
      sort_by: filters.sortBy || 'popularity.desc'
    };
    
    // 장르 필터
    if (filters.genreId) {
      params.with_genres = filters.genreId;
    }
    
    // 평점 필터
    if (filters.minRating) {
      params['vote_average.gte'] = filters.minRating;
    }
    
    // 개봉일 필터
    if (filters.year) {
      params.primary_release_year = filters.year;
    }
    
    const response = await apiClient.get('/discover/movie', { params });
    return {
      success: true,
      data: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    return handleApiError(error);
  }
};



