const db = require('../config/db');

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(email, password_hash, role_id) {
    const [result] = await db.execute(
      'INSERT INTO Users (email, password_hash, role_id) VALUES (?, ?, ?)',
      [email, password_hash, role_id]
    );
    return result.insertId;
  }
  
  static async getRoleByName(roleName) {
    const [rows] = await db.execute('SELECT id FROM Roles WHERE name = ?', [roleName]);
    return rows[0];
  }
}

module.exports = User;
