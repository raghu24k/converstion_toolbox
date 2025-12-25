import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Instagram, Mail } from 'lucide-react';
import Hero from './components/Hero';
import UploadZone from './components/UploadZone';
import MergeZone from './components/MergeZone';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [activeTab, setActiveTab] = useState('convert');
  return (
    <Router>
      <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-gray-950">
        <nav className="bg-white dark:bg-gray-900 shadow-sm z-10 transition-colors duration-300">
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
                <ThemeToggle />
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
                  <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
                      <button
                        onClick={() => setActiveTab('convert')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'convert'
                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                      >
                        Convert Files
                      </button>
                      <button
                        onClick={() => setActiveTab('merge')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'merge'
                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                      >
                        Merge PDFs
                      </button>
                    </div>
                  </div>

                  {activeTab === 'convert' ? <UploadZone /> : <MergeZone />}
                </div>
              </>
            } />
          </Routes>
        </main>

        <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-auto transition-colors duration-300">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © 2025 ToolBox. Created by <span className="font-semibold text-primary">Raghuwinder Kumar</span>. All rights reserved.
            </p>
          </div>
        </footer>
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
