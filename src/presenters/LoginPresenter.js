// presenters/LoginPresenter.js
import { LoginModel } from "@/models/LoginModel";

export class LoginPresenter {
  // Handle login dengan email dan password
  static async handleLogin(userData) {
    try {
      // Validasi input
      const validation = LoginModel.validateLoginData(userData);
      if (!validation.isValid) {
        return {
          success: false,
          message: "Data yang dimasukkan tidak valid",
          errors: validation.errors,
        };
      }

      // Autentikasi user
      const user = await LoginModel.authenticateUser(
        userData.email,
        userData.password
      );

      return {
        success: true,
        message: "Login berhasil! Selamat datang kembali.",
        user: user,
      };
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific error messages
      if (error.message.includes("Email tidak ditemukan")) {
        return {
          success: false,
          message: "Email tidak terdaftar. Silakan daftar terlebih dahulu.",
          errors: { email: "Email tidak ditemukan" },
        };
      }

      if (error.message.includes("Password salah")) {
        return {
          success: false,
          message: "Password yang Anda masukkan salah.",
          errors: { password: "Password salah" },
        };
      }

      if (error.message.includes("login social")) {
        return {
          success: false,
          message: error.message,
          errors: { email: "Gunakan login social" },
        };
      }

      return {
        success: false,
        message: "Terjadi kesalahan saat login. Silakan coba lagi.",
        errors: {},
      };
    }
  }

  // Handle login OAuth (Google/Facebook)
  static async handleOAuthLogin(oauthData) {
    try {
      // Validasi data OAuth
      const validation = LoginModel.validateOAuthData(oauthData);
      if (!validation.isValid) {
        return {
          success: false,
          message: "Data OAuth tidak valid",
          errors: validation.errors,
        };
      }

      // Cari user yang sudah ada berdasarkan email
      const existingUser = await LoginModel.findUserByEmail(oauthData.email);
      const isNewUser = !existingUser;

      // Cari atau buat user OAuth
      const user = await LoginModel.findOrCreateOAuthUser(oauthData);

      return {
        success: true,
        message: isNewUser
          ? `Selamat datang! Akun Anda telah dibuat dengan ${oauthData.provider}.`
          : `Login berhasil dengan ${oauthData.provider}! Selamat datang kembali.`,
        user: user,
        isNewUser: isNewUser,
      };
    } catch (error) {
      console.error("OAuth login error:", error);

      return {
        success: false,
        message: `Terjadi kesalahan saat login dengan ${oauthData.provider}. Silakan coba lagi.`,
        errors: { oauth: error.message },
      };
    }
  }

  // Cek status user berdasarkan email
  static async checkUserStatus(email) {
    try {
      const user = await LoginModel.findUserByEmail(email);

      if (!user) {
        return {
          exists: false,
          message: "User tidak ditemukan",
        };
      }

      return {
        exists: true,
        user: user,
        hasPassword: !!user.password, // Jika ada password, berarti bukan OAuth
        provider: user.provider,
        loginMethod: user.provider ? "oauth" : "credentials",
      };
    } catch (error) {
      console.error("Check user status error:", error);
      return {
        exists: false,
        message: "Terjadi kesalahan saat mengecek status user",
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
      isNewUser: result.isNewUser || false,
    };
  }

  // Validasi real-time untuk form login
  static validateField(fieldName, value) {
    switch (fieldName) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          return "Format email tidak valid";
        }
        return null;

      case "password":
        if (!value || value.length < 6) {
          return "Password harus minimal 6 karakter";
        }
        return null;

      default:
        return null;
    }
  }

  // Helper untuk format data OAuth dari provider
  static formatOAuthData(profile, provider) {
    try {
      switch (provider) {
        case "google":
          return {
            nama: profile.name || profile.given_name || "User",
            email: profile.email,
            provider: "google",
            provider_id: profile.sub || profile.id,
          };

        case "facebook":
          return {
            nama: profile.name || "User",
            email: profile.email,
            provider: "facebook",
            provider_id: profile.id,
          };

        default:
          throw new Error("Provider tidak didukung");
      }
    } catch (error) {
      console.error("Format OAuth data error:", error);
      throw new Error("Gagal memformat data OAuth");
    }
  }
}
