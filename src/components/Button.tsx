// Componente Button básico sem Tailwind
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  style,
  ...props 
}: ButtonProps) {
  // Estilos básicos inline sem dependência do Tailwind
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '4px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px',
    fontSize: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
    ...style,
  };

  // Variantes sem depender do Tailwind
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#20639B',
      color: 'white',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#20639B',
      border: '1px solid #20639B',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#20639B',
      border: 'none',
    }
  };

  return (
    <button 
      style={{ ...baseStyle, ...variantStyles[variant] }} 
      {...props} 
    />
  );
}
