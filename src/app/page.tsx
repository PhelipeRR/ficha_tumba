"use client";
import { useState } from "react";
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import RPGSheet from "../components/RPGSheet"
import ImageMaskView from "../components/ImageMaskView"
import ImageMaskControls from "../components/ImageMaskControls"
import ImageUploadPanel from "../components/ImageUploadPanel"


export default function Home() {
  const [posX, setPosX] = useState(50)
  const [posY, setPosY] = useState(50)
  const [zoom, setZoom] = useState(100)
  const [imageSrc, setImageSrc] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")

  const handleFileSelect = (file: File) => {
    const reader = new FileReader()
    reader.onload = (evt) => setImageSrc(String(evt.target?.result || ""))
    reader.readAsDataURL(file)
    setFileName(file.name)
    setPosX(50)
    setPosY(50)
  }

  return (
    <>
      <Navbar />
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
            <div>
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
                />
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
