const express = require('express');
const { 
  getFeeCategories, createFeeCategory, getInvoices, generateInvoice,
  getBooks, addBook,
  getRoutes, addRoute
} = require('../controllers/operationsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// --- Fees ---
router.route('/fees/categories')
  .get(getFeeCategories)
  .post(adminOnly, createFeeCategory);

router.route('/fees/invoices')
  .get(getInvoices)
  .post(adminOnly, generateInvoice);

// --- Library ---
router.route('/library/books')
  .get(getBooks)
  .post(adminOnly, addBook);

// --- Transport ---
router.route('/transport/routes')
  .get(getRoutes)
  .post(adminOnly, addRoute);

module.exports = router;
