import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Zap, Globe, Github, Instagram, Mail, Code, User, MapPin } from 'lucide-react';


const About = () => {
    const features = [
        {
            icon: <FileText className="w-8 h-8 text-primary" />,
            title: "Multiple Formats",
            description: "Convert between PDF, Word, Excel, PowerPoint, and image formats with ease."
        },
        {
            icon: <Zap className="w-8 h-8 text-primary" />,
            title: "Fast Conversion",
            description: "Our optimized servers ensure quick file processing without compromising quality."
        },
        {
            icon: <Shield className="w-8 h-8 text-primary" />,
            title: "Secure & Private",
            description: "Your files are automatically deleted after conversion. We never store your data."
        },
        {
            icon: <Globe className="w-8 h-8 text-primary" />,
            title: "Free & Online",
            description: "No software installation required. Access from any device, anywhere in the world."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        About ToolBox
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        ToolBox is a free online file conversion platform designed to make document
                        transformation simple and accessible. Whether you need to convert a PDF to Word,
                        merge multiple PDFs, or transform images, we've got you covered.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        Why Choose ToolBox?
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Supported Conversions
                    </h2>

                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-12">
                        <li>PDF to Word (DOCX)</li>
                        <li>PDF to PowerPoint (PPTX)</li>
                        <li>PDF to Excel (XLSX)</li>
                        <li>PDF to Images (JPG, PNG)</li>
                        <li>Word to PDF</li>
                        <li>Excel to PDF</li>
                        <li>PowerPoint to PDF</li>
                        <li>Image to PDF</li>
                        <li>Merge Multiple PDFs</li>
                        <li>Crop Images</li>
                        <li>Remove Background (AI)</li>
                        <li>Generate Icons</li>
                    </ul>

                    {/* Developer Section */}
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                            {/* Profile Image / Initials */}
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shrink-0">
                                RK
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Raghuwinder Kumar
                                </h2>
                                <p className="text-primary font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                                    <Code className="w-4 h-4" /> Full Stack Developer
                                </p>

                                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    Hi! I'm a passionate developer who loves building useful web applications that solve real-world problems.
                                    I built ToolBox to provide a simple, privacy-focused alternative to cluttered file conversion sites.
                                    My expertise lies in modern web technologies including Python, React.
                                </p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <a
                                        href="https://github.com/raghu24k"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        <Github className="w-4 h-4" /> GitHub
                                    </a>
                                    <a
                                        href="https://www.instagram.com/raghuwinder17/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                                    >
                                        <Instagram className="w-4 h-4" /> Instagram
                                    </a>
                                    <a
                                        href="mailto:raghuwinderkumar24k@gmail.com"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Mail className="w-4 h-4" /> Email Me
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
