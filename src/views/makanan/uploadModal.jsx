// uploadModal.jsx - Updated version
import { X, Upload, Image, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Use back camera if available
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Gagal mengakses kamera:", error);
        setCameraError(
          "Gagal mengakses kamera. Silakan gunakan upload manual."
        );
      }
    }

    if (isOpen) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  // Coming Soon Popup
  useEffect(() => {
    if (showComingSoon) {
      const timer = setTimeout(() => {
        setShowComingSoon(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showComingSoon]);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null);
      setImagePreview("");
      setIsUploading(false);
      setShowComingSoon(false);
      setCameraError(null);
    }
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

      fetch(dataUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const file = new File([buffer], "gado-gado.png", {
            type: "image/png",
          });
          setSelectedImage(file);
          setImagePreview(dataUrl);
        });
    }
  };

  const handleUploadClick = async () => {
    if (!selectedImage) {
      alert("Pilih atau ambil gambar terlebih dahulu!");
      return;
    }

    setIsUploading(true);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("User ID tidak ditemukan. Silakan login kembali.");
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("userId", userId);

      const response = await fetch("/api/food/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Sukses - panggil callback parent
        if (onUpload) {
          onUpload(selectedImage);
        }
        setSelectedImage(null);
        setImagePreview("");
        onClose();
        alert(result.message);
      } else {
        if (result.showPopup) {
          // Tampilkan Coming Soon popup
          setShowComingSoon(true);
        } else {
          alert(result.message);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) return; // Prevent closing while uploading
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-4">
          {/* Header & Tombol Close */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Upload Gambar Makanan
            </h2>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>

          {/* Kamera */}
          {!cameraError ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-md border border-gray-300 h-50 object-cover mb-2"
              />
              <button
                onClick={handleCapture}
                disabled={isUploading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm py-1.5 rounded-md mb-3 flex items-center justify-center gap-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Camera size={16} />
                Ambil Foto
              </button>
            </>
          ) : (
            <div className="bg-gray-100 rounded-md p-4 text-center text-sm text-gray-600 mb-3">
              <Camera size={24} className="mx-auto mb-2 text-gray-400" />
              <p>{cameraError}</p>
            </div>
          )}

          {/* Upload Manual */}
          <div className="border border-dashed border-teal-300 rounded-md p-4 text-center text-sm mb-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer flex flex-col items-center ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Image size={20} className="text-teal-600 mb-1" />
              <span>Klik untuk memilih gambar</span>
              <span className="text-xs text-gray-500">Max 5MB (JPG, PNG)</span>
            </label>
          </div>

          {/* Preview */}
          {imagePreview && (
            <div className="mb-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md border"
              />
              <p className="text-xs text-gray-600 mt-1 truncate text-center">
                {selectedImage?.name || "camera-capture.png"}
              </p>
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 border border-gray-300 text-gray-700 py-1.5 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              onClick={handleUploadClick}
              disabled={!selectedImage || isUploading}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-1.5 text-sm rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload
                </>
              )}
            </button>
          </div>

          {/* Canvas tersembunyi */}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      </div>

      {/* Coming Soon Popup */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm mx-4">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600 mb-2">
              Makanan ini akan segera tersedia!
            </p>
            <p className="text-sm text-gray-500">
              Coba dengan nama makanan yang lain atau pastikan nama file sesuai
              dengan makanan yang ada.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
