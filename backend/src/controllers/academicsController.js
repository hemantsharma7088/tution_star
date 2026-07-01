const db = require('../config/db');

// --- Classes ---
const getClasses = async (req, res) => {
  try {
    const [classes] = await db.execute('SELECT * FROM Classes');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createClass = async (req, res) => {
  const { name, level } = req.body;
  try {
    await db.execute('INSERT INTO Classes (name, level) VALUES (?, ?)', [name, level]);
    res.status(201).json({ message: 'Class created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Subjects ---
const getSubjects = async (req, res) => {
  try {
    const [subjects] = await db.execute('SELECT * FROM Subjects');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createSubject = async (req, res) => {
  const { name, code, credits } = req.body;
  try {
    await db.execute('INSERT INTO Subjects (name, code, credits) VALUES (?, ?, ?)', [name, code, credits]);
    res.status(201).json({ message: 'Subject created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Attendance ---
const markAttendance = async (req, res) => {
  const { student_id, class_id, date, status } = req.body;
  const recorded_by = req.user.id; // From authMiddleware
  try {
    await db.execute(
      'INSERT INTO Attendance (student_id, class_id, date, status, recorded_by) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status), recorded_by = VALUES(recorded_by)',
      [student_id, class_id, date, status, recorded_by]
    );
    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getAttendanceByClassAndDate = async (req, res) => {
  const { class_id, date } = req.query;
  try {
    const [attendance] = await db.execute(
      `SELECT a.*, s.first_name, s.last_name, s.admission_number 
       FROM Attendance a 
       JOIN Students s ON a.student_id = s.id 
       WHERE a.class_id = ? AND a.date = ?`,
      [class_id, date]
    );
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getClasses, createClass, getSubjects, createSubject, markAttendance, getAttendanceByClassAndDate };
