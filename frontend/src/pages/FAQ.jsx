import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "Is ToolBox completely free to use?",
            answer: "Yes! ToolBox is 100% free. There are no hidden charges, no subscription fees, and no limits on the number of conversions you can perform."
        },
        {
            question: "How do I convert a PDF to Word?",
            answer: "Simply go to the home page, click 'Upload a file', select your PDF document, choose 'Word Document (.docx)' as the target format, and click 'Convert Now'. Your converted file will be ready to download in seconds."
        },
        {
            question: "Are my files secure?",
            answer: "Absolutely. Your files are processed securely on our servers and are automatically deleted after conversion. We do not store, share, or access your documents for any other purpose."
        },
        {
            question: "What file formats are supported?",
            answer: "We support PDF, Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX), and images (JPG, JPEG, PNG). You can convert between these formats and also merge multiple PDF files."
        },
        {
            question: "How do I merge multiple PDF files?",
            answer: "Click on the 'Merge PDFs' tab on the home page. Then select multiple PDF files you want to combine. You can reorder them if needed, then click 'Merge PDFs Now' to download the combined document."
        },
        {
            question: "Is there a file size limit?",
            answer: "Currently, we support files up to 10MB. For larger files, we recommend splitting them into smaller parts before conversion."
        },
        {
            question: "Do I need to create an account?",
            answer: "No registration or account is required. Just visit the website and start converting your files immediately."
        },
        {
            question: "Can I use ToolBox on my mobile phone?",
            answer: "Yes! ToolBox is fully responsive and works on all devices including smartphones, tablets, laptops, and desktop computers."
        },
        {
            question: "Why is my conversion taking a long time?",
            answer: "The first conversion might take longer (up to 60 seconds) because our server needs to wake up from sleep mode. Subsequent conversions are much faster. Larger files with many pages also take more time to process."
        },
        {
            question: "What browsers are supported?",
            answer: "ToolBox works on all modern browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, and Opera."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Frequently Asked Questions
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Find answers to common questions about using ToolBox for your file conversions.
                    </p>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                                >
                                    <span className="font-medium text-gray-900 dark:text-white pr-4">
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 py-4 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-primary/10 dark:bg-primary/20 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Still have questions?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Feel free to reach out at{' '}
                            <a
                                href="mailto:raghuwinderkumar24k@gmail.com"
                                className="text-primary hover:underline"
                            >
                                raghuwinderkumar24k@gmail.com
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
