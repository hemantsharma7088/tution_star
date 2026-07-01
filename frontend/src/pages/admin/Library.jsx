import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Book, Plus, Search } from 'lucide-react';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/operations/library/books`);
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Library Management</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center shadow-md">
          <Plus size={20} className="mr-2" /> Add New Book
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input type="text" placeholder="Search books by title or ISBN..." className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {loading ? <p className="text-gray-500 col-span-3">Loading books...</p> : books.length === 0 ? <p className="text-gray-500 col-span-3 text-center py-8">No books in the library catalog.</p> : (
            books.map((book) => (
              <div key={book.id} className="border border-gray-100 rounded-xl p-4 flex gap-4 hover:shadow-md transition">
                <div className="bg-indigo-50 p-4 rounded-lg text-indigo-500 flex items-center justify-center">
                  <Book size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">ISBN: {book.isbn || 'N/A'}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${book.available_copies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {book.available_copies} Available
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
