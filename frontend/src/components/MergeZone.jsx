import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Loader, Plus, X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const MergeZone = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [downloadUrl, setDownloadUrl] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
            if (newFiles.length === 0) {
                setErrorMsg('Please select PDF files only.');
                return;
            }
            setFiles(prev => [...prev, ...newFiles]);
            setStatus('idle');
            setErrorMsg('');
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setErrorMsg('Please select at least 2 PDF files to merge.');
            return;
        }

        setStatus('uploading');
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://converstion-toolbox.onrender.com/api/tools/merge';
            // Fallback hardcoded for safety in this demo context
            const safeUrl = 'https://converstion-toolbox.onrender.com/api/tools/merge';

            const response = await axios.post(safeUrl, formData, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadUrl(url);
            setStatus('success');
        } catch (error) {
            console.error('Merge failed', error);
            setStatus('error');
            setErrorMsg('Merge failed. Please try again.');
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-primary transition-colors bg-white dark:bg-gray-800">
                <div className="space-y-1 text-center w-full">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <div className="flex justify-center text-sm text-gray-600">
                        <label
                            htmlFor="merge-upload"
                            className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-indigo-500 focus-within:outline-none"
                        >
                            <span>Select PDF Files</span>
                            <input id="merge-upload" name="files" type="file" multiple accept=".pdf" className="sr-only" onChange={handleFileChange} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Upload multiple PDFs to merge them</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files ({files.length}):</p>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-2 space-y-2 max-h-60 overflow-y-auto">
                        <AnimatePresence>
                            {files.map((file, index) => (
                                <motion.div
                                    key={`${file.name}-${index}`}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center truncate">
                                        <File className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">{file.name}</span>
                                    </div>
                                    <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500">
                                        <X className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {status !== 'uploading' && status !== 'success' && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleMerge}
                            className="w-full flex justify-center py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none"
                        >
                            Merge PDFs Now
                        </motion.button>
                    )}
                </div>
            )}

            {status === 'uploading' && (
                <div className="mt-4 flex justify-center items-center text-primary">
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    <span>Merging PDFs...</span>
                </div>
            )}

            {status === 'success' && downloadUrl && (
                <div className="mt-4 text-center">
                    <div className="flex items-center justify-center text-green-600 mb-3">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Merge successful!</span>
                    </div>
                    <a
                        href={downloadUrl}
                        download="merged_document.pdf"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                        Download Merged PDF
                    </a>
                    <button
                        onClick={() => {
                            setFiles([]);
                            setStatus('idle');
                            setDownloadUrl(null);
                        }}
                        className="mt-2 text-sm text-gray-500 dark:text-gray-400 underline"
                    >
                        Start Over
                    </button>
                </div>
            )}

            {status === 'error' && (
                <div className="mt-4 flex justify-center items-center text-red-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{errorMsg}</span>
                </div>
            )}
        </div>
    );
};

export default MergeZone;
