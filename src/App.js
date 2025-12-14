import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Popular from './pages/Popular';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import { isLoggedIn } from './utils/storage';

// 환경 변수에 설정된 TMDB API 키를 콘솔에 출력 (개발용)
console.log('API Key:', process.env.REACT_APP_TMDB_API_KEY);

// Protected Route 컴포넌트
function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

// Scroll To Top component to fix scroll position on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="page-transition-wrapper">
        <div key={location.pathname} className="page-content fade-in">
          <Routes location={location}>
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/popular"
              element={
                <ProtectedRoute>
                  <Popular />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            {/* 존재하지 않는 경로는 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;