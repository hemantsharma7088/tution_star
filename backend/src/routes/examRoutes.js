const express = require('express');
const { getExams, createExam, getMarksByExam, enterMarks, getHomework, createHomework } = require('../controllers/examController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// Exams
router.route('/')
  .get(getExams)
  .post(adminOnly, createExam);

// Marks
router.route('/marks')
  .get(getMarksByExam)
  .post(enterMarks);

// Homework
router.route('/homework')
  .get(getHomework)
  .post(createHomework);

module.exports = router;
