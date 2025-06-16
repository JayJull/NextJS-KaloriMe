import { supabase } from "@/lib/db";

export class ProfileModel {
  // Ambil data user berdasarkan email
  static async getUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, kalori, provider, provider_id"
        )
        .eq("email", email.toLowerCase())
        .single();

      if (error && error.code === "PGRST116") {
        throw new Error("User tidak ditemukan");
      }

      if (error) {
        console.error("Supabase error in getUserByEmail:", error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      throw new Error(`Error getting user: ${error.message}`);
    }
  }

  // Ambil data user berdasarkan ID
  static async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, kalori, provider, provider_id"
        )
        .eq("id_users", userId)
        .single();

      if (error && error.code === "PGRST116") {
        throw new Error("User tidak ditemukan");
      }

      if (error) {
        console.error("Supabase error in getUserById:", error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Error in getUserById:", error);
      throw new Error(`Error getting user: ${error.message}`);
    }
  }

  // Update profile user
  static async updateProfile(userId, profileData) {
    try {
      const {
        nama,
        email,
        umur,
        berat_badan,
        tinggi_badan,
        tingkat_aktivitas,
        kalori,
      } = profileData;

      console.log("Updating profile for user:", userId);
      console.log("Profile data:", profileData);

      // Cek apakah email sudah digunakan user lain (jika email diubah)
      if (email) {
        const { data: existingUser, error: emailCheckError } = await supabase
          .from("users")
          .select("id_users, email")
          .eq("email", email.toLowerCase())
          .neq("id_users", userId)
          .single();

        if (emailCheckError && emailCheckError.code !== "PGRST116") {
          console.error("Error checking email:", emailCheckError);
          throw new Error(`Error checking email: ${emailCheckError.message}`);
        }

        if (existingUser) {
          throw new Error("Email sudah digunakan oleh akun lain");
        }
      }

      // Prepare update data - only include defined values
      const updateData = {};

      if (nama !== undefined && nama !== null) {
        updateData.nama = nama.trim();
      }
      if (email !== undefined && email !== null) {
        updateData.email = email.toLowerCase().trim();
      }
      if (umur !== undefined && umur !== null && umur !== "") {
        updateData.umur = parseInt(umur);
      }
      if (
        berat_badan !== undefined &&
        berat_badan !== null &&
        berat_badan !== ""
      ) {
        updateData.berat_badan = parseFloat(berat_badan);
      }
      if (
        tinggi_badan !== undefined &&
        tinggi_badan !== null &&
        tinggi_badan !== ""
      ) {
        updateData.tinggi_badan = parseFloat(tinggi_badan);
      }
      if (tingkat_aktivitas !== undefined && tingkat_aktivitas !== null) {
        // Normalisasi nilai tingkat aktivitas
        const normalizedActivity =
          this.normalizeActivityLevel(tingkat_aktivitas);
        updateData.tingkat_aktivitas = normalizedActivity;
      }
      if (kalori !== undefined && kalori !== null && kalori !== "") {
        updateData.kalori = parseInt(kalori);
      }

      console.log("Final update data:", updateData);

      // Pastikan ada data yang akan diupdate
      if (Object.keys(updateData).length === 0) {
        throw new Error("Tidak ada data yang akan diupdate");
      }

      // Update data user
      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id_users", userId)
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, kalori, provider, provider_id"
        )
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));

        // Handle specific Supabase errors
        if (error.code === "23505") {
          throw new Error("Email sudah digunakan oleh akun lain");
        }
        if (error.code === "22P02") {
          throw new Error("Format data tidak valid");
        }
        if (error.message.includes("violates check constraint")) {
          throw new Error("Data tidak memenuhi kriteria yang diperlukan");
        }

        throw new Error(`Database error: ${error.message}`);
      }

      console.log("Update successful:", data);
      return data;
    } catch (error) {
      console.error("Error in updateProfile:", error);
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }

  // Normalisasi tingkat aktivitas ke format database
  static normalizeActivityLevel(activityLevel) {
    const activityMap = {
      // Frontend values ke database values
      sedentary: "tidak pernah",
      light: "ringan",
      moderate: "sedang",
      active: "aktif",
      very_active: "sangat aktif",
      // Nilai yang sudah sesuai database
      "tidak pernah": "tidak pernah",
      ringan: "ringan",
      sedang: "sedang",
      aktif: "aktif",
      "sangat aktif": "sangat aktif",
    };

    return activityMap[activityLevel] || activityLevel;
  }

  // Validasi data profile
  static validateProfileData(data) {
    const errors = {};

    // Validasi nama
    if (!data.nama || data.nama.trim().length < 1) {
      errors.nama = "Nama harus diisi";
    } else if (data.nama.trim().length > 100) {
      errors.nama = "Nama maksimal 100 karakter";
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = "Format email tidak valid";
    }

    // Validasi umur (opsional)
    if (data.umur !== null && data.umur !== undefined && data.umur !== "") {
      const age = parseInt(data.umur);
      if (isNaN(age) || age < 1 || age > 120) {
        errors.umur = "Umur harus antara 1-120 tahun";
      }
    }

    // Validasi berat badan (opsional)
    if (
      data.berat_badan !== null &&
      data.berat_badan !== undefined &&
      data.berat_badan !== ""
    ) {
      const weight = parseFloat(data.berat_badan);
      if (isNaN(weight) || weight < 10 || weight > 500) {
        errors.berat_badan = "Berat badan harus antara 10-500 kg";
      }
    }

    // Validasi tinggi badan (opsional)
    if (
      data.tinggi_badan !== null &&
      data.tinggi_badan !== undefined &&
      data.tinggi_badan !== ""
    ) {
      const height = parseFloat(data.tinggi_badan);
      if (isNaN(height) || height < 50 || height > 300) {
        errors.tinggi_badan = "Tinggi badan harus antara 50-300 cm";
      }
    }

    // Validasi tingkat aktivitas (opsional)
    if (
      data.tingkat_aktivitas !== null &&
      data.tingkat_aktivitas !== undefined
    ) {
      const validActivities = [
        "tidak pernah",
        "ringan",
        "sedang",
        "aktif",
        "sangat aktif",
        // Juga terima format frontend
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
      ];
      if (!validActivities.includes(data.tingkat_aktivitas)) {
        errors.tingkat_aktivitas = "Tingkat aktivitas tidak valid";
      }
    }

    // Validasi kalori (opsional)
    if (
      data.kalori !== null &&
      data.kalori !== undefined &&
      data.kalori !== ""
    ) {
      const calories = parseInt(data.kalori);
      if (isNaN(calories) || calories < 800 || calories > 10000) {
        errors.kalori = "Kalori harus antara 800-10000 kcal";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Hitung BMI
  static calculateBMI(weight, height) {
    if (!weight || !height) return null;

    const weightKg = parseFloat(weight);
    const heightM = parseFloat(height) / 100;

    if (weightKg <= 0 || heightM <= 0) return null;

    return (weightKg / (heightM * heightM)).toFixed(1);
  }

  // Hitung kalori harian (BMR + aktivitas)
  static calculateDailyCalories(
    weight,
    height,
    age,
    activityLevel,
    gender = "male"
  ) {
    if (!weight || !height || !age) return null;

    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const ageYears = parseInt(age);

    if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return null;

    // Harris-Benedict Formula
    let bmr;
    if (gender === "male") {
      bmr = 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
    } else {
      bmr = 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears;
    }

    // Activity multipliers - sesuaikan dengan database values
    const activityMultipliers = {
      "tidak pernah": 1.2,
      ringan: 1.375,
      sedang: 1.55,
      aktif: 1.725,
      "sangat aktif": 1.9,
      // Fallback untuk nilai frontend
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const multiplier = activityMultipliers[activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  }

  // Get BMI status
  static getBMIStatus(bmi) {
    if (!bmi) return null;

    const bmiValue = parseFloat(bmi);

    if (bmiValue < 18.5) return "Kurus";
    if (bmiValue < 25) return "Normal";
    if (bmiValue < 30) return "Gemuk";
    return "Obesitas";
  }

  // Format profile data untuk response
  static formatProfileData(userData) {
    const bmi = this.calculateBMI(userData.berat_badan, userData.tinggi_badan);
    const dailyCalories = this.calculateDailyCalories(
      userData.berat_badan,
      userData.tinggi_badan,
      userData.umur,
      userData.tingkat_aktivitas
    );

    return {
      ...userData,
      bmi: bmi,
      bmi_status: this.getBMIStatus(bmi),
      daily_calories: dailyCalories,
      // Jika kalori tidak ada di database, gunakan calculated daily calories
      kalori: userData.kalori || dailyCalories,
    };
  }
}
