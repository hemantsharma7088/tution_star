const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper to get Role ID
const getRoleId = async (name) => {
  const [rows] = await db.execute('SELECT id FROM Roles WHERE name = ?', [name]);
  return rows[0]?.id;
};

// --- Student CRUD ---
const getStudents = async (req, res) => {
  try {
    const [students] = await db.execute(`
      SELECT s.*, u.email 
      FROM Students s 
      JOIN Users u ON s.user_id = u.id
    `);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createStudent = async (req, res) => {
  const { email, password, admission_number, first_name, last_name, gender } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Create User
    const roleId = await getRoleId('Student');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password || 'default123', salt); // Default pass if not provided
    
    const [userRes] = await connection.execute(
      'INSERT INTO Users (email, password_hash, role_id) VALUES (?, ?, ?)',
      [email, hash, roleId]
    );
    const userId = userRes.insertId;

    // 2. Create Student
    await connection.execute(
      'INSERT INTO Students (user_id, admission_number, first_name, last_name, gender) VALUES (?, ?, ?, ?, ?)',
      [userId, admission_number, first_name, last_name, gender]
    );

    await connection.commit();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Server Error', error: error.message });
  } finally {
    connection.release();
  }
};

const createStudentsBulk = async (req, res) => {
  const { students } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const roleId = await getRoleId('Student');
    const salt = await bcrypt.genSalt(10);
    
    for (const student of students) {
      if (!student.email || !student.admission_number) continue;
      
      const hash = await bcrypt.hash(student.password || 'student123', salt);
      const [userRes] = await connection.execute(
        'INSERT INTO Users (email, password_hash, role_id) VALUES (?, ?, ?)',
        [student.email, hash, roleId]
      );
      
      await connection.execute(
        'INSERT INTO Students (user_id, admission_number, first_name, last_name, gender) VALUES (?, ?, ?, ?, ?)',
        [userRes.insertId, student.admission_number, student.first_name, student.last_name, student.gender]
      );
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Students imported successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Server Error', error: error.message });
  } finally {
    connection.release();
  }
};

// --- Teacher CRUD ---
const getTeachers = async (req, res) => {
  try {
    const [teachers] = await db.execute(`
      SELECT t.*, u.email 
      FROM Teachers t 
      JOIN Users u ON t.user_id = u.id
    `);
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createTeacher = async (req, res) => {
  const { email, password, first_name, last_name, qualification, phone } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Create User
    const roleId = await getRoleId('Teacher');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password || 'teacher123', salt);
    
    const [userRes] = await connection.execute(
      'INSERT INTO Users (email, password_hash, role_id) VALUES (?, ?, ?)',
      [email, hash, roleId]
    );
    const userId = userRes.insertId;

    // 2. Create Teacher
    await connection.execute(
      'INSERT INTO Teachers (user_id, first_name, last_name, qualification, phone) VALUES (?, ?, ?, ?, ?)',
      [userId, first_name, last_name, qualification, phone]
    );

    await connection.commit();
    res.status(201).json({ message: 'Teacher created successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Server Error', error: error.message });
  } finally {
    connection.release();
  }
};

// Get Basic Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const [students] = await db.execute('SELECT COUNT(*) as count FROM Students');
    const [teachers] = await db.execute('SELECT COUNT(*) as count FROM Teachers');
    const [classes] = await db.execute('SELECT COUNT(*) as count FROM Classes');
    
    res.json({
      totalStudents: students[0].count,
      totalTeachers: teachers[0].count,
      totalClasses: classes[0].count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getStudents,
  createStudent,
  createStudentsBulk,
  getTeachers,
  createTeacher,
  getDashboardStats
};
