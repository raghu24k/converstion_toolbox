import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Zap, Globe } from 'lucide-react';

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

                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-8">
                        <li>PDF to Word (DOCX)</li>
                        <li>PDF to PowerPoint (PPTX)</li>
                        <li>PDF to Excel (XLSX)</li>
                        <li>PDF to Images (JPG, PNG)</li>
                        <li>Word to PDF</li>
                        <li>Excel to PDF</li>
                        <li>PowerPoint to PDF</li>
                        <li>Image to PDF</li>
                        <li>Merge Multiple PDFs</li>
                        <li>Image Format Conversion (JPG ↔ PNG)</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        About the Developer
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300">
                        ToolBox is created by <span className="font-semibold text-primary">Raghuwinder Kumar</span>,
                        a passionate developer focused on building useful web applications.
                        This project showcases full-stack development skills using React,
                        Java Spring Boot, and modern cloud deployment practices.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
