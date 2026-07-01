import React from 'react';

const Footer = () => (
  <footer className="bg-slate-900 text-white pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-primary-500 mb-4">EduStar</h3>
          <p className="text-gray-400">Empowering the next generation through holistic education and modern technology.</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#about" className="hover:text-primary-400 transition">About Us</a></li>
            <li><a href="#admissions" className="hover:text-primary-400 transition">Admissions</a></li>
            <li><a href="#academics" className="hover:text-primary-400 transition">Academics</a></li>
            <li><a href="#careers" className="hover:text-primary-400 transition">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-gray-400">
            <li>123 Education Lane, Tech City, 50001</li>
            <li>Phone: +1 234 567 8900</li>
            <li>Email: info@edustar.edu</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Newsletter</h4>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for latest updates.</p>
          <div className="flex">
            <input type="email" placeholder="Your Email" className="px-4 py-2 w-full rounded-l-lg text-gray-900 outline-none" />
            <button className="bg-primary-600 px-4 py-2 rounded-r-lg hover:bg-primary-700 transition">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} EduStar School Management. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
