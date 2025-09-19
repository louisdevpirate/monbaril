import React from 'react';

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
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="transition-colors duration-200"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </div>
  );
};

export default MenuIcon;
