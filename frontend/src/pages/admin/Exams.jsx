import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Award, FileText } from 'lucide-react';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', start_date: '', end_date: '', class_id: '' });

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/exams`);
      setExams(res.data);
    } catch (error) {
      console.error('Error fetching exams', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/exams`, formData);
      setShowAddForm(false);
      fetchExams();
    } catch (error) {
      alert('Error creating exam');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Examination Module</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center shadow-md"
        >
          {showAddForm ? 'Cancel' : <><Plus size={20} className="mr-2" /> Schedule Exam</>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Award className="mr-2 text-primary-600"/> New Examination</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Exam Name (e.g., Midterm 2026)" required className="border p-2 rounded outline-none focus:ring-2 focus:ring-primary-500" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="number" placeholder="Class ID" required className="border p-2 rounded outline-none focus:ring-2 focus:ring-primary-500" onChange={(e) => setFormData({...formData, class_id: e.target.value})} />
            <div>
              <label className="block text-sm text-gray-500 mb-1">Start Date</label>
              <input type="date" required className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary-500" onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">End Date</label>
              <input type="date" required className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary-500" onChange={(e) => setFormData({...formData, end_date: e.target.value})} />
            </div>
            <button type="submit" className="md:col-span-2 bg-primary-600 text-white py-2 rounded shadow hover:bg-primary-700 transition font-bold mt-2">Create Exam</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? <p className="text-gray-500 col-span-3">Loading exams...</p> : exams.length === 0 ? <p className="text-gray-500 col-span-3">No exams scheduled.</p> : (
          exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{exam.name}</h3>
                  <p className="text-sm text-gray-500">Class ID: {exam.class_id}</p>
                </div>
                <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
                  <FileText size={24} />
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4 flex justify-between">
                <span>Start: {new Date(exam.start_date).toLocaleDateString()}</span>
                <span>End: {new Date(exam.end_date).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-50 text-gray-700 py-2 rounded border border-gray-200 hover:bg-gray-100 transition text-sm font-medium">Enter Marks</button>
                <button className="flex-1 bg-green-50 text-green-700 py-2 rounded border border-green-200 hover:bg-green-100 transition text-sm font-medium">Results</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Exams;
