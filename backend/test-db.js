const db = require('./src/config/db');

async function testTeacherInsert() {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [userRes] = await connection.execute(
      'INSERT INTO Users (email, password_hash, role_id) VALUES (?, ?, ?)',
      ['test@test.com', 'hash', 2] // 2 is Teacher role
    );
    console.log('User inserted, insertId:', userRes.insertId);

    await connection.execute(
      'INSERT INTO Teachers (user_id, first_name, last_name, qualification, phone) VALUES (?, ?, ?, ?, ?)',
      [userRes.insertId, 'Test', 'Teacher', 'MSc', '1234567890']
    );
    console.log('Teacher inserted');

    await connection.commit();
    console.log('Success');
  } catch (err) {
    console.error('Error:', err.message);
    await connection.rollback();
  }
}

testTeacherInsert();
