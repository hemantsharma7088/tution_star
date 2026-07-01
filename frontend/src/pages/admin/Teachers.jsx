import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, UserPlus } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    qualification: '',
    phone: ''
  });

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTeachers(res.data);
    } catch (error) {
      console.error('Error fetching teachers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/teachers`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowAddForm(false);
      fetchTeachers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating teacher. Make sure the email is unique.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Teachers Directory</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center shadow-md"
        >
          {showAddForm ? 'Cancel' : <><Plus size={20} className="mr-2" /> Add Teacher</>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center"><UserPlus className="mr-2 text-primary-600"/> New Teacher Profile</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
            <input type="text" placeholder="Last Name" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
            <input type="email" placeholder="Email" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <input type="text" placeholder="Qualification (e.g. M.Sc, B.Ed)" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, qualification: e.target.value})} />
            <input type="text" placeholder="Phone" className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <button type="submit" className="md:col-span-2 bg-primary-600 text-white py-2 rounded shadow hover:bg-primary-700 transition font-bold mt-2">Create Teacher Account</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input type="text" placeholder="Search by name or email..." className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b text-sm">
                <th className="p-4 font-semibold">Teacher Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Qualification</th>
                <th className="p-4 font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center p-6 text-gray-500">Loading...</td></tr>
              ) : teachers.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-6 text-gray-500">No teachers found.</td></tr>
              ) : (
                teachers.map(teacher => (
                  <tr key={teacher.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3">
                        {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                      </div>
                      {teacher.first_name} {teacher.last_name}
                    </td>
                    <td className="p-4 text-gray-600">{teacher.email}</td>
                    <td className="p-4 text-gray-600"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{teacher.qualification}</span></td>
                    <td className="p-4 text-gray-600">{teacher.phone || 'N/A'}</td>
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

export default Teachers;
