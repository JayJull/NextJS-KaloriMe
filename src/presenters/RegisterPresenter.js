// presenters/RegisterPresenter.js
import { RegisterModel } from "@/models/RegisterModel";

export class RegisterPresenter {
  // Handle proses registrasi
  static async handleRegister(userData) {
    try {
      // Validasi input
      const validation = RegisterModel.validateRegisterData(userData);
      if (!validation.isValid) {
        return {
          success: false,
          message: "Data yang dimasukkan tidak valid",
          errors: validation.errors,
        };
      }

      // Cek apakah email sudah terdaftar
      const emailExists = await RegisterModel.checkEmailExists(userData.email);
      if (emailExists) {
        return {
          success: false,
          message:
            "Email sudah terdaftar. Silakan gunakan email lain atau login.",
          errors: { email: "Email sudah terdaftar" },
        };
      }

      // Buat user baru
      const newUser = await RegisterModel.createUser(userData);

      return {
        success: true,
        message: "Registrasi berhasil! Selamat datang di KaloriME.",
        user: newUser,
      };
    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific error messages
      if (error.message.includes("Email sudah terdaftar")) {
        return {
          success: false,
          message:
            "Email sudah terdaftar. Silakan gunakan email lain atau login.",
          errors: { email: "Email sudah terdaftar" },
        };
      }

      return {
        success: false,
        message: "Terjadi kesalahan saat registrasi. Silakan coba lagi.",
        errors: {},
      };
    }
  }

  // Format response untuk API
  static formatApiResponse(result) {
    return {
      success: result.success,
      message: result.message,
      data: result.user || null,
      errors: result.errors || {},
    };
  }

  // Validasi real-time untuk form
  static validateField(fieldName, value, allData = {}) {
    switch (fieldName) {
      case "nama":
        if (!value || value.trim().length < 2) {
          return "Nama harus diisi minimal 2 karakter";
        }
        if (value.trim().length > 50) {
          return "Nama maksimal 50 karakter";
        }
        return null;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          return "Format email tidak valid";
        }
        if (value.length > 100) {
          return "Email terlalu panjang";
        }
        return null;

      case "password":
        if (!value || value.length < 6) {
          return "Password harus minimal 6 karakter";
        }
        if (value.length > 100) {
          return "Password terlalu panjang";
        }
        return null;
        
      default:
        return null;
    }
  }
}
