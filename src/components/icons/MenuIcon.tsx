import React from 'react';
import Icon from './Icon';

interface MenuIconProps {
  size?: number | string;
  className?: string;
  color?: string;
  onClick?: () => void;
}

const MenuIcon: React.FC<MenuIconProps> = ({ 
  size = 24, 
  className = '', 
  color = 'currentColor',
  onClick
}) => {
  return (
    <div 
      className={`cursor-pointer transition-colors duration-200 ${className}`}
      onClick={onClick}
    >
      <Icon 
        name="menu" 
        size={size} 
        color={color} 
      />
    </div>
  );
};

export default MenuIcon;
