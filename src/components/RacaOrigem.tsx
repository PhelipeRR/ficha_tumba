import React from "react";

interface ReusableInputProps {
  value: string;
  onChange: (val: string) => void;
  className?: string; // para controlar largura e posição via CSS
  placeholder?: string;
}

const ReusableInput: React.FC<ReusableInputProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "",
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`reusable-input bg-transparent border-b border-black/60 focus:outline-none text-sm ${className}`}
    />
  );
};

export default ReusableInput;
