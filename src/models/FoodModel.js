// models/FoodModel.js - Fixed version with proper WIB date handling
import { supabase } from "@/lib/db";

export class FoodService {
  // Helper function untuk mendapatkan tanggal WIB
  static getWIBDate() {
    const now = new Date();
    const wibOffset = 7 * 60; // 7 jam dalam menit
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wibTime = new Date(utc + wibOffset * 60000);

    const year = wibTime.getFullYear();
    const month = String(wibTime.getMonth() + 1).padStart(2, "0");
    const day = String(wibTime.getDate()).padStart(2, "0");
    const wibDate = `${year}-${month}-${day}`;

    console.log("WIB Date for query:", wibDate);
    return wibDate;
  }

  // Upload gambar ke Supabase Storage
  static async uploadImage(file, fileName) {
    try {
      const { data, error } = await supabase.storage
        .from("food-images")
        .upload(`images/${Date.now()}_${fileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("food-images").getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  // Insert ke table has_been_eaten
  static async createHasBeenEaten(eatenData) {
    try {
      const { data, error } = await supabase
        .from("has_been_eaten")
        .insert([eatenData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating has_been_eaten:", error);
      throw error;
    }
  }

  // Get has_been_eaten by user for today - FIXED to use WIB date
  static async getTodayHasBeenEaten(userId) {
    try {
      // FIXED: Gunakan tanggal WIB yang benar
      const todayWIB = this.getWIBDate();

      console.log(
        `Querying has_been_eaten for user ${userId} on date ${todayWIB}`
      );

      const { data, error } = await supabase
        .from("has_been_eaten")
        .select("*")
        .eq("id_users", userId)
        .eq("tanggal", todayWIB)
        .order("waktu", { ascending: false });

      if (error) throw error;

      console.log(`Found ${data.length} records for today (${todayWIB})`);
      return data;
    } catch (error) {
      console.error("Error fetching today has_been_eaten:", error);
      throw error;
    }
  }

  // Get has_been_eaten by user for specific date
  static async getHasBeenEatenByDate(userId, date) {
    try {
      console.log(`Querying has_been_eaten for user ${userId} on date ${date}`);

      const { data, error } = await supabase
        .from("has_been_eaten")
        .select("*")
        .eq("id_users", userId)
        .eq("tanggal", date)
        .order("waktu", { ascending: false });

      if (error) throw error;

      console.log(`Found ${data.length} records for date ${date}`);
      return data;
    } catch (error) {
      console.error("Error fetching has_been_eaten by date:", error);
      throw error;
    }
  }

  // Get has_been_eaten by user
  static async getHasBeenEatenByUser(userId) {
    try {
      const { data, error } = await supabase
        .from("has_been_eaten")
        .select("*")
        .eq("id_users", userId)
        .order("tanggal", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching has_been_eaten:", error);
      throw error;
    }
  }

  // Delete has_been_eaten record
  static async deleteHasBeenEaten(recordId, userId) {
    try {
      const { data, error } = await supabase
        .from("has_been_eaten")
        .delete()
        .eq("id", recordId)
        .eq("id_users", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deleting has_been_eaten record:", error);
      throw error;
    }
  }
}
