import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserPlus, BookOpen, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 ${color}`}
  >
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-4 rounded-full bg-gray-50 text-gray-600`}>
      {icon}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClasses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/stats`);
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12000, 19000, 15000, 22000, 18000, 25000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Attendance %',
        data: [95, 92, 98, 85, 91],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4
      }
    ]
  };

  if (loading) return <div className="text-center text-gray-500 py-10">Loading Dashboard...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users size={24} />} color="border-blue-500" />
        <StatCard title="Total Teachers" value={stats.totalTeachers} icon={<UserPlus size={24} />} color="border-green-500" />
        <StatCard title="Total Classes" value={stats.totalClasses} icon={<BookOpen size={24} />} color="border-yellow-500" />
        <StatCard title="System Status" value="Online" icon={<Activity size={24} />} color="border-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Revenue Overview</h2>
          <div className="h-64">
            <Line data={revenueData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Weekly Attendance</h2>
          <div className="h-64">
            <Bar data={attendanceData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
