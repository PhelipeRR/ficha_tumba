"use client";
import React from "react";

interface ImageMaskViewProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  maskUrl?: string;
  posX?: number;
  posY?: number;
  zoom?: number;
}

const ImageMaskView: React.FC<ImageMaskViewProps> = ({
  src,
  className = "imgUpload masked-image",
  style,
  maskUrl = "/masks/personagem-1.png",
  posX = 50,
  posY = 50,
  zoom = 100,
}) => {
  if (!src) return null;

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${src})`,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundSize: `${zoom}%`,
        ...(maskUrl ? ({ ["--mask-url" as any]: `url('${maskUrl}')` } as React.CSSProperties) : {}),
        ...style,
      }}
    />
  );
};

export default ImageMaskView;