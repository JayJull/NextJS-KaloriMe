import Database from "@/lib/database";

class ReportModel {
  constructor() {
    this.db = Database.getInstance();
  }

  async create(reportData) {
    const sql = "INSERT INTO report (id_makanan) VALUES (?)";
    const result = await this.db.query(sql, [reportData.id_makanan]);

    return await this.findById(result.insertId);
  }

  async findById(id_report) {
    const sql = "SELECT * FROM report WHERE id_report = ?";
    const result = await this.db.query(sql, [id_report]);

    return result.length > 0 ? result[0] : null;
  }

  async findByMakananId(id_makanan) {
    const sql =
      "SELECT * FROM report WHERE id_makanan = ? ORDER BY created_at DESC";
    return await this.db.query(sql, [id_makanan]);
  }

  async findAll(limit, offset) {
    let sql = "SELECT * FROM report ORDER BY created_at DESC";
    const params = [];

    if (limit) {
      sql += " LIMIT ?";
      params.push(limit);

      if (offset) {
        sql += " OFFSET ?";
        params.push(offset);
      }
    }

    return await this.db.query(sql, params);
  }

  async delete(id_report) {
    const sql = "DELETE FROM report WHERE id_report = ?";
    const result = await this.db.query(sql, [id_report]);

    return result.affectedRows > 0;
  }

  async getReportCount(id_makanan) {
    const sql = "SELECT COUNT(*) as count FROM report WHERE id_makanan = ?";
    const result = await this.db.query(sql, [id_makanan]);

    return result[0].count;
  }

  async getRecentReports(days = 7) {
    const sql = `
      SELECT * FROM report 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY created_at DESC
    `;
    return await this.db.query(sql, [days]);
  }
}

export default ReportModel;
