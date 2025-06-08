"use client";

import { X, Upload, Image, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Gagal mengakses kamera:", error);
      }
    }

    if (isOpen) startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Ukuran gambar maksimal 5MB!");
    }
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");

      // Konversi dataURL ke File untuk disamakan dengan upload manual
      fetch(dataUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const file = new File([buffer], "kamera.png", { type: "image/png" });
          setSelectedImage(file);
          setImagePreview(dataUrl);
        });
    }
  };

  const handleUploadClick = () => {
    if (!selectedImage) {
      alert("Pilih atau ambil gambar terlebih dahulu!");
      return;
    }

    onUpload(selectedImage);
    setSelectedImage(null);
    setImagePreview("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-4">
        {/* Header & Tombol Close */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Upload Gambar</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Kamera */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-md border border-gray-300 h-50 object-cover mb-2"
        />
        <button
          onClick={handleCapture}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm py-1.5 rounded-md mb-3 flex items-center justify-center gap-1"
        >
          <Camera size={16} />
          Ambil Foto
        </button>

        {/* Upload Manual */}
        <div className="border border-dashed border-teal-300 rounded-md p-4 text-center text-sm mb-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Image size={20} className="text-teal-600 mb-1" />
            <span>Klik untuk memilih gambar</span>
            <span className="text-xs text-gray-500">Max 5MB</span>
          </label>
        </div>

        {/* Preview */}
        {imagePreview && (
          <div className="mb-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-md"
            />
            <p className="text-xs text-gray-600 mt-1 truncate text-center">
              {selectedImage?.name || "kamera.png"}
            </p>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-1.5 text-sm rounded-md"
          >
            Batal
          </button>
          <button
            onClick={handleUploadClick}
            disabled={!selectedImage}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-1.5 text-sm rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </div>

        {/* Canvas tersembunyi */}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
}
