import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

const toastStyles: Record<string, React.CSSProperties> = {
  base: {
    position: 'fixed',
    left: '50%',
    bottom: 40,
    transform: 'translateX(-50%)',
    minWidth: 240,
    maxWidth: 400,
    padding: '16px 24px',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    zIndex: 9999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    textAlign: 'center',
    opacity: 0.95,
  },
  error: { background: '#e74c3c' },
  success: { background: '#27ae60' },
  info: { background: '#3498db' },
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div style={{ ...toastStyles.base, ...toastStyles[type] }}>
      {message}
    </div>
  );
};

export default Toast; 