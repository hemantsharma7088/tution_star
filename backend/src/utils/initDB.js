const db = require('../config/db');

async function initDB() {
  try {
    console.log('Creating SQLite tables...');
    
    // Users
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role_id INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Roles
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) UNIQUE NOT NULL
      )
    `);

    await db.execute(`INSERT OR IGNORE INTO Roles (name) VALUES ('Admin'), ('Teacher'), ('Student'), ('Parent')`);

    // Admin user
    const [roles] = await db.execute(`SELECT id FROM Roles WHERE name = 'Admin'`);
    if (roles.length > 0) {
      const adminRoleId = roles[0].id;
      const [existingAdmin] = await db.execute(`SELECT id FROM Users WHERE email = 'admin@school.com'`);
      if (existingAdmin.length === 0) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('admin123', salt);
        await db.execute(`INSERT INTO Users (email, password_hash, role_id) VALUES (?, ?, ?)`, ['admin@school.com', hash, adminRoleId]);
        console.log('Created default admin user: admin@school.com / admin123');
      }
    }

    // Teachers
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        qualification VARCHAR(255),
        experience INTEGER DEFAULT 0,
        salary REAL,
        phone VARCHAR(20),
        hire_date DATE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Classes
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL,
        level VARCHAR(50)
      )
    `);

    // Sections
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER NOT NULL,
        name VARCHAR(50) NOT NULL,
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE
      )
    `);

    // Students
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        admission_number VARCHAR(50) UNIQUE NOT NULL,
        roll_number VARCHAR(50),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        dob DATE,
        gender VARCHAR(20),
        blood_group VARCHAR(10),
        address TEXT,
        phone VARCHAR(20),
        aadhaar_number VARCHAR(20),
        class_id INTEGER,
        section_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE SET NULL,
        FOREIGN KEY (section_id) REFERENCES Sections(id) ON DELETE SET NULL
      )
    `);

    // Subjects
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(20) UNIQUE,
        credits INTEGER DEFAULT 1
      )
    `);

    // Class_Subjects
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Class_Subjects (
        class_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        teacher_id INTEGER,
        PRIMARY KEY (class_id, subject_id),
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES Teachers(id) ON DELETE SET NULL
      )
    `);

    // Attendance
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(20) NOT NULL,
        recorded_by INTEGER NOT NULL,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE,
        FOREIGN KEY (recorded_by) REFERENCES Users(id) ON DELETE CASCADE,
        UNIQUE (student_id, date)
      )
    `);

    // Exams
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Exams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        start_date DATE,
        end_date DATE,
        class_id INTEGER,
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE
      )
    `);

    // Marks
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        marks_obtained REAL,
        total_marks REAL,
        grade VARCHAR(5),
        FOREIGN KEY (exam_id) REFERENCES Exams(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE,
        UNIQUE (exam_id, student_id, subject_id)
      )
    `);

    // Homework
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Homework (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        teacher_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE,
        file_url VARCHAR(255),
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES Teachers(id) ON DELETE CASCADE
      )
    `);

    // Submissions
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        homework_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        file_url VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'Submitted',
        marks REAL,
        feedback TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (homework_id) REFERENCES Homework(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
      )
    `);

    // Fee Categories
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Fee_Categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        amount REAL NOT NULL,
        class_id INTEGER,
        FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE
      )
    `);

    // Invoices
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        fee_category_id INTEGER NOT NULL,
        due_date DATE,
        status VARCHAR(20) DEFAULT 'Pending',
        fine REAL DEFAULT 0,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
        FOREIGN KEY (fee_category_id) REFERENCES Fee_Categories(id) ON DELETE CASCADE
      )
    `);

    // Payments
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER NOT NULL,
        amount_paid REAL NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        method VARCHAR(20) DEFAULT 'Cash',
        transaction_id VARCHAR(100),
        FOREIGN KEY (invoice_id) REFERENCES Invoices(id) ON DELETE CASCADE
      )
    `);

    // Library Books
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        category VARCHAR(100),
        isbn VARCHAR(50),
        total_copies INTEGER DEFAULT 1,
        available_copies INTEGER DEFAULT 1
      )
    `);

    // Issued Books
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Issued_Books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        issue_date DATE NOT NULL,
        due_date DATE NOT NULL,
        return_date DATE,
        fine REAL DEFAULT 0,
        FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Transport Routes
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        driver_name VARCHAR(100),
        vehicle_number VARCHAR(50) NOT NULL,
        fare REAL DEFAULT 0
      )
    `);

    // Hostel Rooms
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Hostel_Rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hostel_name VARCHAR(100) NOT NULL,
        room_number VARCHAR(20) NOT NULL,
        capacity INTEGER DEFAULT 1,
        fee REAL DEFAULT 0
      )
    `);

    console.log('SQLite Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
    process.exit(1);
  }
}

initDB();
