"use client";
import React, { useRef, useState } from "react";

interface ImageUploadPanelProps {
  onFileSelect: (file: File) => void;
  filename?: string;
  previewSrc?: string;
  accept?: string;
  className?: string;
  label?: string;
  onClear?: () => void;
}

const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({
  onFileSelect,
  filename,
  previewSrc,
  accept = "image/*",
  className,
  label = "Selecionar imagem",
  onClear,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      // limpa o valor do input para permitir escolher o mesmo arquivo novamente
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
      // não há input envolvido no drop, mas manter comportamento consistente
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className={`rounded-xl border border-border bg-card p-4 shadow ${className ?? ""}`}>
      <input
        ref={inputRef}
        id="image-upload-input"
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex items-center justify-start gap-4 w-[350px] rounded-lg border-2 ${dragActive ? "border-primary" : "border-dashed border-muted"} bg-muted/40 px-4 py-3 cursor-pointer transition hover:bg-muted`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-primary">
            <path d="M4 6a2 2 0 0 1 2-2h4.586a2 2 0 0 1 1.414.586l1.414 1.414A2 2 0 0 0 15.828 7H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm2 0v12h12V9h-2.172a2 2 0 0 1-1.414-.586L12 6H6z" />
          </svg>
          <span className="font-sans text-sm truncate whitespace-nowrap">{filename ? filename : label}</span>
        </div>
      </div>

      {(previewSrc || filename) && (
        <div className="mt-3 flex items-center gap-3">
          {previewSrc && (
            <img src={previewSrc} alt="Prévia" className="h-16 w-16 rounded-md object-cover border border-border" />
          )}
          {onClear && (
            <button
              type="button"
              onClick={() => { if (inputRef.current) inputRef.current.value = ""; onClear?.(); }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground shadow hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition"
            >
              Limpar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadPanel;