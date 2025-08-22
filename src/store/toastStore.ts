import { create } from 'zustand';

interface ToastState {
  message: string;
  isVisible: boolean;
  type: 'info' | 'success' | 'error' | 'warning';
  showToast: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  isVisible: false,
  type: 'info',
  showToast: (message, type = 'info') => set({ message, type, isVisible: true }),
  hideToast: () => set({ isVisible: false, message: '', type: 'info' }),
}));
