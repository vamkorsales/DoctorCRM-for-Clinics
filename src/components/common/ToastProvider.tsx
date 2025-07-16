import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast from './Toast';

interface ToastContextType {
  showToast: (message: string, type?: 'error' | 'success' | 'info', duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info'; duration?: number } | null>(null);

  const showToast = useCallback((message: string, type: 'error' | 'success' | 'info' = 'info', duration = 3500) => {
    setToast({ message, type, duration });
  }, []);

  const handleClose = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={handleClose} duration={toast.duration} />
      )}
    </ToastContext.Provider>
  );
}; 