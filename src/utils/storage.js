// Local Storage 관리 유틸리티 함수

// 사용자 관련 함수
export const saveUser = (email, password) => {
  const users = getUsers();

  // 이미 존재하는 이메일인지 확인
  const existingUser = users.find(user => user.id === email);
  if (existingUser) {
    return { success: false, message: '이미 존재하는 이메일입니다.' };
  }

  // 새 사용자 추가
  users.push({ id: email, password });
  localStorage.setItem('users', JSON.stringify(users));

  return { success: true, message: '회원가입이 완료되었습니다.' };
};

export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getCurrentUser = () => {
  return localStorage.getItem('currentUser');
};

export const login = (email) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', email);
};

export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
};

// 찜한 영화 관련 함수
export const saveWishlist = (movies) => {
  localStorage.setItem('wishlist', JSON.stringify(movies));
};

export const getWishlist = () => {
  const wishlist = localStorage.getItem('wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

export const toggleWishlist = (movie) => {
  const wishlist = getWishlist();

  // 영화 객체에서 필요한 정보만 저장
  const movieData = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    overview: movie.overview
  };

  // 이미 찜한 영화인지 확인
  const existingIndex = wishlist.findIndex(item => item.id === movie.id);

  if (existingIndex > -1) {
    // 이미 있으면 제거
    wishlist.splice(existingIndex, 1);
    saveWishlist(wishlist);
    return { isWished: false, message: '찜 목록에서 제거되었습니다.' };
  } else {
    // 없으면 추가
    wishlist.push(movieData);
    saveWishlist(wishlist);
    return { isWished: true, message: '찜 목록에 추가되었습니다.' };
  }
};


export const isInWishlist = (movieId) => {
  const wishlist = getWishlist();
  return wishlist.some(movie => movie.id === movieId);
};

// 최근 검색어 기록 관리
const MAX_SEARCH_HISTORY = 10;

export const getSearchHistory = () => {
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : [];
};

export const saveSearchHistory = (keyword) => {
  if (!keyword || !keyword.trim()) return;

  const history = getSearchHistory();
  const trimmed = keyword.trim();

  // 중복 제거 (기존 검색어 삭제하고 맨 앞으로 이동)
  const filtered = history.filter(item => item !== trimmed);

  // 맨 앞에 추가
  filtered.unshift(trimmed);

  // 최대 개수 제한
  const newHistory = filtered.slice(0, MAX_SEARCH_HISTORY);

  localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  return newHistory;
};

export const clearSearchHistory = () => {
  localStorage.removeItem('searchHistory');
  return [];
};

export const removeSearchHistoryItem = (keyword) => {
  const history = getSearchHistory();
  const newHistory = history.filter(item => item !== keyword);
  localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  return newHistory;
};

