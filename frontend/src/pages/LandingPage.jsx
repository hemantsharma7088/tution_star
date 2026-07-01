import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: <BookOpen className="text-primary-600 w-8 h-8" />, title: 'Advanced Curriculum', desc: 'Holistic approach to education.' },
  { icon: <Users className="text-primary-600 w-8 h-8" />, title: 'Expert Faculty', desc: 'Highly qualified and experienced teachers.' },
  { icon: <Calendar className="text-primary-600 w-8 h-8" />, title: 'Event Management', desc: 'Active participation in sports & events.' },
  { icon: <Award className="text-primary-600 w-8 h-8" />, title: 'Excellence Awards', desc: 'Recognizing student achievements.' },
];

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center justify-center min-h-[90vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Welcome to <span className="text-primary-600">EduStar</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Empowering the next generation with modern education, state-of-the-art facilities, and a seamless digital experience.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex justify-center gap-4"
          >
            <a href="#admissions" className="bg-primary-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all font-semibold text-lg">Apply Now</a>
            <a href="#about" className="bg-white text-primary-600 border border-gray-200 px-8 py-3 rounded-xl shadow hover:shadow-md transition-all font-semibold text-lg">Learn More</a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">We provide a nurturing environment that fosters academic excellence and personal growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={idx} 
                className="glass p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold mb-2">2500+</div>
              <div className="text-primary-200 font-medium text-lg">Students Enrolled</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">150+</div>
              <div className="text-primary-200 font-medium text-lg">Expert Teachers</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">50+</div>
              <div className="text-primary-200 font-medium text-lg">Classrooms</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">100%</div>
              <div className="text-primary-200 font-medium text-lg">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
