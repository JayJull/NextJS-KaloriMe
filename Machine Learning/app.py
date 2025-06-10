# app.py (versi perbaikan)

import os
import io
import gradio as gr
from PIL import Image
import numpy as np
import tensorflow as tf

# --- Konfigurasi dan Konstanta ---
MODEL_PATH = 'basemodel.h5'
IMG_WIDTH = 224
IMG_HEIGHT = 224
CLASS_NAMES = [
    'Ayam Goreng', 'Burger', 'French Fries', 'Gado-Gado', 'Ikan Goreng',
    'Mie Goreng', 'Nasi Goreng', 'Nasi Padang', 'Pizza', 'Rawon',
    'Rendang', 'Sate', 'Soto'
]

# --- Fungsi Bantuan untuk Memuat Model ---
def load_model(model_path):
    print(f"Versi TensorFlow yang digunakan: {tf.__version__}")
    if not os.path.exists(model_path):
        print(f"FATAL ERROR: File model tidak ditemukan di path '{model_path}'")
        return None
    try:
        model = tf.keras.models.load_model(model_path, compile=False)
        print(f"Model '{model_path}' berhasil dimuat.")
        model.summary()
        return model
    except Exception as e:
        print(f"FATAL ERROR: Terjadi kesalahan saat memuat model '{model_path}': {e}")
        return None

# --- Muat Model ---
model = load_model(MODEL_PATH)

# --- Fungsi Inti untuk Prediksi ---
def predict_image(pil_image):
    if model is None:
        return {'error': 'Model tidak berhasil dimuat, periksa log server.'}
    if pil_image is None:
        return {'error': 'Tidak ada gambar yang diterima.'}

    try:
        img = pil_image.convert('RGB')
        img = img.resize((IMG_WIDTH, IMG_HEIGHT))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions[0])
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(predictions[0][predicted_index])

        result = {
            'predicted_class': predicted_class,
            'confidence': f"{confidence:.2%}"
        }
        print(f"Prediksi berhasil: {result}")
        return result

    except Exception as e:
        print(f"Error saat prediksi: {e}")
        return {'error': f'Terjadi kesalahan internal: {str(e)}'}

# --- Bangun Antarmuka Gradio ---
# Membuat direktori contoh jika belum ada dan ada file contoh yang ingin ditampilkan
if not os.path.exists('examples'):
    os.makedirs('examples')
# (Pastikan Anda sudah mengunggah gambar-gambar ini ke folder 'examples' di Hugging Face)

iface = gr.Interface(
    fn=predict_image,
    inputs=gr.Image(type="pil", label="Unggah Gambar Makanan"),
    outputs=gr.JSON(label="Hasil Prediksi"),
    title="🤖 Klasifikasi Makanan Indonesia",
    description="Unggah gambar makanan untuk mendapatkan prediksi. API ini dapat diakses dengan menekan tombol 'Use via API' di bawah.",
    examples=[
        ['examples/sate.jpg'],
        ['examples/rendang.jpg'],
        ['examples/soto.jpg']
    ],
    allow_flagging='never',
    cache_examples=False, # <-- PERBAIKAN DI SINI
    css=".gradio-container {background-color: #f0f2f6;}"
)

# --- Jalankan Aplikasi ---
if __name__ == '__main__':
    print("Gradio app akan dijalankan...")
    iface.launch()