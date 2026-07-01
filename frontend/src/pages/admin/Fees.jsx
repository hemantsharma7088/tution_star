import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, DollarSign, Download, Search } from 'lucide-react';

const Fees = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/operations/fees/invoices`);
      setInvoices(res.data);
    } catch (error) {
      console.error('Error fetching invoices', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Fees Management</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center shadow-md">
          <Plus size={20} className="mr-2" /> Generate Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center border-l-4 border-green-500">
          <div className="p-4 bg-green-50 rounded-full text-green-600 mr-4"><DollarSign size={24} /></div>
          <div><p className="text-gray-500 text-sm">Total Collected</p><h3 className="text-2xl font-bold">$125,000</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center border-l-4 border-yellow-500">
          <div className="p-4 bg-yellow-50 rounded-full text-yellow-600 mr-4"><DollarSign size={24} /></div>
          <div><p className="text-gray-500 text-sm">Pending Fees</p><h3 className="text-2xl font-bold">$45,200</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center border-l-4 border-blue-500">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600 mr-4"><Download size={24} /></div>
          <div><p className="text-gray-500 text-sm">Invoices Generated</p><h3 className="text-2xl font-bold">850</h3></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input type="text" placeholder="Search by student name..." className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-4 font-semibold">Invoice ID</th>
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center p-6 text-gray-500">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-6 text-gray-500">No invoices generated.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-500 font-medium">#INV-{inv.id.toString().padStart(4, '0')}</td>
                    <td className="p-4">{inv.first_name} {inv.last_name}</td>
                    <td className="p-4">{inv.category_name}</td>
                    <td className="p-4 font-bold text-gray-700">${inv.amount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-primary-600 hover:bg-primary-50 px-3 py-1 rounded font-medium text-sm transition border border-primary-200">Collect</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fees;
