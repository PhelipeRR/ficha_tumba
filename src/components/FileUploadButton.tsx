"use client";
import React, { useRef } from "react";

interface FileUploadButtonProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  filename?: string;
  accept?: string;
  className?: string;
  label?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onChange,
  filename,
  accept = "image/*",
  className,
  label = "Selecionar imagem",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <input
        ref={inputRef}
        id="file-input"
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M4 6a2 2 0 0 1 2-2h4.586a2 2 0 0 1 1.414.586l1.414 1.414A2 2 0 0 0 15.828 7H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm2 0v12h12V9h-2.172a2 2 0 0 1-1.414-.586L12 6H6z" />
        </svg>
        <span className="font-sans text-sm">{label}</span>
      </button>
      {filename && (
        <span className="truncate max-w-[260px] text-sm text-muted-foreground">{filename}</span>
      )}
    </div>
  );
};

export default FileUploadButton;