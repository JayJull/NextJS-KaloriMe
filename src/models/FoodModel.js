// models/FoodModel.js
import { supabase } from "@/lib/db";

export class FoodService {
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

  // Insert ke table report
  static async createReport(reportData) {
    try {
      const { data, error } = await supabase
        .from("report")
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating report:", error);
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

  // Get all reports
  static async getAllReports() {
    try {
      const { data, error } = await supabase
        .from("report")
        .select("*")
        .order("tanggal", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  }

  // Get has_been_eaten by user for today
  static async getTodayHasBeenEaten(userId) {
    try {
      const today = new Date().toISOString().split("T")[0];
      
      const { data, error } = await supabase
        .from("has_been_eaten")
        .select("*")
        .eq("id_users", userId)
        .eq("tanggal", today)
        .order("waktu", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching today has_been_eaten:", error);
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

  // Delete old has_been_eaten records (called by cron job)
  // Hapus data yang sudah lebih dari 1 hari dari jam 23:00 WIB
  static async deleteOldRecords() {
    try {
      // Buat timestamp untuk 23:00 WIB kemarin
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 0, 0, 0);

      // Convert ke UTC (WIB = UTC + 7)
      const cutoffTime = new Date(yesterday.getTime() - (7 * 60 * 60 * 1000));

      const { data, error } = await supabase
        .from("has_been_eaten")
        .delete()
        .lt("created_at", cutoffTime.toISOString());

      if (error) throw error;
      
      console.log(`Deleted old records before: ${cutoffTime.toISOString()}`);
      return { success: true, deletedCount: data?.length || 0 };
    } catch (error) {
      console.error("Error deleting old records:", error);
      throw error;
    }
  }

  // Get food data from reports table for makanan view
  static async getAllFoodReports(userId = null) {
    try {
      let query = supabase
        .from("report")
        .select("*")
        .order("tanggal", { ascending: false });

      if (userId) {
        query = query.eq("id_users", userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching food reports:", error);
      throw error;
    }
  }

  // Delete food report
  static async deleteFoodReport(reportId, userId) {
    try {
      const { data, error } = await supabase
        .from("report")
        .delete()
        .eq("id", reportId)
        .eq("id_users", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deleting food report:", error);
      throw error;
    }
  }
}