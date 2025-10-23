import React from 'react';

interface PulseEffectProps {
  children: React.ReactNode;
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  color?: 'primary' | 'warning' | 'success';
}

const PulseEffect: React.FC<PulseEffectProps> = ({ 
  children, 
  isActive, 
  intensity = 'medium',
  color = 'primary' 
}) => {
  const intensityClasses = {
    low: 'animate-pulse',
    medium: 'animate-[pulse_1s_ease-in-out_infinite]',
    high: 'animate-[pulse_0.5s_ease-in-out_infinite]'
  };

  const colorClasses = {
    primary: 'ring-primary/50',
    warning: 'ring-yellow-400/50', 
    success: 'ring-green-400/50'
  };

  return (
    <div className={`
      relative transition-all duration-300
      ${isActive ? `ring-4 ${colorClasses[color]} ${intensityClasses[intensity]}` : ''}
    `}>
      {children}
      {isActive && (
        <div className={`
          absolute -inset-1 rounded-lg opacity-30 blur-sm
          ${color === 'primary' && 'bg-primary'}
          ${color === 'warning' && 'bg-yellow-400'}
          ${color === 'success' && 'bg-green-400'}
          ${intensityClasses[intensity]}
        `} />
      )}
    </div>
  );
};

export default PulseEffect;