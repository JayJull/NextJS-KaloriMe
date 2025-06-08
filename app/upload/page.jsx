'use client'
import UploadLayout from '@/components/dashboard/Upload'
import { Camera, Upload as UploadIcon } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export default function UploadPage() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [photoDataUrl, setPhotoDataUrl] = useState(null)

useEffect(() => {
  let stream;

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Gagal mengakses kamera:', error);
    }
  }

  startCamera();

  return () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };
}, []);


  const handleCapture = () => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (canvas && video) {
      const ctx = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const dataUrl = canvas.toDataURL('image/png')
      setPhotoDataUrl(dataUrl)
    }
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoDataUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <UploadLayout title="Upload Makanan">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        {/* Opsi 1: Kamera */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">Ambil Foto dari Kamera</h3>
          <div className="flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-lg border border-gray-300"
              width={320}
              height={240}
            />
            <button
              onClick={handleCapture}
              className="mt-3 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
            >
              <Camera className="inline mr-2" /> Ambil Foto
            </button>
          </div>
        </div>

        {/* Opsi 2: Upload */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">Atau Unggah dari Galeri</h3>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-teal-400 transition"
          >
            <UploadIcon size={48} className="text-gray-500 mb-2" />
            <p className="text-gray-600">Klik untuk pilih file gambar</p>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {/* Preview Foto */}
        {photoDataUrl && (
          <div className="text-center">
            <p className="font-semibold text-gray-700 mb-2">Preview Foto:</p>
            <img
              src={photoDataUrl}
              alt="Preview"
              className="w-full max-w-xs mx-auto rounded-lg border border-gray-300"
            />
          </div>
        )}

        {/* Canvas tersembunyi */}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </UploadLayout>
  )
}
