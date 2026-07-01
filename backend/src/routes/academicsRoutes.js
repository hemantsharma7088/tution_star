const express = require('express');
const { getClasses, createClass, getSubjects, createSubject, markAttendance, getAttendanceByClassAndDate } = require('../controllers/academicsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// Classes (Only admins can create, all authenticated users can view)
router.route('/classes')
  .get(getClasses)
  .post(adminOnly, createClass);

// Subjects (Only admins can create, all authenticated users can view)
router.route('/subjects')
  .get(getSubjects)
  .post(adminOnly, createSubject);

// Attendance
router.route('/attendance')
  .get(getAttendanceByClassAndDate)
  .post(markAttendance); // Usually teachers mark attendance, but for now we'll just require auth. In a real app we'd have a teacherOrAdmin middleware.

module.exports = router;
