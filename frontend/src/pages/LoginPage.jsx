import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [loginRole, setLoginRole] = useState('admin');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
      const user = res.data.user;
      
      // Simple validation: if they selected Student tab but logged in as Admin, or vice versa, warn them? 
      // We'll just let the backend role determine where they go, but we can guide them based on their actual role.
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role_id === 3) {
        navigate('/student');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="glass p-8 max-w-md w-full border border-gray-100 shadow-2xl rounded-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary-600 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your account to continue</p>
        </div>
        
        {/* Role Selection Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
          <button 
            onClick={() => setLoginRole('admin')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginRole === 'admin' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Admin
          </button>
          <button 
            onClick={() => setLoginRole('teacher')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginRole === 'teacher' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Teacher
          </button>
          <button 
            onClick={() => setLoginRole('student')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginRole === 'student' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Student
          </button>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {loginRole === 'student' ? 'Student Email' : loginRole === 'teacher' ? 'Teacher Email' : 'Admin Email'}
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              required 
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 mr-2" />
              Remember me
            </label>
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Forgot Password?</a>
          </div>

          <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold shadow-md">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
