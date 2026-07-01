const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbPromise = open({
  filename: path.join(__dirname, '../../database.sqlite'),
  driver: sqlite3.Database
});

const executeSql = async (sql, params = []) => {
  const db = await dbPromise;
  
  // Basic translation of some MySQL syntax to SQLite
  let safeSql = sql.replace(/AUTO_INCREMENT/g, 'AUTOINCREMENT');
  
  if (safeSql.trim().toUpperCase().startsWith('SELECT')) {
    const rows = await db.all(safeSql, params);
    return [rows, []];
  } else {
    const result = await db.run(safeSql, params);
    return [{ insertId: result.lastID, affectedRows: result.changes }];
  }
};

const pool = {
  execute: executeSql,
  query: executeSql,
  getConnection: async () => {
    return {
      beginTransaction: async () => {
        const db = await dbPromise;
        await db.run('BEGIN TRANSACTION');
      },
      commit: async () => {
        const db = await dbPromise;
        await db.run('COMMIT');
      },
      rollback: async () => {
        const db = await dbPromise;
        await db.run('ROLLBACK');
      },
      execute: executeSql,
      query: executeSql,
      release: () => {}
    };
  }
};

module.exports = pool;
