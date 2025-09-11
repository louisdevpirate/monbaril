import React from 'react';
import Icon from './Icon';

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
      <Icon 
        name={filled ? "star-filled" : "star"} 
        size={size} 
        color={color} 
      />
    </div>
  );
};

export default StarIcon;
