const express = require('express');
const { getStudents, createStudent, createStudentsBulk, getTeachers, createTeacher, getDashboardStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect, adminOnly);

// Dashboard Stats
router.get('/stats', getDashboardStats);

// Students
router.route('/students')
  .get(getStudents)
  .post(createStudent);

router.post('/students/bulk', createStudentsBulk);

// Teachers
router.route('/teachers')
  .get(getTeachers)
  .post(createTeacher);

module.exports = router;
