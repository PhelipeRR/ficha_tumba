"use client";
import React from "react";

interface ImageMaskControlsProps {
  posX: number;
  posY: number;
  zoom: number;
  onPosXChange: (val: number) => void;
  onPosYChange: (val: number) => void;
  onZoomChange: (val: number) => void;
  onReset?: () => void;
}

const ImageMaskControls: React.FC<ImageMaskControlsProps> = ({
  posX,
  posY,
  zoom,
  onPosXChange,
  onPosYChange,
  onZoomChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow-md w-96 font-sans">
      <div className="flex items-center gap-2">
        <label htmlFor="posX" className="w-20">Pos. Horizontal:</label>
        <input
          id="posX"
          type="range"
          min="-300"
          max="300"
          value={posX}
          onChange={(e) => onPosXChange(Number(e.target.value))}
          className="w-full"
        />
        <span className="w-10 text-right">{posX}%</span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="posY" className="w-20">Pos. Vertical:</label>
        <input
          id="posY"
          type="range"
          min="-300"
          max="300"
          value={posY}
          onChange={(e) => onPosYChange(Number(e.target.value))}
          className="w-full"
        />
        <span className="w-10 text-right">{posY}%</span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <label htmlFor="zoom" className="w-20">Zoom:</label>
        <input
          id="zoom"
          type="range"
          min="50"
          max="500"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full"
        />
        <span className="w-10 text-right">{zoom}%</span>
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-2 w-full text-sm bg-muted text-muted-foreground rounded-md px-3 py-2 transition-opacity hover:opacity-90"
        >
          Resetar Posição
        </button>
      )}
    </div>
  );
};

export default ImageMaskControls;