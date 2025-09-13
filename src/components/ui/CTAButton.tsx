import Link from 'next/link';
import { ArrowRightIcon } from "@/components/icons/icons";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showArrow?: boolean;
  note?: string;
}

export default function CTAButton({ 
  href, 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  showArrow = true,
  note
}: CTAButtonProps) {
  const baseClasses = "font-light transition-all duration-100 transform flex items-center font-space-grotesk gap-2 group overflow-hidden relative w-fit";
  
  const variantClasses = {
    primary: "bg-orange-500 text-white",
    secondary: "bg-gray-900 text-white"
  };
  
  const sizeClasses = {
    sm: "p-3 px-6 text-sm",
    md: "p-4 px-8 text-md",
    lg: "p-5 px-10 text-lg"
  };

  return (
    <div className="flex gap-2 max-w-md flex-col">
      <Link
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
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
