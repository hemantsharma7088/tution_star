import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="glass fixed w-full z-50 top-0 left-0 rounded-none border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">EduStar</Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-gray-700 hover:text-primary-600 transition">About</a>
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition">Features</a>
            <a href="#events" className="text-gray-700 hover:text-primary-600 transition">Events</a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 transition">Contact</a>
            <Link to="/login" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow">Portal Login</Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass rounded-b-xl border-t-0 shadow-lg absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-primary-600">About</a>
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Features</a>
            <a href="#events" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Events</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Contact</a>
            <Link to="/login" className="block px-3 py-2 text-primary-600 font-bold">Portal Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
