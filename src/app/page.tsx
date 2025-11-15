"use client";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import RPGSheet from "../components/RPGSheet"
import ImageMaskView from "../components/ImageMaskView"
import ImageMaskControls from "../components/ImageMaskControls"
import ImageUploadPanel from "../components/ImageUploadPanel"


const STORAGE_KEY = "imagemask:v1";

export default function Home() {
  const [posX, setPosX] = useState(0)
  const [posY, setPosY] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [imageSrc, setImageSrc] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")

  const handleFileSelect = (file: File) => {
    const reader = new FileReader()
    reader.onload = (evt) => setImageSrc(String(evt.target?.result || ""))
    reader.readAsDataURL(file)
    setFileName(file.name)
    setPosX(0)
    setPosY(0)
  }

  const handleReset = () => {
    setPosX(0);
    setPosY(0);
    setZoom(100);
  };

  // Carregar do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data?.posX === "number") setPosX(data.posX);
      if (typeof data?.posY === "number") setPosY(data.posY);
      if (typeof data?.zoom === "number") setZoom(data.zoom);
      if (typeof data?.imageSrc === "string") setImageSrc(data.imageSrc);
      if (typeof data?.fileName === "string") setFileName(data.fileName);
    } catch {}
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    try {
      const payload = { posX, posY, zoom, imageSrc, fileName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [posX, posY, zoom, imageSrc, fileName]);

  return (
    <>
      <div className="no-print">
        <Navbar />
      </div>
      <main className="flex-1 bg-background py-8 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center gap-4">
            <section id="sheet">
              <RPGSheet>
                <ImageMaskView
                  src={imageSrc}
                  className="imgUpload masked-image"
                  posX={posX}
                  posY={posY}
                  zoom={zoom}
                />
              </RPGSheet>
            </section>
            <div className="no-print">
              <section className="space-y-3">
                <ImageUploadPanel
                  onFileSelect={handleFileSelect}
                  filename={fileName}
                  previewSrc={imageSrc}
                  onClear={() => { setImageSrc(""); setFileName(""); }}
                />
                <ImageMaskControls
                  posX={posX}
                  posY={posY}
                  zoom={zoom}
                  onPosXChange={setPosX}
                  onPosYChange={setPosY}
                  onZoomChange={setZoom}
                  onReset={handleReset}
                />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-opacity hover:opacity-90"
                >
                  Imprimir / PDF
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
      <div className="no-print">
        <Footer />
      </div>
    </>
  )
}
