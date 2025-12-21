import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import Hero from './components/Hero';
import UploadZone from './components/UploadZone';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary">ToolBox</span>
              </div>
              <div className="flex items-center space-x-6">
                <a
                  href="mailto:raghuwinderkumar24k@gmail.com"
                  className="flex items-center text-gray-600 hover:text-primary transition-colors group"
                  title="raghuwinderkumar24k@gmail.com"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline text-sm font-medium group-hover:underline">Contact</span>
                </a>
                <a
                  href="https://www.instagram.com/raghuwinder17/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-pink-600 transition-colors"
                  title="Follow on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <UploadZone />
                </div>
              </>
            } />
          </Routes>
        </main>

        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © 2025 ToolBox. Created by <span className="font-semibold text-primary">Raghuwinder Kumar</span>. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
