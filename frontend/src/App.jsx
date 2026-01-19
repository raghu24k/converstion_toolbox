import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Instagram, Mail, FileOutput, Files, Scissors, Eraser, Image as ImageIcon, ArrowLeft, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import UploadZone from './components/UploadZone';
import MergeZone from './components/MergeZone';
import CropTool from './components/CropTool';
import RemoveBgTool from './components/RemoveBgTool';
import ImageToIcon from './components/ImageToIcon';
import ThemeToggle from './components/ThemeToggle';
import About from './pages/About';
import FAQ from './pages/FAQ';

const tools = [
  {
    id: 'convert',
    title: 'File Converter',
    description: 'Convert PDF, Word, Excel, and Images to other formats.',
    icon: <FileOutput className="w-8 h-8 text-blue-500" />,
    colors: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
    component: <UploadZone />
  },
  {
    id: 'merge',
    title: 'Merge PDFs',
    description: 'Combine multiple PDF files into a single document.',
    icon: <Files className="w-8 h-8 text-purple-500" />,
    colors: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800',
    component: <MergeZone />
  },
  {
    id: 'crop',
    title: 'Crop Image',
    description: 'Trim and resize your images to the perfect dimensions.',
    icon: <Scissors className="w-8 h-8 text-green-500" />,
    colors: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
    component: <CropTool />
  },
  {
    id: 'removebg',
    title: 'Remove Background',
    description: 'Automatically remove usage backgrounds with AI.',
    icon: <Eraser className="w-8 h-8 text-red-500" />,
    colors: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800',
    component: <RemoveBgTool />
  },
  {
    id: 'icon',
    title: 'Image to Icon',
    description: 'Generate app icons and favicons from any image.',
    icon: <ImageIcon className="w-8 h-8 text-yellow-500" />,
    colors: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800',
    component: <ImageToIcon />
  }
];

const ToolPage = () => {
  const { toolId } = useParams();
  const currentTool = tools.find(t => t.id === toolId);

  // If tool not found, redirect or show error
  if (!currentTool) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Tool not found</h2>
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50/50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {currentTool.icon}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTool.title}
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-14">
              {currentTool.description}
            </p>
          </div>
          <div className="p-8 bg-gray-50/30 dark:bg-gray-900/30">
            {currentTool.component}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-gray-950 font-sans">

        {/* Navbar */}
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link
                  to="/"
                  className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent cursor-pointer"
                >
                  ToolBox
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                  <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium">
                    About
                  </Link>
                  <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium">
                    FAQ
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:raghuwinderkumar24k@gmail.com"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Contact"
                >
                  <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </a>
                <a
                  href="https://github.com/raghu24k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="h-5 w-5 text-gray-600 dark:text-gray-300" />
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="tools">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      All-in-One Online PDF & Image Tools
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      Make use of our collection of free online PDF tools to convert, merge, edit, and more.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                      <Link
                        to={`/tool/${tool.id}`}
                        key={tool.id}
                      >
                        <motion.div
                          whileHover={{ y: -5 }}
                          className={`relative group p-6 rounded-2xl border ${tool.colors} bg-opacity-50 dark:bg-opacity-10 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:bg-white dark:hover:bg-gray-800 h-full`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                              {tool.icon}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {tool.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {tool.description}
                          </p>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            } />
            <Route path="/tool/:toolId" element={<ToolPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>

        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-1">
                <span className="text-xl font-bold text-primary mb-4 block">ToolBox</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The ultimate free online file conversion suite. Fast, secure, and easy to use.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <li><Link to="/" className="hover:text-primary">Home</Link></li>
                  <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                  <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Tools</h4>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <li><Link to="/tool/convert" className="hover:text-primary">Converter</Link></li>
                  <li><Link to="/tool/merge" className="hover:text-primary">Merge PDF</Link></li>
                  <li><Link to="/tool/removebg" className="hover:text-primary">Remove BG</Link></li>
                  <li><Link to="/tool/crop" className="hover:text-primary">Crop Image</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} ToolBox. Created by <span className="font-bold text-purple-600 dark:text-purple-400">Raghuwinder Kumar</span>. All rights reserved.
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
