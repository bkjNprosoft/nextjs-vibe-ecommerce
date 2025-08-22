'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/store/toastStore';

const Toast = () => {
  const { message, isVisible, type, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast]);

  if (!isVisible) return null;

  const bgColorClass = () => {
    switch (type) {
      case 'success':
        return 'bg-success-700';
      case 'error':
        return 'bg-error-700';
      case 'warning':
        return 'bg-warning-700';
      case 'info':
      default:
        return 'bg-primary-700'; // Default info color
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white transition-all duration-300 transform translate-x-0 opacity-100 ${bgColorClass()}`}>
      {message}
    </div>
  );
};

export default Toast;
