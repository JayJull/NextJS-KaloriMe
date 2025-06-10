// models/LoginModel.js
import { supabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export class LoginModel {
  // Login dengan email dan password
  static async authenticateUser(email, password) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          "id_users, nama, email, password, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id"
        )
        .eq("email", email.toLowerCase())
        .single();

      if (error && error.code === "PGRST116") {
        throw new Error("Email tidak ditemukan");
      }

      if (error) {
        throw new Error(error.message);
      }

      // Cek apakah user menggunakan OAuth (tidak memiliki password)
      if (!data.password && data.provider) {
        throw new Error(
          "Akun ini menggunakan login social. Silakan login dengan " +
            data.provider
        );
      }

      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(password, data.password);
      if (!isPasswordValid) {
        throw new Error("Password salah");
      }

      // Hapus password dari response
      const { password: _, ...userWithoutPassword } = data;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error authenticating user: ${error.message}`);
    }
  }

  // Cek atau buat user dari OAuth (Google/Facebook)
  static async findOrCreateOAuthUser(userData) {
    try {
      const { nama, email, provider, provider_id } = userData;

      // Cek apakah user sudah ada berdasarkan email
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id"
        )
        .eq("email", email.toLowerCase())
        .single();

      if (findError && findError.code !== "PGRST116") {
        throw new Error(findError.message);
      }

      // Jika user sudah ada
      if (existingUser) {
        // Update provider info jika belum ada atau berbeda
        if (!existingUser.provider && provider) {
          const { error: updateError } = await supabase
            .from("users")
            .update({
              provider: provider,
              provider_id: provider_id,
            })
            .eq("id_users", existingUser.id_users);

          if (updateError) {
            console.error("Error updating provider info:", updateError);
          }

          // Return updated user data
          return {
            ...existingUser,
            provider: provider,
            provider_id: provider_id,
          };
        }

        return existingUser;
      }

      const hashedPassword = await bcrypt.hash('password', 12);
      // Jika user belum ada, buat baru
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([
          {
            nama: nama.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            provider: provider,
            provider_id: provider_id,
            umur: null,
            berat_badan: null,
            tinggi_badan: null,
            tingkat_aktivitas: "tidak pernah",
          },
        ])
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id"
        )
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      return newUser;
    } catch (error) {
      throw new Error(`Error with OAuth user: ${error.message}`);
    }
  }

  // Cari user berdasarkan email saja
  static async findUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id"
        )
        .eq("email", email.toLowerCase())
        .single();

      if (error && error.code === "PGRST116") {
        return null; // User tidak ditemukan
      }

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Validasi data login
  static validateLoginData(data) {
    const errors = {};

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = "Format email tidak valid";
    }

    // Validasi password
    if (!data.password || data.password.length < 6) {
      errors.password = "Password harus minimal 6 karakter";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Validasi data OAuth
  static validateOAuthData(data) {
    const errors = {};

    // Validasi nama
    if (!data.nama || data.nama.trim().length < 1) {
      errors.nama = "Nama harus diisi";
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = "Format email tidak valid";
    }

    // Validasi provider
    if (!data.provider || !["google", "facebook"].includes(data.provider)) {
      errors.provider = "Provider tidak valid";
    }

    // Validasi provider_id
    if (!data.provider_id) {
      errors.provider_id = "Provider ID tidak valid";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
