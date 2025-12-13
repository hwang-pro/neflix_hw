import { useState } from 'react';

/**
 * 토스트 메시지를 관리하는 Custom Hook
 * @param {number} duration - 토스트 메시지 표시 시간 (밀리초, 기본값: 2000)
 * @returns {Object} { toast, showToast, hideToast }
 */
export const useToast = (duration = 2000) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, duration);
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  return { toast, showToast, hideToast };
};

