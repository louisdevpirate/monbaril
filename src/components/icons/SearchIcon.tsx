import React from 'react';
import Icon from './Icon';

interface SearchIconProps {
  size?: number | string;
  className?: string;
  color?: string;
  onClick?: () => void;
}

const SearchIcon: React.FC<SearchIconProps> = ({ 
  size = 24, 
  className = '', 
  color = 'currentColor',
  onClick
}) => {
  return (
    <div 
      className={`cursor-pointer transition-colors duration-200 hover:text-orange-500 ${className}`}
      onClick={onClick}
    >
      <Icon 
        name="search" 
        size={size} 
        color={color} 
      />
    </div>
  );
};

export default SearchIcon;
