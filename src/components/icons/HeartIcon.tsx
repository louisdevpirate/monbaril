import React from 'react';

interface HeartIconProps {
  size?: number | string;
  className?: string;
  color?: string;
  filled?: boolean;
  onClick?: () => void;
}

const HeartIcon: React.FC<HeartIconProps> = ({ 
  size = 24, 
  className = '', 
  color = 'currentColor',
  filled = false,
  onClick
}) => {
  return (
    <div 
      className={`cursor-pointer transition-colors duration-200 hover:text-orange-500 ${className}`}
      onClick={onClick}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill={filled ? color : "none"} 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="transition-colors duration-200"
      >
        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </div>
  );
};

export default HeartIcon;
