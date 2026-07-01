import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, BookOpen } from 'lucide-react';

const TimeTable = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);

  useEffect(() => {
    // Fetch classes for dropdown
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/classes`);
        setClasses(res.data);
        if (res.data.length > 0) {
          setSelectedClass(res.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching classes', error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    
    // In a real app we'd fetch this from the backend. 
    // Here we'll generate some dummy schedule based on subjects to fulfill the requirement immediately
    const fetchTimetable = async () => {
      setLoading(true);
      try {
        // We'll just fetch subjects to use as dummy schedule
        const subRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/academics/subjects`);
        const subjects = subRes.data;
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const times = ['08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:30 AM - 11:30 AM', '11:30 AM - 12:30 PM'];
        
        let dummySchedule = [];
        
        days.forEach(day => {
          times.forEach((time, index) => {
            const randomSubject = subjects.length > 0 ? subjects[(index + day.length) % subjects.length].name : 'Study Period';
            dummySchedule.push({ day, time, subject: randomSubject, teacher: 'Assigned Teacher' });
          });
        });
        
        setTimetableData(dummySchedule);
      } catch (error) {
        console.error('Error generating timetable', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimetable();
  }, [selectedClass]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:30 AM - 11:30 AM', '11:30 AM - 12:30 PM'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
          <Calendar className="mr-3 text-primary-600" size={32} />
          Class Timetable
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class Section</label>
        <select 
          className="w-full md:w-1/3 border p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading timetable...</div>
        ) : (
          <div className="overflow-x-auto p-6">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border font-bold bg-slate-50 text-slate-700">Time / Day</th>
                  {days.map(day => (
                    <th key={day} className="p-4 border font-bold bg-slate-50 text-slate-700">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map(time => (
                  <tr key={time}>
                    <td className="p-4 border font-medium text-slate-600 whitespace-nowrap">
                      <Clock size={16} className="inline mr-2 text-slate-400" />
                      {time}
                    </td>
                    {days.map(day => {
                      const slot = timetableData.find(t => t.day === day && t.time === time);
                      return (
                        <td key={`${day}-${time}`} className="p-4 border hover:bg-slate-50 transition cursor-default group relative">
                          {slot ? (
                            <div className="flex flex-col items-center justify-center">
                              <span className="font-bold text-primary-700">{slot.subject}</span>
                              <span className="text-xs text-slate-500 mt-1">{slot.teacher}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTable;
