import React, { useState } from 'react';
import { Upload, Download, Loader, Eraser } from 'lucide-react';
import { motion } from 'framer-motion';
import { removeBackground } from '@imgly/background-removal';

const RemoveBgTool = () => {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageName, setImageName] = useState('');
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            setImageFile(file);
            setImageName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
                setProcessedImage(null);
                setProgress(0);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBackground = async () => {
        if (!imageFile) return;

        setIsProcessing(true);
        setProgress(0);
        setStatusText('Loading AI model...');

        try {
            const blob = await removeBackground(imageFile, {
                progress: (key, current, total) => {
                    const percent = Math.round((current / total) * 100);
                    setProgress(percent);

                    if (key === 'fetch:model') {
                        setStatusText('Downloading AI model (first time only)...');
                    } else if (key === 'compute:inference') {
                        setStatusText('Analyzing image...');
                    } else if (key === 'compute:mask') {
                        setStatusText('Creating mask...');
                    } else {
                        setStatusText('Processing...');
                    }
                }
            });

            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
            setStatusText('Done!');
        } catch (error) {
            console.error('Background removal failed:', error);
            alert('Background removal failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadImage = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.download = `nobg-${imageName.replace(/\.[^/.]+$/, '')}.png`;
        link.href = processedImage;
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Remove Background
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                AI-powered background removal - works with any image
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mb-6">
                First use may take longer as the AI model downloads (~30MB)
            </p>

            {!image ? (
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-primary transition-colors bg-white dark:bg-gray-800">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-indigo-500">
                                <span>Upload an image</span>
                                <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Original */}
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</h3>
                            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                                <img src={image} alt="Original" className="max-h-64 mx-auto rounded" />
                            </div>
                        </div>

                        {/* Processed */}
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result</h3>
                            <div
                                className="p-4 rounded-lg min-h-64 flex items-center justify-center"
                                style={{
                                    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                    backgroundSize: '20px 20px',
                                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                }}
                            >
                                {processedImage ? (
                                    <img src={processedImage} alt="Processed" className="max-h-64 mx-auto rounded" />
                                ) : isProcessing ? (
                                    <div className="text-center">
                                        <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{statusText}</p>
                                        <p className="text-xs text-gray-500 mt-1">{progress}%</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Click "Remove Background" to process
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {isProcessing && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    )}

                    <div className="flex justify-center gap-4">
                        {!processedImage && !isProcessing && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRemoveBackground}
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700"
                            >
                                <Eraser className="w-4 h-4" />
                                Remove Background
                            </motion.button>
                        )}

                        {processedImage && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={downloadImage}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                <Download className="w-4 h-4" />
                                Download PNG
                            </motion.button>
                        )}
                    </div>

                    <button
                        onClick={() => { setImage(null); setProcessedImage(null); setImageFile(null); }}
                        className="block mx-auto text-sm text-gray-500 underline"
                    >
                        Upload different image
                    </button>
                </div>
            )}
        </div>
    );
};

export default RemoveBgTool;
