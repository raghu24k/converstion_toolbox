import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UploadZone = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMsg, setErrorMsg] = useState('');
    const [targetFormat, setTargetFormat] = useState('pdf');
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [downloadName, setDownloadName] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setStatus('idle');
            setErrorMsg('');

            const ext = f.name.split('.').pop().toLowerCase();
            if (ext === 'pdf') {
                setTargetFormat('docx');
            } else {
                setTargetFormat('pdf');
            }
        }
    };

    const handleConvert = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetFormat', targetFormat);

        try {
            // Use window.location.hostname to allows access from other devices (e.g. phone)
            // This assumes backend is running on port 8080 on the same machine
            const apiUrl = `http://${window.location.hostname}:8080/api/convert`;

            const response = await axios.post(apiUrl, formData, {
                responseType: 'blob', // Important for file download
            });

            // Create download link
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadUrl(url);
            setDownloadName(`converted-${file.name.split('.')[0]}.${targetFormat}`);
            setStatus('success');
        } catch (error) {
            console.error('Conversion failed', error);
            setStatus('error');
            setErrorMsg('Conversion failed. Please try again.');
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary transition-colors bg-white">
                <div className="space-y-1 text-center">
                    {file ? (
                        <div className="flex flex-col items-center">
                            <File className="mx-auto h-12 w-12 text-primary" />
                            <p className="mt-2 text-sm text-gray-600">{file.name}</p>
                            <button
                                onClick={() => setFile(null)}
                                className="mt-2 text-xs text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">Support for PDF, DOCX, XLSX, PPTX, JPG, PNG</p>
                        </>
                    )}
                </div>
            </div>

            {file && status !== 'uploading' && status !== 'success' && (
                <div className="mt-4 space-y-4">
                    {(() => {
                        const extension = file.name.split('.').pop().toLowerCase();
                        let options = [];

                        if (extension === 'pdf') {
                            options = [
                                { value: 'docx', label: 'Word Document (.docx)' },
                                { value: 'pptx', label: 'PowerPoint Presentation (.pptx)' },
                                { value: 'xlsx', label: 'Excel Spreadsheet (.xlsx)' },
                                { value: 'jpg', label: 'JPEG Image (.jpg)' },
                                { value: 'png', label: 'PNG Image (.png)' },
                                { value: 'txt', label: 'Text File (.txt)' }
                            ];
                        } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
                            // Determine alternate image format
                            const isPng = extension === 'png';
                            const altImgVal = isPng ? 'jpg' : 'png';
                            const altImgLabel = isPng ? 'JPEG Image (.jpg)' : 'PNG Image (.png)';

                            options = [
                                { value: 'pdf', label: 'PDF Document (.pdf)' },
                                { value: 'docx', label: 'Word Document (.docx)' },
                                { value: 'pptx', label: 'PowerPoint Presentation (.pptx)' },
                                { value: altImgVal, label: altImgLabel }
                            ];
                        } else if (['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(extension)) {
                            options = [{ value: 'pdf', label: 'PDF Document (.pdf)' }];
                        }

                        return (
                            <div>
                                <label htmlFor="format" className="block text-sm font-medium text-gray-700">Convert to:</label>
                                <select
                                    id="format"
                                    name="format"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                    value={targetFormat}
                                    onChange={(e) => setTargetFormat(e.target.value)}
                                >
                                    {options.length > 0 ? (
                                        options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No conversions available</option>
                                    )}
                                </select>
                            </div>
                        );
                    })()}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConvert}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Convert Now
                    </motion.button>
                </div>
            )}

            {status === 'uploading' && (
                <div className="mt-4 flex justify-center items-center text-primary">
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    <span>Converting...</span>
                </div>
            )}

            {status === 'success' && (
                <div className="mt-4 flex flex-col items-center">
                    <div className="flex items-center text-green-600 mb-3">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Conversion successful!</span>
                    </div>

                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            download={downloadName}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-2"
                        >
                            Download Converted File
                        </a>
                    )}

                    <button
                        onClick={() => {
                            setFile(null);
                            setStatus('idle');
                            setDownloadUrl(null);
                        }}
                        className="text-sm text-gray-500 underline hover:text-gray-700"
                    >
                        Convert another file
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

export default UploadZone;
