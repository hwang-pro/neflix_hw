import { useState, useEffect } from 'react';
import { fetchPopularMovies, fetchNowPlaying, fetchTopRated, fetchUpcoming } from '../utils/api';

/**
 * 영화 데이터를 로드하는 Custom Hook
 * @param {string} type - 영화 타입 ('popular' | 'nowPlaying' | 'topRated' | 'upcoming')
 * @param {number} initialPage - 초기 페이지 번호 (기본값: 1)
 * @returns {Object} { movies, loading, error, loadMovies, currentPage, totalPages }
 */
export const useMovies = (type = 'popular', initialPage = 1) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = async (page) => {
    let result;
    
    switch (type) {
      case 'popular':
        result = await fetchPopularMovies(page);
        break;
      case 'nowPlaying':
        result = await fetchNowPlaying(page);
        break;
      case 'topRated':
        result = await fetchTopRated(page);
        break;
      case 'upcoming':
        result = await fetchUpcoming(page);
        break;
      default:
        result = await fetchPopularMovies(page);
    }

    return result;
  };

  const loadMovies = async (page = initialPage) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMovies(page);

      if (result.success) {
        setMovies(result.data);
        setCurrentPage(page);
        setTotalPages(result.totalPages || 0);
      } else {
        setError(result.message || '영화 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('영화 데이터 로드 실패:', err);
      setError('영화 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(initialPage);
  }, [type]); // type이 변경되면 다시 로드

  return {
    movies,
    loading,
    error,
    loadMovies,
    currentPage,
    totalPages
  };
};

import { fetchPopularMovies, fetchNowPlaying, fetchTopRated, fetchUpcoming } from '../utils/api';

/**
 * 영화 데이터를 로드하는 Custom Hook
 * @param {string} type - 영화 타입 ('popular' | 'nowPlaying' | 'topRated' | 'upcoming')
 * @param {number} initialPage - 초기 페이지 번호 (기본값: 1)
 * @returns {Object} { movies, loading, error, loadMovies, currentPage, totalPages }
 */
export const useMovies = (type = 'popular', initialPage = 1) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = async (page) => {
    let result;
    
    switch (type) {
      case 'popular':
        result = await fetchPopularMovies(page);
        break;
      case 'nowPlaying':
        result = await fetchNowPlaying(page);
        break;
      case 'topRated':
        result = await fetchTopRated(page);
        break;
      case 'upcoming':
        result = await fetchUpcoming(page);
        break;
      default:
        result = await fetchPopularMovies(page);
    }

    return result;
  };

  const loadMovies = async (page = initialPage) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMovies(page);

      if (result.success) {
        setMovies(result.data);
        setCurrentPage(page);
        setTotalPages(result.totalPages || 0);
      } else {
        setError(result.message || '영화 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('영화 데이터 로드 실패:', err);
      setError('영화 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(initialPage);
  }, [type]); // type이 변경되면 다시 로드

  return {
    movies,
    loading,
    error,
    loadMovies,
    currentPage,
    totalPages
  };
};

import { fetchPopularMovies, fetchNowPlaying, fetchTopRated, fetchUpcoming } from '../utils/api';

/**
 * 영화 데이터를 로드하는 Custom Hook
 * @param {string} type - 영화 타입 ('popular' | 'nowPlaying' | 'topRated' | 'upcoming')
 * @param {number} initialPage - 초기 페이지 번호 (기본값: 1)
 * @returns {Object} { movies, loading, error, loadMovies, currentPage, totalPages }
 */
export const useMovies = (type = 'popular', initialPage = 1) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = async (page) => {
    let result;
    
    switch (type) {
      case 'popular':
        result = await fetchPopularMovies(page);
        break;
      case 'nowPlaying':
        result = await fetchNowPlaying(page);
        break;
      case 'topRated':
        result = await fetchTopRated(page);
        break;
      case 'upcoming':
        result = await fetchUpcoming(page);
        break;
      default:
        result = await fetchPopularMovies(page);
    }

    return result;
  };

  const loadMovies = async (page = initialPage) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMovies(page);

      if (result.success) {
        setMovies(result.data);
        setCurrentPage(page);
        setTotalPages(result.totalPages || 0);
      } else {
        setError(result.message || '영화 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('영화 데이터 로드 실패:', err);
      setError('영화 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(initialPage);
  }, [type]); // type이 변경되면 다시 로드

  return {
    movies,
    loading,
    error,
    loadMovies,
    currentPage,
    totalPages
  };
};



