"use client";
import React from "react";

interface ReusableTextareaProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
}

const ReusableTextarea: React.FC<ReusableTextareaProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "",
  rows = 3,
}) => {
  return (
    <textarea
      className={`reusable-textarea ${value ? "filled" : ""} ${className}`}
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default ReusableTextarea;
