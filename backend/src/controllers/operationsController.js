const db = require('../config/db');

// --- Fees ---
const getFeeCategories = async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM Fee_Categories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createFeeCategory = async (req, res) => {
  const { name, amount, class_id } = req.body;
  try {
    await db.execute('INSERT INTO Fee_Categories (name, amount, class_id) VALUES (?, ?, ?)', [name, amount, class_id]);
    res.status(201).json({ message: 'Fee Category created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getInvoices = async (req, res) => {
  try {
    const [invoices] = await db.execute(`
      SELECT i.*, s.first_name, s.last_name, fc.name as category_name, fc.amount 
      FROM Invoices i
      JOIN Students s ON i.student_id = s.id
      JOIN Fee_Categories fc ON i.fee_category_id = fc.id
    `);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const generateInvoice = async (req, res) => {
  const { student_id, fee_category_id, due_date } = req.body;
  try {
    await db.execute('INSERT INTO Invoices (student_id, fee_category_id, due_date) VALUES (?, ?, ?)', [student_id, fee_category_id, due_date]);
    res.status(201).json({ message: 'Invoice generated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Library ---
const getBooks = async (req, res) => {
  try {
    const [books] = await db.execute('SELECT * FROM Books');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const addBook = async (req, res) => {
  const { title, author, category, isbn, total_copies } = req.body;
  try {
    await db.execute(
      'INSERT INTO Books (title, author, category, isbn, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?)', 
      [title, author, category, isbn, total_copies, total_copies]
    );
    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Transport ---
const getRoutes = async (req, res) => {
  try {
    const [routes] = await db.execute('SELECT * FROM Routes');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const addRoute = async (req, res) => {
  const { name, driver_name, vehicle_number, fare } = req.body;
  try {
    await db.execute(
      'INSERT INTO Routes (name, driver_name, vehicle_number, fare) VALUES (?, ?, ?, ?)', 
      [name, driver_name, vehicle_number, fare]
    );
    res.status(201).json({ message: 'Route added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { 
  getFeeCategories, createFeeCategory, getInvoices, generateInvoice,
  getBooks, addBook,
  getRoutes, addRoute
};
