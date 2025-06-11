import Database from "@/lib/database";

class HasBeenEatenModel {
  constructor() {
    this.db = Database.getInstance();
  }

  async create(eatenData) {
    const sql = `
      INSERT INTO has_been_eaten (id_makanan, id_user, kategori, foto, waktu, tanggal)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      eatenData.id_makanan,
      eatenData.id_user,
      eatenData.kategori,
      eatenData.foto || null,
      eatenData.waktu,
      eatenData.tanggal,
    ];

    await this.db.query(sql, params);
    return await this.findById(eatenData.id_makanan);
  }

  async findById(id_makanan) {
    const sql = "SELECT * FROM has_been_eaten WHERE id_makanan = ?";
    const result = await this.db.query(sql, [id_makanan]);

    return result.length > 0 ? result[0] : null;
  }

  async findByUserId(id_user, limit) {
    let sql =
      "SELECT * FROM has_been_eaten WHERE id_user = ? ORDER BY tanggal DESC, waktu DESC";
    const params = [id_user];

    if (limit) {
      sql += " LIMIT ?";
      params.push(limit);
    }

    return await this.db.query(sql, params);
  }

  async findByUserAndDate(id_user, tanggal) {
    const sql =
      "SELECT * FROM has_been_eaten WHERE id_user = ? AND tanggal = ? ORDER BY waktu ASC";
    return await this.db.query(sql, [id_user, tanggal]);
  }

  async findByUserAndCategory(id_user, kategori, tanggal) {
    let sql = "SELECT * FROM has_been_eaten WHERE id_user = ? AND kategori = ?";
    const params = [id_user, kategori];

    if (tanggal) {
      sql += " AND tanggal = ?";
      params.push(tanggal);
    }

    sql += " ORDER BY tanggal DESC, waktu DESC";
    return await this.db.query(sql, params);
  }

  async update(id_makanan, eatenData) {
    const fields = [];
    const params = [];

    Object.entries(eatenData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (fields.length === 0) {
      return await this.findById(id_makanan);
    }

    const sql = `UPDATE has_been_eaten SET ${fields.join(
      ", "
    )} WHERE id_makanan = ?`;
    params.push(id_makanan);

    await this.db.query(sql, params);
    return await this.findById(id_makanan);
  }

  async delete(id_makanan) {
    const sql = "DELETE FROM has_been_eaten WHERE id_makanan = ?";
    const result = await this.db.query(sql, [id_makanan]);

    return result.affectedRows > 0;
  }

  async findByDateRange(id_user, startDate, endDate) {
    const sql = `
      SELECT * FROM has_been_eaten 
      WHERE id_user = ? AND tanggal BETWEEN ? AND ?
      ORDER BY tanggal DESC, waktu DESC
    `;
    return await this.db.query(sql, [id_user, startDate, endDate]);
  }

  async getTodayMeals(id_user) {
    const today = new Date().toISOString().split("T")[0];
    return await this.findByUserAndDate(id_user, today);
  }

  async getWeeklyMeals(id_user) {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return await this.findByDateRange(
      id_user,
      weekAgo.toISOString().split("T")[0],
      today.toISOString().split("T")[0]
    );
  }
}

export default HasBeenEatenModel;