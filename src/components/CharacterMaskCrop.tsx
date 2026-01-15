"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

type CropPoint = { x: number; y: number };

interface CharacterMaskCropProps {
  src: string;
  maskUrl?: string;

  /** Salvar/restaurar estado do crop (recomendado salvar no localStorage junto da ficha) */
  value?: { crop: CropPoint; zoom: number } | null;
  onChange?: (v: { crop: CropPoint; zoom: number }) => void;

  /** Classe para posicionar (absolute) no lugar do buraco */
  className?: string;

  /** Qualidade do PNG de impressão (multiplicador) */
  printScale?: number; // ex: 2 = 2x
}

/** util: carrega imagem (pra desenhar em canvas) */
async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Gera um PNG recortado (igual ao cropper) e aplica a máscara (alpha)
 * - cropPixels: vem do onCropComplete
 * - maskUrl: png da máscara (branco/shape), usamos como alpha (destination-in)
 */
async function renderMaskedPng(options: {
  imageSrc: string;
  maskUrl: string;
  cropPixels: Area;
  outputW: number;
  outputH: number;
  scale?: number;
}): Promise<string> {
  const { imageSrc, maskUrl, cropPixels, outputW, outputH, scale = 2 } = options;

  const img = await loadImage(imageSrc);
  const mask = await loadImage(maskUrl);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(outputW * scale);
  canvas.height = Math.round(outputH * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // desenha a parte recortada da imagem no canvas final
  // cropPixels está em pixels da imagem original
  ctx.drawImage(
    img,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // aplica máscara como alpha
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";

  return canvas.toDataURL("image/png");
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function CharacterMaskCrop({
  src,
  maskUrl = "/masks/personagem-1.png",
  value,
  onChange,
  className,
  printScale = 2,
}: CharacterMaskCropProps) {
  if (!src) return null;

  // Estado controlável (se você quiser salvar no localStorage)
  const [crop, setCrop] = useState<CropPoint>(value?.crop ?? { x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(value?.zoom ?? 1);

  // crop final em pixels da imagem (para export)
  const [cropPixels, setCropPixels] = useState<Area | null>(null);

  // container real (tamanho do buraco na tela)
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [boxSize, setBoxSize] = useState<{ w: number; h: number }>({ w: 300, h: 300 });

  const [printUrl, setPrintUrl] = useState<string | null>(null);

  // mantém sincronizado com prop value (se pai controlar)
  useEffect(() => {
    if (!value) return;
    setCrop(value.crop);
    setZoom(value.zoom);
  }, [value?.crop?.x, value?.crop?.y, value?.zoom]); // intencionalmente granular

  // observa tamanho do box (pra export bater perfeito)
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setBoxSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) });
    });
    ro.observe(el);

    // set inicial
    const r = el.getBoundingClientRect();
    setBoxSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) });

    return () => ro.disconnect();
  }, []);

  const emitChange = useCallback(
    (next: { crop: CropPoint; zoom: number }) => {
      onChange?.(next);
    },
    [onChange]
  );

  const onCropChange = useCallback(
    (c: CropPoint) => {
      setCrop(c);
      emitChange({ crop: c, zoom });
    },
    [emitChange, zoom]
  );

  const onZoomChange = useCallback(
    (z: number) => {
      const zz = clamp(z, 0.25, 4);
      setZoom(zz);
      emitChange({ crop, zoom: zz });
    },
    [emitChange, crop]
  );

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCropPixels(areaPixels);
  }, []);

  // botão: “Ajustar” (encaixa melhor imagens pequenas/medias automaticamente)
  const handleFit = useCallback(async () => {
    // regra simples: reseta crop e coloca um zoom “confortável”
    // (a pessoa ainda pode ajustar depois)
    setCrop({ x: 0, y: 0 });

    // tentativa esperta: se imagem for pequena, joga zoom mais baixo
    try {
      const im = await loadImage(src);
      const maxSide = Math.max(im.width, im.height);
      // quanto menor a imagem, menor o zoom inicial
      const nextZoom =
        maxSide < 900 ? 0.65 :
        maxSide < 1400 ? 0.8 :
        maxSide < 2200 ? 1.0 : 1.15;

      const z = clamp(nextZoom, 0.25, 4);
      setZoom(z);
      emitChange({ crop: { x: 0, y: 0 }, zoom: z });
    } catch {
      // fallback
      setZoom(1);
      emitChange({ crop: { x: 0, y: 0 }, zoom: 1 });
    }
  }, [emitChange, src]);

  // gera printUrl quando tiver cropPixels (igual preview)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!cropPixels) return;
      const url = await renderMaskedPng({
        imageSrc: src,
        maskUrl,
        cropPixels,
        outputW: boxSize.w,
        outputH: boxSize.h,
        scale: printScale,
      });
      if (alive) setPrintUrl(url);
    })();
    return () => {
      alive = false;
    };
  }, [src, maskUrl, cropPixels, boxSize.w, boxSize.h, printScale]);

  return (
    <>
      {/* SCREEN */}
      <div className={`screen-only ${className ?? ""}`} ref={boxRef} style={{ position: "absolute" }}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={boxSize.w / boxSize.h} // mantém o crop encaixado no retângulo do buraco
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
          cropShape="rect"
          showGrid={false}
          minZoom={0.25}   // ✅ bem menor que “80%”
          maxZoom={4}
          zoomWithScroll
          restrictPosition={false} // ✅ não “trava” no A4
          objectFit="cover"
        />

        {/* Overlay da máscara por cima */}
        <img
          src={maskUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* Controles (opcional) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -44,
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "rgba(0,0,0,0.35)",
            padding: "6px 8px",
            borderRadius: 10,
          }}
        >
          <button
            type="button"
            onClick={handleFit}
            style={{
              fontSize: 12,
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
            }}
          >
            Ajustar
          </button>

          <input
            type="range"
            min={0.25}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            style={{ width: 180 }}
          />
        </div>
      </div>

      {/* PRINT */}
      {printUrl && (
        <img
          className={`print-only ${className ?? ""}`}
          src={printUrl}
          alt="portrait"
          style={{
            position: "absolute",
            width: `${boxSize.w}px`,
            height: `${boxSize.h}px`,
          }}
        />
      )}
    </>
  );
}
