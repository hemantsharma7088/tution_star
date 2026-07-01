import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, BookOpen } from 'lucide-react';

const Homework = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({ title: '', description: '', due_date: '', class_id: '', subject_id: '', teacher_id: 1 });

  const fetchHomework = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/exams/homework`);
      setHomeworks(res.data);
    } catch (error) {
      console.error('Error fetching homework', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/exams/homework`, formData);
      setShowAddForm(false);
      fetchHomework();
    } catch (error) {
      alert('Error creating homework');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Homework & Assignments</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center shadow-md"
        >
          {showAddForm ? 'Cancel' : <><Plus size={20} className="mr-2" /> Assign Homework</>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">New Assignment</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none md:col-span-2" onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <textarea placeholder="Description" rows="3" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none md:col-span-2" onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
            <input type="number" placeholder="Class ID" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, class_id: e.target.value})} />
            <input type="number" placeholder="Subject ID" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, subject_id: e.target.value})} />
            <input type="date" required className="border p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" onChange={(e) => setFormData({...formData, due_date: e.target.value})} />
            <button type="submit" className="md:col-span-2 bg-primary-600 text-white py-2 rounded shadow hover:bg-primary-700 transition font-bold mt-2">Publish Assignment</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {loading ? <p className="text-gray-500">Loading assignments...</p> : homeworks.length === 0 ? <p className="text-gray-500 text-center p-8 bg-white rounded-xl border border-dashed border-gray-300">No homework assigned yet.</p> : (
          homeworks.map((hw) => (
            <div key={hw.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-gray-50 transition">
              <div className="bg-primary-50 text-primary-600 p-4 rounded-xl hidden md:block">
                <BookOpen size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{hw.title}</h3>
                <p className="text-gray-600 mb-2">{hw.description}</p>
                <div className="flex gap-4 text-sm text-gray-500 font-medium">
                  <span className="bg-gray-100 px-2 py-1 rounded">Class: {hw.class_id}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Subject: {hw.subject_id}</span>
                  <span className="bg-red-50 text-red-600 px-2 py-1 rounded">Due: {new Date(hw.due_date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <button className="w-full md:w-auto bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium">View Submissions</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Homework;
