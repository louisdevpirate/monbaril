import React from 'react';

interface StarIconProps {
  size?: number | string;
  className?: string;
  color?: string;
  filled?: boolean;
  onClick?: () => void;
}

const StarIcon: React.FC<StarIconProps> = ({ 
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
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </div>
  );
};

export default StarIcon;
