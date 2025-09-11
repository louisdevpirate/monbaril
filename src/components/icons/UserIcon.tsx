import React from 'react';
import Icon from './Icon';

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
      <Icon 
        name="user" 
        size={size} 
        color={color} 
      />
    </div>
  );
};

export default UserIcon;
