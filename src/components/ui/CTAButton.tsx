import Link from 'next/link';
import { ArrowRightIcon } from "@/components/icons/icons";

interface CTAButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showArrow?: boolean;
  note?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

export default function CTAButton({ 
  href, 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  showArrow = true,
  note,
  type,
  disabled = false,
  onClick
}: CTAButtonProps) {
  const baseClasses = "font-light transition-all duration-100 transform flex items-center font-space-grotesk gap-2 group overflow-hidden relative w-fit";
  
  const variantClasses = {
    primary: "bg-orange-500 text-white rounded-lg",
    secondary: "bg-gray-900 text-white rounded-lg"
  };
  
  const sizeClasses = {
    sm: "p-3 px-6 text-sm",
    md: "p-4 px-8 text-md",
    lg: "p-5 px-10 text-lg"
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (href) {
    return (
      <div className="flex gap-2 max-w-md flex-col">
        <Link
          href={href}
          className={buttonClasses}
        >
          <span className="relative z-10 transition-all duration-300 group-hover:translate-x-8">
            {children}
          </span>
          {showArrow && (
            <>
              <ArrowRightIcon className="w-4 h-4 transition-all duration-300 group-hover:translate-x-32" />
              <ArrowRightIcon className="w-4 h-4 absolute left-0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-8" />
            </>
          )}
        </Link>
        {note && (
          <span className="text-gray-600 text-[10px] ml-2 italic">{note}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2 max-w-md flex-col">
      <button
        type={type || 'button'}
        disabled={disabled}
        onClick={onClick}
        className={buttonClasses}
      >
        <span className="relative z-10 transition-all duration-300 group-hover:translate-x-8">
          {children}
        </span>
        {showArrow && (
          <>
            <ArrowRightIcon className="w-4 h-4 transition-all duration-300 group-hover:translate-x-32" />
            <ArrowRightIcon className="w-4 h-4 absolute left-0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-8" />
          </>
        )}
      </button>
      {note && (
        <span className="text-gray-600 text-[10px] ml-2 italic">{note}</span>
      )}
    </div>
  );
}
