import { ProfileModel } from "@/models/ProfileModel";

export class ProfilePresenter {
  // Handle get profile data
  static async getProfile(identifier, type = "email") {
    try {
      let user;

      if (type === "email") {
        user = await ProfileModel.getUserByEmail(identifier);
      } else if (type === "id") {
        user = await ProfileModel.getUserById(identifier);
      } else {
        return {
          success: false,
          message: "Tipe identifier tidak valid",
          errors: { type: "Gunakan 'email' atau 'id'" },
        };
      }

      // Format data dengan kalkulasi BMI dan kalori
      const formattedUser = ProfileModel.formatProfileData(user);

      return {
        success: true,
        message: "Data profile berhasil diambil",
        user: formattedUser,
      };
    } catch (error) {
      console.error("Get profile error:", error);

      if (error.message.includes("User tidak ditemukan")) {
        return {
          success: false,
          message: "User tidak ditemukan",
          errors: { user: "User tidak ditemukan" },
        };
      }

      return {
        success: false,
        message: "Terjadi kesalahan saat mengambil data profile",
        errors: { system: error.message },
      };
    }
  }

  // Handle update profile
  static async updateProfile(userId, profileData) {
    try {
      console.log("ProfilePresenter updateProfile called with:", {
        userId,
        profileData,
      });

      // Get current user data first
      const currentUser = await ProfileModel.getUserById(userId);
      console.log("Current user data:", currentUser);

      // Map dan merge data dengan benar
      const mergedData = {
        nama: profileData.name || profileData.nama || currentUser.nama,
        email: profileData.email || currentUser.email,
        umur:
          profileData.age !== undefined && profileData.age !== null
            ? parseInt(profileData.age)
            : profileData.umur !== undefined
            ? profileData.umur
            : currentUser.umur,
        berat_badan:
          profileData.weight !== undefined && profileData.weight !== null
            ? parseFloat(profileData.weight)
            : profileData.berat_badan !== undefined
            ? profileData.berat_badan
            : currentUser.berat_badan,
        tinggi_badan:
          profileData.height !== undefined && profileData.height !== null
            ? parseFloat(profileData.height)
            : profileData.tinggi_badan !== undefined
            ? profileData.tinggi_badan
            : currentUser.tinggi_badan,
        tingkat_aktivitas:
          profileData.activityLevel ||
          profileData.tingkat_aktivitas ||
          currentUser.tingkat_aktivitas,
      };

      console.log("Merged data:", mergedData);

      // Validasi input
      const validation = ProfileModel.validateProfileData(mergedData);
      if (!validation.isValid) {
        console.log("Validation failed:", validation.errors);
        return {
          success: false,
          message: "Data yang dimasukkan tidak valid",
          errors: validation.errors,
        };
      }

      // Update profile
      const updatedUser = await ProfileModel.updateProfile(userId, mergedData);
      console.log("Update successful:", updatedUser);

      // Format data dengan kalkulasi BMI dan kalori
      const formattedUser = ProfileModel.formatProfileData(updatedUser);

      return {
        success: true,
        message: "Profile berhasil diperbarui",
        user: formattedUser,
        oldData: ProfileModel.formatProfileData(currentUser),
      };
    } catch (error) {
      console.error("Update profile error:", error);

      // Handle specific error messages
      if (error.message.includes("User tidak ditemukan")) {
        return {
          success: false,
          message: "User tidak ditemukan",
          errors: { user: "User tidak ditemukan" },
        };
      }

      if (error.message.includes("Email sudah digunakan")) {
        return {
          success: false,
          message: "Email sudah digunakan oleh akun lain",
          errors: { email: "Email sudah digunakan" },
        };
      }

      return {
        success: false,
        message: "Terjadi kesalahan saat memperbarui profile",
        errors: { system: error.message },
      };
    }
  }

  // Validasi field secara real-time
  static validateField(fieldName, value, currentData = {}) {
    switch (fieldName) {
      case "nama":
      case "name":
        if (!value || value.trim().length < 1) {
          return "Nama harus diisi";
        }
        if (value.trim().length > 100) {
          return "Nama maksimal 100 karakter";
        }
        return null;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          return "Format email tidak valid";
        }
        return null;

      case "umur":
      case "age":
        if (value !== null && value !== undefined && value !== "") {
          const age = parseInt(value);
          if (isNaN(age) || age < 1 || age > 120) {
            return "Umur harus antara 1-120 tahun";
          }
        }
        return null;

      case "berat_badan":
      case "weight":
        if (value !== null && value !== undefined && value !== "") {
          const weight = parseFloat(value);
          if (isNaN(weight) || weight < 10 || weight > 500) {
            return "Berat badan harus antara 10-500 kg";
          }
        }
        return null;

      case "tinggi_badan":
      case "height":
        if (value !== null && value !== undefined && value !== "") {
          const height = parseFloat(value);
          if (isNaN(height) || height < 50 || height > 300) {
            return "Tinggi badan harus antara 50-300 cm";
          }
        }
        return null;

      case "tingkat_aktivitas":
      case "activityLevel":
        if (value) {
          const validActivities = [
            "tidak pernah",
            "sedentary",
            "light",
            "ringan",
            "moderate",
            "sedang",
            "active",
            "aktif",
            "very_active",
            "sangat aktif",
          ];
          if (!validActivities.includes(value)) {
            return "Tingkat aktivitas tidak valid";
          }
        }
        return null;

      default:
        return null;
    }
  }

  // Calculate health metrics
  static calculateHealthMetrics(profileData) {
    const { berat_badan, tinggi_badan, umur, tingkat_aktivitas } = profileData;

    const bmi = ProfileModel.calculateBMI(berat_badan, tinggi_badan);
    const dailyCalories = ProfileModel.calculateDailyCalories(
      berat_badan,
      tinggi_badan,
      umur,
      tingkat_aktivitas
    );
    const bmiStatus = ProfileModel.getBMIStatus(bmi);

    return {
      bmi: bmi,
      bmi_status: bmiStatus,
      daily_calories: dailyCalories,
    };
  }

  // Format response untuk API
  static formatApiResponse(result) {
    return {
      success: result.success,
      message: result.message,
      data: result.user || null,
      oldData: result.oldData || null,
      errors: result.errors || {},
    };
  }

  // Get activity level options untuk frontend
  static getActivityLevelOptions() {
    return [
      {
        value: "tidak pernah",
        label: "Sangat Sedikit",
        desc: "Tidak pernah olahraga",
        multiplier: 1.2,
      },
      {
        value: "ringan",
        label: "Ringan",
        desc: "Olahraga 1-3 hari/minggu",
        multiplier: 1.375,
      },
      {
        value: "sedang",
        label: "Sedang",
        desc: "Olahraga 3-5 hari/minggu",
        multiplier: 1.55,
      },
      {
        value: "aktif",
        label: "Aktif",
        desc: "Olahraga 6-7 hari/minggu",
        multiplier: 1.725,
      },
      {
        value: "sangat aktif",
        label: "Sangat Aktif",
        desc: "Olahraga 2x sehari atau pekerjaan fisik",
        multiplier: 1.9,
      },
    ];
  }

  // Compare profile changes (untuk audit log atau notifikasi)
  static compareProfileChanges(oldData, newData) {
    const changes = {};
    const fieldsToCompare = [
      "nama",
      "email",
      "umur",
      "berat_badan",
      "tinggi_badan",
      "tingkat_aktivitas",
    ];

    fieldsToCompare.forEach((field) => {
      if (oldData[field] !== newData[field]) {
        changes[field] = {
          old: oldData[field],
          new: newData[field],
        };
      }
    });

    // Calculate if health metrics changed
    const oldMetrics = ProfilePresenter.calculateHealthMetrics(oldData);
    const newMetrics = ProfilePresenter.calculateHealthMetrics(newData);

    if (oldMetrics.bmi !== newMetrics.bmi) {
      changes.bmi = {
        old: oldMetrics.bmi,
        new: newMetrics.bmi,
      };
    }

    if (oldMetrics.daily_calories !== newMetrics.daily_calories) {
      changes.daily_calories = {
        old: oldMetrics.daily_calories,
        new: newMetrics.daily_calories,
      };
    }

    return {
      hasChanges: Object.keys(changes).length > 0,
      changes: changes,
    };
  }
}
