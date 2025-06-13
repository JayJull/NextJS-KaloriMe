// models/RegisterModel.js
import { supabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export class RegisterModel {
  // Cek apakah email sudah terdaftar
  static async checkEmailExists(email) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id_users")
        .eq("email", email.toLowerCase())
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(error.message);
      }

      return !!data;
    } catch (error) {
      throw new Error(`Error checking email: ${error.message}`);
    }
  }

  // Buat user baru
  static async createUser(userData) {
    try {
      const {
        nama,
        email,
        password,
      } = userData;

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            nama: nama.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            umur: null,
            berat_badan: null,
            tinggi_badan: null,
            tingkat_aktivitas: "tidak pernah",
          },
        ])
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas"
        )
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Email sudah terdaftar");
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Validasi data registrasi
  static validateRegisterData(data) {
    const errors = {};

    // Validasi nama
    if (!data.nama || data.nama.trim().length < 2) {
      errors.nama = "Nama harus diisi minimal 2 karakter";
    } else if (data.nama.trim().length > 50) {
      errors.nama = "Nama maksimal 50 karakter";
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = "Format email tidak valid";
    } else if (data.email.length > 100) {
      errors.email = "Email terlalu panjang";
    }

    // Validasi password
    if (!data.password || data.password.length < 6) {
      errors.password = "Password harus minimal 6 karakter";
    } else if (data.password.length > 100) {
      errors.password = "Password terlalu panjang";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
