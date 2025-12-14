import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tryLogin, tryRegister, validateEmail } from '../utils/auth';
import { saveUser, isLoggedIn } from '../utils/storage';
import '../styles/SignIn.css';

function SignIn() {
  const navigate = useNavigate();

  // 상태 관리
  const [isLogin, setIsLogin] = useState(true); // true: 로그인, false: 회원가입
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 에러 및 메시지 상태
  const [emailError, setEmailError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // 이미 로그인되어 있으면 홈으로 리다이렉트
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  // 이메일 실시간 유효성 검증
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value) {
      const validation = validateEmail(value);
      setEmailError(validation.isValid ? '' : validation.message);
    } else {
      setEmailError('');
    }
  };

  // 로그인/회원가입 전환
  const toggleMode = () => {
    setIsLogin(!isLogin);
    // 입력값 초기화
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setAgreeTerms(false);
  };

  // 토스트 메시지 표시
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();

    // 입력값 공백 제거
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // 비동기 함수이므로 await 필요
    const result = await tryLogin(trimmedEmail, trimmedPassword);

    if (result.success) {
      showToast(result.message, 'success');

      // Remember Me 체크 시 이메일 저장
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', trimmedEmail);
      }

      // 1초 후 홈으로 이동
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      showToast(result.message, 'error');
    }
  };

  // 회원가입 처리
  const handleRegister = async (e) => {
    e.preventDefault();

    // 약관 동의 확인
    if (!agreeTerms) {
      showToast('약관에 동의해주세요.', 'error');
      return;
    }

    // 입력값 공백 제거
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    const result = await tryRegister(trimmedEmail, trimmedPassword, trimmedConfirm);

    if (result.success) {
      // 실제로 사용자 저장
      const saveResult = saveUser(trimmedEmail, trimmedPassword);

      if (saveResult.success) {
        showToast('회원가입이 완료되었습니다! 로그인해주세요.', 'success');

        // 1초 후 로그인 모드로 전환
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
          setAgreeTerms(false);
        }, 1500);
      } else {
        showToast(saveResult.message, 'error');
      }
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="signin-container">
      {/* 배경 그라데이션 */}
      <div className="signin-background"></div>

      {/* 토스트 메시지 */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* 메인 카드 (3D Flip) */}
      <div className="flip-container">
        <div className={`flipper ${!isLogin ? 'flipped' : ''}`}>

          {/* 앞면: 로그인 */}
          <div className="front">
            <div className="signin-card">
              <div className="card-inner">
                <div className="logo"><h1>NETFLIX</h1></div>
                <h2 className="card-title">로그인</h2>

                <form onSubmit={handleLogin} className="signin-form">
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder=" "
                      className={emailError ? 'input-error' : ''}
                      required
                    />
                    <label htmlFor="email">이메일</label>
                    {emailError && <span className="error-message">{emailError}</span>}
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="password">비밀번호</label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>로그인 상태 유지</span>
                    </label>
                  </div>

                  <button type="submit" className="submit-btn">로그인</button>
                </form>

                <div className="toggle-mode">
                  <p>
                    계정이 없으신가요?{' '}
                    <button onClick={toggleMode} className="toggle-btn">
                      회원가입
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 뒷면: 회원가입 */}
          <div className="back">
            <div className="signin-card">
              <div className="card-inner">
                <div className="logo"><h1>NETFLIX</h1></div>
                <h2 className="card-title">회원가입</h2>

                <form onSubmit={handleRegister} className="signin-form">
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder=" "
                      className={emailError ? 'input-error' : ''}
                      required
                    />
                    <label htmlFor="email">이메일</label>
                    {emailError && <span className="error-message">{emailError}</span>}
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="password">비밀번호</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder=" "
                      required
                    />
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span>이용약관 및 개인정보처리방침에 동의합니다.</span>
                    </label>
                  </div>

                  <button type="submit" className="submit-btn">회원가입</button>
                </form>

                <div className="toggle-mode">
                  <p>
                    이미 계정이 있으신가요?{' '}
                    <button onClick={toggleMode} className="toggle-btn">
                      로그인
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 데모 안내 */}
      <div className="demo-info">
        <p>💡 <strong>데모용 안내:</strong></p>
        <p>비밀번호는 TMDB API 키를 사용합니다.</p>
        <p>.env 파일에 REACT_APP_TMDB_API_KEY를 설정해주세요.</p>
      </div>
    </div>
  );
}

export default SignIn;
