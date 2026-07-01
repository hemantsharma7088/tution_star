async function testAPI() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@school.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    console.log('Login:', loginData);

    const token = loginData.token;

    const teacherRes = await fetch('http://localhost:5000/api/admin/teachers', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email: 'newteacher@school.com', password: '123', first_name: 'New', last_name: 'Teacher', qualification: 'MSc', phone: '1234567890' })
    });
    const teacherData = await teacherRes.json();
    console.log('Teacher Creation:', teacherData);
  } catch (err) {
    console.error(err);
  }
}
testAPI();
