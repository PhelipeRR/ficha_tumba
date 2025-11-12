"use client";
import React, { useState } from "react";
import ImageMaskView from "./ImageMaskView";

interface MaskedImageUploadProps {
  className?: string;
  style?: React.CSSProperties;
  maskUrl?: string;
  posX?: number;
  posY?: number;
  zoom?: number;
}

const MaskedImageUpload: React.FC<MaskedImageUploadProps> = ({
  className = "imgUpload masked-image",
  style,
  maskUrl = "/masks/personagem-1.png",
  posX = 50,
  posY = 50,
  zoom = 100,
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setImageSrc(String(evt.target?.result || ""));
      reader.readAsDataURL(file);
      setPosX(50);
      setPosY(50);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background gap-5 font-sans">
      <ImageMaskView
        src={imageSrc}
        className={className}
        style={style}
        maskUrl={maskUrl}
        posX={posX}
        posY={posY}
        zoom={zoom}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="text-[20px] font-[CloisterBlack]"
      />
    </div>
  );
};

export default MaskedImageUpload;