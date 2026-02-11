import React from 'react';

interface WobblyArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const WobblyArrow: React.FC<WobblyArrowProps> = ({ 
  startX, 
  startY, 
  endX, 
  endY,
}) => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  
  // Bezier Control Points
  const cp1x = startX + deltaX * 0.5;
  const cp1y = startY;
  const cp2x = endX - deltaX * 0.5;
  const cp2y = endY;

  const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  const style = { color: '#8b5cf6', width: 3, opacity: 0.15, signal: '#a78bfa' };

  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0"
      style={{ minWidth: '100%', minHeight: '100%' }}
    >
      {/* Base Path */}
      <path
        d={pathD}
        stroke={style.color}
        strokeWidth={style.width}
        fill="none"
        strokeLinecap="round"
        className="transition-all duration-500"
        style={{ opacity: style.opacity }}
      />

      {/* Animated Signal Particle */}
      <circle r={3} fill={style.signal}>
        <animateMotion 
          dur="3s" 
          repeatCount="indefinite" 
          path={pathD}
          keyPoints="0;1"
          keyTimes="0;1"
          calcMode="linear"
        />
        <animate 
          attributeName="opacity" 
          values="0;1;1;0" 
          dur="3s" 
          repeatCount="indefinite" 
        />
      </circle>
      
      {/* Secondary trailing particle */}
      <circle r={2} fill={style.signal} opacity="0.5">
          <animateMotion 
          dur="3s" 
          begin="-0.2s"
          repeatCount="indefinite" 
          path={pathD}
          calcMode="linear"
        />
      </circle>
    </svg>
  );
};