import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Users, UserPlus, BookOpen, LogOut, Calendar, Award, FileText, DollarSign, Book, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
    { name: 'Students', path: '/admin/students', icon: <Users size={20} /> },
    { name: 'Teachers', path: '/admin/teachers', icon: <UserPlus size={20} /> },
    { name: 'Academics', path: '/admin/classes', icon: <BookOpen size={20} /> },
    { name: 'Timetable', path: '/admin/timetable', icon: <Calendar size={20} /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <Calendar size={20} /> },
    { name: 'Exams', path: '/admin/exams', icon: <Award size={20} /> },
    { name: 'Homework', path: '/admin/homework', icon: <FileText size={20} /> },
    { name: 'Fees', path: '/admin/fees', icon: <DollarSign size={20} /> },
    { name: 'Library', path: '/admin/library', icon: <Book size={20} /> },
    { name: 'Transport', path: '/admin/transport', icon: <Truck size={20} /> },
  ];

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="w-64 bg-white shadow-xl h-full flex flex-col z-20"
    >
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
          TS
        </div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">TuitionStar</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-4">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.li 
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive 
                      ? 'bg-primary-50 text-primary-600 shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <span className={isActive ? 'text-primary-600' : 'text-gray-400'}>{item.icon}</span>
                  {item.name}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
