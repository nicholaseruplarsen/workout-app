
// src/components/common/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={`
          w-full px-4 py-2 bg-gray-900/50 
          border border-gray-700 rounded-lg 
          text-white placeholder-gray-400 
          focus:ring-2 focus:ring-mw-red-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}