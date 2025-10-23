import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const SlideInNotification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 4000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white', 
    error: 'bg-red-500 text-white',
    info: 'bg-primary text-white'
  };

  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ'
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        ${typeStyles[type]} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3
        transform transition-all duration-300 ease-out
        ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        <span className="text-lg">{icons[type]}</span>
        <span>{message}</span>
        <button 
          onClick={() => {
            setIsAnimating(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 hover:opacity-70"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SlideInNotification;