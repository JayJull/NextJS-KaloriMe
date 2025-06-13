// presenters/LoginPresenter.js
import { LoginModel } from "@/models/LoginModel";

export class LoginPresenter {
  // Extract request metadata
  static extractRequestMetadata(request) {
    try {
      const forwarded = request.headers.get("x-forwarded-for");
      const realIp = request.headers.get("x-real-ip");
      const remoteAddr = request.headers.get("remote-addr");

      const ipAddress =
        forwarded?.split(",")[0] || realIp || remoteAddr || "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";

      return { ipAddress, userAgent };
    } catch (error) {
      return { ipAddress: "unknown", userAgent: "unknown" };
    }
  }

  // Handle login dengan email dan password
  static async handleLogin(userData, request = null) {
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

      // Extract metadata dari request
      const metadata = request ? this.extractRequestMetadata(request) : {};

      // Autentikasi user dengan metadata
      const user = await LoginModel.authenticateUser(
        userData.email,
        userData.password,
        metadata
      );

      return {
        success: true,
        message: "Login berhasil! Selamat datang kembali.",
        user: user,
        loginInfo: {
          lastSignIn: user.last_sign_in,
          currentSignIn: user.current_sign_in,
          signInCount: user.sign_in_count,
          isReturningUser: user.sign_in_count > 1,
        },
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
  static async handleOAuthLogin(oauthData, request = null) {
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

      // Extract metadata dari request
      const metadata = request ? this.extractRequestMetadata(request) : {};

      // Cari user yang sudah ada berdasarkan email
      const existingUser = await LoginModel.findUserByEmail(oauthData.email);
      const isNewUser = !existingUser;

      // Cari atau buat user OAuth dengan metadata
      const user = await LoginModel.findOrCreateOAuthUser(oauthData, metadata);

      return {
        success: true,
        message: isNewUser
          ? `Selamat datang! Akun Anda telah dibuat dengan ${oauthData.provider}.`
          : `Login berhasil dengan ${oauthData.provider}! Selamat datang kembali.`,
        user: user,
        isNewUser: isNewUser,
        loginInfo: {
          lastSignIn: user.last_sign_in,
          currentSignIn: user.current_sign_in,
          signInCount: user.sign_in_count,
          isReturningUser: user.sign_in_count > 1,
        },
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
        lastSignIn: user.last_sign_in,
        signInCount: user.sign_in_count,
        memberSince: user.created_at,
      };
    } catch (error) {
      console.error("Check user status error:", error);
      return {
        exists: false,
        message: "Terjadi kesalahan saat mengecek status user",
      };
    }
  }

  // Get user sessions
  static async getUserSessions(userId) {
    try {
      const sessions = await LoginModel.getUserSessions(userId);
      return {
        success: true,
        sessions: sessions,
        activeSessionCount: sessions.length,
      };
    } catch (error) {
      console.error("Get user sessions error:", error);
      return {
        success: false,
        message: "Gagal mengambil data session",
        sessions: [],
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
      loginInfo: result.loginInfo || null,
    };
  }

  // Format session info untuk display
  static formatSessionInfo(loginInfo) {
    if (!loginInfo) return null;

    const { lastSignIn, currentSignIn, signInCount, isReturningUser } =
      loginInfo;

    return {
      welcome: isReturningUser
        ? `Selamat datang kembali! Login ke-${signInCount}`
        : "Selamat datang untuk pertama kali!",
      lastLogin: lastSignIn ? this.formatRelativeTime(lastSignIn) : null,
      currentLogin: this.formatRelativeTime(currentSignIn),
      loginCount: signInCount,
    };
  }

  // Format relative time
  static formatRelativeTime(timestamp) {
    if (!timestamp) return null;

    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Baru saja";
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} hari yang lalu`;

    return time.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  // Clean expired sessions (untuk maintenance)
  static async cleanExpiredSessions() {
    try {
      const result = await LoginModel.cleanExpiredSessions();
      return {
        success: result,
        message: result
          ? "Session expired berhasil dibersihkan"
          : "Gagal membersihkan session expired",
      };
    } catch (error) {
      console.error("Clean expired sessions error:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat membersihkan session",
      };
    }
  }
}
