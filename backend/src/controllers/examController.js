const db = require('../config/db');

// --- Exams ---
const getExams = async (req, res) => {
  try {
    const [exams] = await db.execute('SELECT * FROM Exams');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createExam = async (req, res) => {
  const { name, start_date, end_date, class_id } = req.body;
  try {
    await db.execute('INSERT INTO Exams (name, start_date, end_date, class_id) VALUES (?, ?, ?, ?)', [name, start_date, end_date, class_id]);
    res.status(201).json({ message: 'Exam created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Marks ---
const getMarksByExam = async (req, res) => {
  const { exam_id, class_id } = req.query;
  try {
    const [marks] = await db.execute(
      `SELECT m.*, s.first_name, s.last_name, sub.name as subject_name 
       FROM Marks m 
       JOIN Students s ON m.student_id = s.id 
       JOIN Subjects sub ON m.subject_id = sub.id
       WHERE m.exam_id = ? AND s.class_id = ?`,
      [exam_id, class_id]
    );
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const enterMarks = async (req, res) => {
  const { exam_id, student_id, subject_id, marks_obtained, total_marks } = req.body;
  const grade = (marks_obtained / total_marks) >= 0.9 ? 'A' : (marks_obtained / total_marks) >= 0.8 ? 'B' : (marks_obtained / total_marks) >= 0.7 ? 'C' : 'F';
  try {
    await db.execute(
      'INSERT INTO Marks (exam_id, student_id, subject_id, marks_obtained, total_marks, grade) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE marks_obtained = VALUES(marks_obtained), total_marks = VALUES(total_marks), grade = VALUES(grade)',
      [exam_id, student_id, subject_id, marks_obtained, total_marks, grade]
    );
    res.status(200).json({ message: 'Marks entered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Homework ---
const getHomework = async (req, res) => {
  try {
    const [homework] = await db.execute('SELECT * FROM Homework');
    res.json(homework);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createHomework = async (req, res) => {
  const { class_id, subject_id, teacher_id, title, description, due_date } = req.body;
  try {
    await db.execute(
      'INSERT INTO Homework (class_id, subject_id, teacher_id, title, description, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [class_id, subject_id, teacher_id, title, description, due_date]
    );
    res.status(201).json({ message: 'Homework created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getExams, createExam, getMarksByExam, enterMarks, getHomework, createHomework };
