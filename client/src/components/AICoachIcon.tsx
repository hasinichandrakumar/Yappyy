import { Brain, Cpu, Sparkles, Bot } from 'lucide-react';

interface AICoachIconProps {
  variant?: 'default' | 'brain' | 'circuit' | 'sparkle' | 'robot';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AICoachIcon({ 
  variant = 'default', 
  size = 'md',
  className = ''
}: AICoachIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getIcon = () => {
    switch (variant) {
      case 'brain':
        return <Brain className={`${iconClasses[size]} text-white`} />;
      case 'circuit':
        return <Cpu className={`${iconClasses[size]} text-white`} />;
      case 'sparkle':
        return <Sparkles className={`${iconClasses[size]} text-white`} />;
      case 'robot':
        return <Bot className={`${iconClasses[size]} text-white`} />;
      default:
        return <Brain className={`${iconClasses[size]} text-white`} />;
    }
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        bg-gradient-to-br from-blue-500 to-indigo-500 
        rounded-xl flex items-center justify-center 
        shadow-md hover:shadow-lg transition-shadow
        ${className}
      `}
    >
      {getIcon()}
    </div>
  );
}