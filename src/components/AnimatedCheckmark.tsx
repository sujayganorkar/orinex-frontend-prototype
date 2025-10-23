import React, { useState, useEffect } from 'react';

interface AnimatedCheckmarkProps {
  isVisible: boolean;
  size?: 'sm' | 'md' | 'lg';
  onAnimationComplete?: () => void;
}

const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({ 
  isVisible, 
  size = 'md',
  onAnimationComplete 
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimate(true);
      const timer = setTimeout(() => {
        onAnimationComplete?.();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  if (!isVisible) return null;

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg
        className={`${sizeClasses[size]} text-green-500 transition-all duration-300 ${
          animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className={animate ? 'animate-pulse' : ''}
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4"
          className={`${animate ? 'animate-[checkmark_0.6s_ease-in-out]' : ''}`}
        />
      </svg>
    </div>
  );
};

export default AnimatedCheckmark;