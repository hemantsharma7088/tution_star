import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Upload } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', password: '', admission_number: '', gender: 'Male'
  });
  
  const [csvData, setCsvData] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/students`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowAddForm(false);
      fetchStudents(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating student. Ensure email and admission number are unique.');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!csvData.trim()) return alert('Please enter CSV data');
    
    setBulkLoading(true);
    try {
      // Parse CSV simply by lines and commas
      const lines = csvData.split('\n').map(l => l.trim()).filter(l => l);
      // Skip header if it exists
      if (lines[0].toLowerCase().includes('first_name')) {
        lines.shift();
      }
      
      const parsedStudents = lines.map(line => {
        const [first_name, last_name, email, password, admission_number, gender] = line.split(',');
        return { 
          first_name: first_name?.trim(), 
          last_name: last_name?.trim(), 
          email: email?.trim(), 
          password: password?.trim() || 'student123', 
          admission_number: admission_number?.trim(), 
          gender: gender?.trim() || 'Male' 
        };
      });

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/students/bulk`, { students: parsedStudents }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowBulkUpload(false);
      setCsvData('');
      alert('Bulk upload successful!');
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error during bulk upload. Check CSV formatting.');
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Students Management</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => { setShowBulkUpload(!showBulkUpload); setShowAddForm(false); }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center shadow-md"
          >
            {showBulkUpload ? 'Cancel' : <><Upload size={20} className="mr-2" /> Bulk Upload</>}
          </button>
          <button 
            onClick={() => { setShowAddForm(!showAddForm); setShowBulkUpload(false); }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center shadow-md"
          >
            {showAddForm ? 'Cancel' : <><Plus size={20} className="mr-2" /> Add Student</>}
          </button>
        </div>
      </div>

      {showBulkUpload && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Upload className="mr-2 text-green-600"/> Bulk Upload Students (CSV)</h2>
          <p className="text-sm text-gray-500 mb-4">Paste your CSV data below. Format: <code>first_name,last_name,email,password,admission_number,gender</code></p>
          <form onSubmit={handleBulkUpload}>
            <textarea 
              rows="6" 
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm mb-4"
              placeholder="John,Doe,john@school.com,pass123,STU001,Male&#10;Jane,Smith,jane@school.com,pass123,STU002,Female"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
            ></textarea>
            <button type="submit" disabled={bulkLoading} className="bg-green-600 text-white py-2 px-6 rounded-lg shadow hover:bg-green-700 transition font-bold disabled:opacity-50">
              {bulkLoading ? 'Uploading...' : 'Process Bulk Upload'}
            </button>
          </form>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Student</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
            <input type="text" placeholder="Last Name" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
            <input type="email" placeholder="Email Address" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password (Optional)" className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <input type="text" placeholder="Admission Number" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, admission_number: e.target.value})} />
            <select className="border p-2 rounded outline-none focus:ring-2 focus:ring-primary-500" onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit" className="md:col-span-2 bg-primary-600 text-white py-2 rounded shadow hover:bg-primary-700 transition font-bold mt-2">Create Student</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-4 font-semibold">Adm No</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Gender</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-6 text-gray-500">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-6 text-gray-500">No students found.</td></tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{student.admission_number}</td>
                    <td className="p-4">{student.first_name} {student.last_name}</td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">{student.gender}</td>
                    <td className="p-4 flex gap-3 text-gray-400">
                      <button className="hover:text-primary-600 transition"><Edit2 size={18} /></button>
                      <button className="hover:text-red-500 transition"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
