import React from 'react';

interface UserIconProps {
  size?: number | string;
  className?: string;
  color?: string;
  onClick?: () => void;
}

const UserIcon: React.FC<UserIconProps> = ({ 
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
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
};

export default UserIcon;
