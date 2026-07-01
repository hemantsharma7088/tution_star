import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/classes`);
        setClasses(res.data);
        if (res.data.length > 0) setSelectedClass(res.data[0].id);
      } catch (error) {
        console.error('Error fetching classes', error);
      }
    };
    fetchClasses();
  }, []);

  const fetchAttendance = async () => {
    if (!selectedClass || !date) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/academics/attendance?class_id=${selectedClass}&date=${date}`);
      setAttendanceData(res.data);
    } catch (error) {
      console.error('Error fetching attendance', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedClass, date]);

  const handleMark = async (studentId, status) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/attendance`, {
        student_id: studentId,
        class_id: selectedClass,
        date,
        status
      });
      fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance', error);
      alert('Failed to mark attendance. (Ensure you are logged in)');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Attendance Register</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b">
              <th className="p-4 font-semibold">Student Name</th>
              <th className="p-4 font-semibold">Adm No</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="4" className="text-center p-6 text-gray-500">Loading...</td></tr>
            ) : attendanceData.length === 0 ? (
               <tr><td colSpan="4" className="text-center p-6 text-gray-500">No attendance records found for this date/class. To mark attendance, we would map over the enrolled students list here.</td></tr>
            ) : (
              attendanceData.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{record.first_name} {record.last_name}</td>
                  <td className="p-4 text-gray-500">{record.admission_number}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      record.status === 'Present' ? 'bg-green-100 text-green-700' : 
                      record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleMark(record.student_id, 'Present')} className="text-green-500 hover:bg-green-50 p-2 rounded transition"><CheckCircle size={20} /></button>
                    <button onClick={() => handleMark(record.student_id, 'Absent')} className="text-red-500 hover:bg-red-50 p-2 rounded transition"><XCircle size={20} /></button>
                    <button onClick={() => handleMark(record.student_id, 'Late')} className="text-yellow-500 hover:bg-yellow-50 p-2 rounded transition"><Clock size={20} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
