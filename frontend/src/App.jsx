import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Instagram, Mail } from 'lucide-react';
import Hero from './components/Hero';
import UploadZone from './components/UploadZone';
import MergeZone from './components/MergeZone';
import CropTool from './components/CropTool';
import RemoveBgTool from './components/RemoveBgTool';
import ImageToIcon from './components/ImageToIcon';
import ThemeToggle from './components/ThemeToggle';
import About from './pages/About';
import FAQ from './pages/FAQ';

function App() {
  const [activeTab, setActiveTab] = useState('convert');

  const tabs = [
    { id: 'convert', label: 'Convert' },
    { id: 'merge', label: 'Merge PDF' },
    { id: 'crop', label: 'Crop' },
    { id: 'removebg', label: 'Remove BG' },
    { id: 'icon', label: 'To Icon' },
  ];

  return (
    <Router>
      <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-gray-950">
        <nav className="bg-white dark:bg-gray-900 shadow-sm z-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-2xl font-bold text-primary">ToolBox</Link>
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium">
                    About
                  </Link>
                  <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium">
                    FAQ
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <a
                  href="mailto:raghuwinderkumar24k@gmail.com"
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors group"
                  title="raghuwinderkumar24k@gmail.com"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline text-sm font-medium group-hover:underline">Contact</span>
                </a>
                <a
                  href="https://www.instagram.com/raghuwinder17/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
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
                  {/* Tab Navigation */}
                  <div className="flex justify-center mb-8 overflow-x-auto">
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex gap-1">
                      {tabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'convert' && <UploadZone />}
                  {activeTab === 'merge' && <MergeZone />}
                  {activeTab === 'crop' && <CropTool />}
                  {activeTab === 'removebg' && <RemoveBgTool />}
                  {activeTab === 'icon' && <ImageToIcon />}
                </div>
              </>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>

        <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-auto transition-colors duration-300">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ToolBox</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Free online file converter. Convert PDF, Word, Excel, PowerPoint, and images instantly.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tools</h3>
                <ul className="space-y-2">
                  <li><button onClick={() => setActiveTab('convert')} className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm">File Converter</button></li>
                  <li><button onClick={() => setActiveTab('merge')} className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm">Merge PDFs</button></li>
                  <li><button onClick={() => setActiveTab('crop')} className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm">Crop Image</button></li>
                  <li><button onClick={() => setActiveTab('removebg')} className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm">Remove Background</button></li>
                  <li><button onClick={() => setActiveTab('icon')} className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm">Image to Icon</button></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm">Home</Link></li>
                  <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm">About</Link></li>
                  <li><Link to="/faq" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm">FAQ</Link></li>
                  <li>
                    <a href="mailto:raghuwinderkumar24k@gmail.com" className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t dark:border-gray-800 pt-6">
              <p className="text-center text-gray-500 text-sm">
                © 2025 ToolBox. Created by <span className="font-semibold text-primary">Raghuwinder Kumar</span>. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;
