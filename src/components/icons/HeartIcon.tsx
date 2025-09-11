import React from 'react';
import Icon from './Icon';

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
      <Icon 
        name={filled ? "heart-filled" : "heart"} 
        size={size} 
        color={color} 
      />
    </div>
  );
};

export default HeartIcon;
