// models/LoginModel.js
import { supabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export class LoginModel {
  // Update sign in stats
  static async updateSignInStats(userId, ipAddress = null, userAgent = null) {
    try {
      // Get current user data
      const { data: currentUser, error: fetchError } = await supabase
        .from("users")
        .select("current_sign_in, sign_in_count")
        .eq("id_users", userId)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      // Update sign in stats
      const { error: updateError } = await supabase
        .from("users")
        .update({
          last_sign_in: currentUser.current_sign_in || new Date().toISOString(),
          current_sign_in: new Date().toISOString(),
          sign_in_count: (currentUser.sign_in_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id_users", userId);

      if (updateError) throw new Error(updateError.message);

      // Optional: Create session record
      if (ipAddress || userAgent) {
        await this.createSessionRecord(userId, ipAddress, userAgent);
      }

      return true;
    } catch (error) {
      console.error("Error updating sign in stats:", error);
      return false;
    }
  }

  // Create session record (optional)
  static async createSessionRecord(userId, ipAddress, userAgent) {
    try {
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      const validIp = ipAddress && ipAddress !== "unknown" ? ipAddress : null;

      const { error } = await supabase.from("user_sessions").insert([
        {
          user_id: userId,
          session_token: sessionToken,
          ip_address: validIp,
          user_agent: userAgent,
          expires_at: expiresAt.toISOString(),
        },
      ]);

      if (error) throw new Error(error.message);
      return sessionToken;
    } catch (error) {
      console.error("Error creating session record:", error);
      return null;
    }
  }

  // Generate session token
  static generateSessionToken() {
    return require("crypto").randomBytes(32).toString("hex");
  }

  // Clean expired sessions
  static async cleanExpiredSessions() {
    try {
      const { error } = await supabase
        .from("user_sessions")
        .delete()
        .lt("expires_at", new Date().toISOString());

      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error("Error cleaning expired sessions:", error);
      return false;
    }
  }

  // Login dengan email dan password
  static async authenticateUser(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          "id_users, nama, email, password, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id, last_sign_in, current_sign_in, sign_in_count, created_at"
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

      // Update sign in stats
      await this.updateSignInStats(
        data.id_users,
        metadata.ipAddress,
        metadata.userAgent
      );

      // Get updated user data
      const { data: updatedUser } = await supabase
        .from("users")
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id, last_sign_in, current_sign_in, sign_in_count, created_at"
        )
        .eq("id_users", data.id_users)
        .single();

      return updatedUser;
    } catch (error) {
      throw new Error(`Error authenticating user: ${error.message}`);
    }
  }

  // Cek atau buat user dari OAuth (Google/Facebook)
  static async findOrCreateOAuthUser(userData, metadata = {}) {
    try {
      const { nama, email, provider, provider_id } = userData;

      // Cek apakah user sudah ada berdasarkan email
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id, last_sign_in, current_sign_in, sign_in_count, created_at"
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
        }

        // Update sign in stats
        await this.updateSignInStats(
          existingUser.id_users,
          metadata.ipAddress,
          metadata.userAgent
        );

        // Get updated user data
        const { data: updatedUser } = await supabase
          .from("users")
          .select(
            "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id, last_sign_in, current_sign_in, sign_in_count, created_at"
          )
          .eq("id_users", existingUser.id_users)
          .single();

        return updatedUser;
      }

      const hashedPassword = await bcrypt.hash("password", 12);
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
            current_sign_in: new Date().toISOString(),
            sign_in_count: 1,
            created_at: new Date().toISOString(),
          },
        ])
        .select(
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id, last_sign_in, current_sign_in, sign_in_count, created_at"
        )
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      // Create session record for new user
      if (metadata.ipAddress || metadata.userAgent) {
        await this.createSessionRecord(
          newUser.id_users,
          metadata.ipAddress,
          metadata.userAgent
        );
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
          "id_users, nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas, provider, provider_id, last_sign_in, current_sign_in, sign_in_count, created_at"
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

  // Get user sessions
  static async getUserSessions(userId) {
    try {
      const { data, error } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error("Error getting user sessions:", error);
      return [];
    }
  }

  // Deactivate session
  static async deactivateSession(sessionToken) {
    try {
      const { error } = await supabase
        .from("user_sessions")
        .update({ is_active: false })
        .eq("session_token", sessionToken);

      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error("Error deactivating session:", error);
      return false;
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
