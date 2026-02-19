import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false, 
  icon,
  disabled,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 focus:ring-indigo-500",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm focus:ring-gray-200",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 focus:ring-rose-500",
    ghost: "text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-200"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};