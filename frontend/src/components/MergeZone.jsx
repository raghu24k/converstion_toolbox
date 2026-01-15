import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Loader, Plus, X, GripVertical } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const MergeZone = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
            if (newFiles.length === 0) {
                setErrorMsg('Please select PDF files only.');
                return;
            }
            // Add unique IDs for reordering
            const filesWithIds = newFiles.map((f, index) => ({
                id: `${f.name}-${Date.now()}-${index}`,
                file: f
            }));
            setFiles(prev => [...prev, ...filesWithIds]);
            setStatus('idle');
            setErrorMsg('');
        }
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(item => item.id !== id));
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setErrorMsg('Please select at least 2 PDF files to merge.');
            return;
        }

        setStatus('uploading');
        setUploadProgress(0);
        const formData = new FormData();
        files.forEach(item => {
            formData.append('files', item.file);
        });

        try {
            const safeUrl = 'https://converstion-toolbox.onrender.com/api/tools/merge';

            const response = await axios.post(safeUrl, formData, {
                responseType: 'blob',
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(Math.min(percentCompleted, 95));
                },
            });

            setUploadProgress(100);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadUrl(url);
            setStatus('success');
        } catch (error) {
            console.error('Merge failed', error);
            setStatus('error');
            setErrorMsg('Merge failed. Please try again.');
            setUploadProgress(0);
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
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Selected Files ({files.length}):
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Drag to reorder
                        </p>
                    </div>

                    <Reorder.Group
                        axis="y"
                        values={files}
                        onReorder={setFiles}
                        className="bg-gray-50 dark:bg-gray-900 rounded-md p-2 space-y-2 max-h-60 overflow-y-auto"
                    >
                        {files.map((item, index) => (
                            <Reorder.Item
                                key={item.id}
                                value={item}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing"
                                whileDrag={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                            >
                                <div className="flex items-center truncate">
                                    <GripVertical className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                    <span className="text-xs text-gray-400 mr-2 w-6">{index + 1}.</span>
                                    <File className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                                        {item.file.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeFile(item.id)}
                                    className="text-gray-400 hover:text-red-500 ml-2"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

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
                <div className="mt-4 space-y-3">
                    <div className="flex justify-center items-center text-primary">
                        <Loader className="animate-spin h-5 w-5 mr-2" />
                        <span>Merging PDFs... {uploadProgress}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        {uploadProgress < 50 ? 'Uploading files...' : uploadProgress < 95 ? 'Merging documents...' : 'Finalizing...'}
                    </p>
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
                            setUploadProgress(0);
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
