import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck, Plus, MapPin } from 'lucide-react';

const Transport = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/operations/transport/routes`);
      setRoutes(res.data);
    } catch (error) {
      console.error('Error fetching routes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Transport Management</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center shadow-md">
          <Plus size={20} className="mr-2" /> Add Route
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p className="text-gray-500 col-span-3">Loading routes...</p> : routes.length === 0 ? <p className="text-gray-500 col-span-3 text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">No transport routes available.</p> : (
          routes.map((route) => (
            <div key={route.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-3 rounded-lg text-orange-500">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{route.name}</h3>
                    <p className="text-sm text-gray-500">Vehicle: {route.vehicle_number}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm flex items-center"><MapPin size={14} className="mr-1" /> Driver</span>
                  <span className="font-medium text-gray-800">{route.driver_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Monthly Fare</span>
                  <span className="font-bold text-primary-600">${route.fare}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transport;
