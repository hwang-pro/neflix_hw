// 인증 관련 유틸리티 함수
import { getUsers, login } from './storage';

// 이메일 형식 검증
export const validateEmail = (email) => {
  // 이메일 정규식 (기본적인 형식 확인)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, message: '이메일을 입력해주세요.' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '올바른 이메일 형식이 아닙니다.' };
  }
  
  return { isValid: true, message: '' };
};

// 비밀번호 검증 (TMDB API Key 형식)
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: '비밀번호를 입력해주세요.' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' };
  }
  
  return { isValid: true, message: '' };
};

// 비밀번호 확인 검증
export const validatePasswordConfirm = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: '비밀번호 확인을 입력해주세요.' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
  }
  
  return { isValid: true, message: '' };
};

// 로그인 시도
export const tryLogin = (email, password) => {
  // 이메일 검증
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return { success: false, message: emailValidation.message };
  }
  
  // 비밀번호 검증
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return { success: false, message: passwordValidation.message };
  }
  
  // 사용자 목록에서 해당 이메일 찾기
  const users = getUsers();
  const user = users.find(u => u.id === email);
  
  if (!user) {
    return { success: false, message: '등록되지 않은 이메일입니다.' };
  }
  
  // 비밀번호 확인
  if (user.password !== password) {
    return { success: false, message: '비밀번호가 일치하지 않습니다.' };
  }
  
  // 로그인 성공
  login(email);
  return { success: true, message: '로그인에 성공했습니다!' };
};

// 회원가입 시도
export const tryRegister = (email, password, confirmPassword) => {
  // 이메일 검증
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return { success: false, message: emailValidation.message };
  }
  
  // 비밀번호 검증
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return { success: false, message: passwordValidation.message };
  }
  
  // 비밀번호 확인 검증
  const confirmValidation = validatePasswordConfirm(password, confirmPassword);
  if (!confirmValidation.isValid) {
    return { success: false, message: confirmValidation.message };
  }
  
  // 이미 존재하는 이메일인지 확인
  const users = getUsers();
  const existingUser = users.find(u => u.id === email);
  
  if (existingUser) {
    return { success: false, message: '이미 존재하는 이메일입니다.' };
  }
  
  // 회원가입 성공 (실제 저장은 SignIn 컴포넌트에서 처리)
  return { success: true, message: '회원가입이 완료되었습니다!' };
};



