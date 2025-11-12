"use client";
import React from "react";

interface ImageMaskControlsProps {
  posX: number;
  posY: number;
  zoom: number;
  onPosXChange: (val: number) => void;
  onPosYChange: (val: number) => void;
  onZoomChange: (val: number) => void;
}

const ImageMaskControls: React.FC<ImageMaskControlsProps> = ({
  posX,
  posY,
  zoom,
  onPosXChange,
  onPosYChange,
  onZoomChange,
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded shadow-md w-96 font-sans">
      <div className="flex items-center gap-2">
        <label htmlFor="posX" className="w-20">Pos. Horizontal:</label>
        <input
          id="posX"
          type="range"
          min="0"
          max="100"
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
          min="0"
          max="100"
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
          min="80"
          max="200"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full"
        />
        <span className="w-10 text-right">{zoom}%</span>
      </div>
    </div>
  );
};

export default ImageMaskControls;