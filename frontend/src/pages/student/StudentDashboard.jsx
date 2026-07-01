import React, { useEffect, useState } from 'react';
import { Book, Calendar, LogOut, Award, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
            TS
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">TuitionStar Student Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">Welcome, {user.first_name || 'Student'}!</span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">My Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-blue-500">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Calendar size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">My Attendance</p>
              <h3 className="text-2xl font-bold text-gray-800">92%</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-green-500">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><Book size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Enrolled Subjects</p>
              <h3 className="text-2xl font-bold text-gray-800">5</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-yellow-500">
            <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center"><FileText size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Homework</p>
              <h3 className="text-2xl font-bold text-gray-800">2</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-purple-500">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Award size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Upcoming Exams</p>
              <h3 className="text-2xl font-bold text-gray-800">1</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Homework Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FileText className="mr-2 text-yellow-500" /> Recent Homework</h3>
            <ul className="space-y-4">
              <li className="p-4 border rounded-xl hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">Algebra Equations</h4>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Due: Tomorrow</span>
                </div>
                <p className="text-sm text-gray-500">Solve pages 45 to 50 from the Mathematics textbook.</p>
              </li>
              <li className="p-4 border rounded-xl hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">Physics Lab Report</h4>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Completed</span>
                </div>
                <p className="text-sm text-gray-500">Submit the pendulum experiment observations.</p>
              </li>
            </ul>
          </div>

          {/* Schedule Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Calendar className="mr-2 text-blue-500" /> Today's Schedule</h3>
            <ul className="space-y-3">
              <li className="flex items-center p-3 border rounded-lg">
                <div className="w-20 text-sm font-bold text-gray-500">08:00 AM</div>
                <div className="flex-1 ml-4 border-l-2 border-primary-500 pl-4">
                  <h4 className="font-bold text-gray-800">Mathematics</h4>
                  <p className="text-xs text-gray-500">Room 101 - Mr. Smith</p>
                </div>
              </li>
              <li className="flex items-center p-3 border rounded-lg">
                <div className="w-20 text-sm font-bold text-gray-500">09:00 AM</div>
                <div className="flex-1 ml-4 border-l-2 border-green-500 pl-4">
                  <h4 className="font-bold text-gray-800">Physics</h4>
                  <p className="text-xs text-gray-500">Lab 3 - Dr. Adams</p>
                </div>
              </li>
              <li className="flex items-center p-3 border rounded-lg">
                <div className="w-20 text-sm font-bold text-gray-500">10:30 AM</div>
                <div className="flex-1 ml-4 border-l-2 border-yellow-500 pl-4">
                  <h4 className="font-bold text-gray-800">English Literature</h4>
                  <p className="text-xs text-gray-500">Room 104 - Ms. Davis</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
