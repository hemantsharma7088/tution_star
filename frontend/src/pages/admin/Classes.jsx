import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Book, Grid } from 'lucide-react';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showClassForm, setShowClassForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);

  const [classForm, setClassForm] = useState({ name: '', level: 'High School' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', credits: 1 });

  const fetchAcademics = async () => {
    try {
      const [classRes, subRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/classes`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/subjects`)
      ]);
      setClasses(classRes.data);
      setSubjects(subRes.data);
    } catch (error) {
      console.error('Error fetching academics data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademics();
  }, []);

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/classes`, classForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowClassForm(false);
      fetchAcademics();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating class');
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/subjects`, subjectForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowSubjectForm(false);
      fetchAcademics();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating subject');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Academics Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Classes Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center"><Grid className="mr-2 text-primary-600" /> Classes & Sections</h2>
            <button 
              onClick={() => setShowClassForm(!showClassForm)}
              className="text-sm bg-primary-50 text-primary-600 px-3 py-1 rounded-lg hover:bg-primary-100 transition font-medium flex items-center"
            >
              <Plus size={16} className="mr-1" /> {showClassForm ? 'Cancel' : 'Add Class'}
            </button>
          </div>

          {showClassForm && (
            <form onSubmit={handleAddClass} className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <input type="text" placeholder="Class Name (e.g. Grade 10 - A)" required className="w-full border p-2 rounded mb-2" onChange={e => setClassForm({...classForm, name: e.target.value})} />
              <select className="w-full border p-2 rounded mb-3" onChange={e => setClassForm({...classForm, level: e.target.value})}>
                <option value="High School">High School</option>
                <option value="Middle School">Middle School</option>
                <option value="Primary School">Primary School</option>
              </select>
              <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded shadow hover:bg-primary-700 transition font-bold">Save Class</button>
            </form>
          )}

          {loading ? <p className="text-gray-500">Loading classes...</p> : (
            <ul className="space-y-3">
              {classes.length === 0 ? <p className="text-gray-500 text-sm">No classes found.</p> : classes.map(c => (
                <li key={c.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                  <span className="font-medium text-gray-800">{c.name}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{c.level}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Subjects Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center"><Book className="mr-2 text-green-600" /> Subjects</h2>
            <button 
              onClick={() => setShowSubjectForm(!showSubjectForm)}
              className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-lg hover:bg-green-100 transition font-medium flex items-center"
            >
              <Plus size={16} className="mr-1" /> {showSubjectForm ? 'Cancel' : 'Add Subject'}
            </button>
          </div>

          {showSubjectForm && (
            <form onSubmit={handleAddSubject} className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <input type="text" placeholder="Subject Name" required className="w-full border p-2 rounded mb-2" onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} />
              <input type="text" placeholder="Subject Code (e.g. PHY101)" required className="w-full border p-2 rounded mb-2" onChange={e => setSubjectForm({...subjectForm, code: e.target.value})} />
              <input type="number" placeholder="Credits" min="1" max="10" required className="w-full border p-2 rounded mb-3" onChange={e => setSubjectForm({...subjectForm, credits: parseInt(e.target.value)})} />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded shadow hover:bg-green-700 transition font-bold">Save Subject</button>
            </form>
          )}

          {loading ? <p className="text-gray-500">Loading subjects...</p> : (
            <ul className="space-y-3">
              {subjects.length === 0 ? <p className="text-gray-500 text-sm">No subjects found.</p> : subjects.map(s => (
                <li key={s.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                  <div>
                    <span className="font-medium text-gray-800 block">{s.name}</span>
                    <span className="text-xs text-gray-400">Code: {s.code}</span>
                  </div>
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded font-medium">{s.credits} Credits</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;
