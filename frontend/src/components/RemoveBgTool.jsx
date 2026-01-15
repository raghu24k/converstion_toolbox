import React, { useState, useRef } from 'react';
import { Upload, Download, Loader, Eraser } from 'lucide-react';
import { motion } from 'framer-motion';

const RemoveBgTool = () => {
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            setImageName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
                setProcessedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeBackground = async () => {
        if (!image) return;

        setIsProcessing(true);

        // Client-side background removal using canvas
        // This is a simple implementation using color-based removal
        // For production, consider using an API like remove.bg

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Get background color from corners (assuming background is uniform)
            const corners = [
                { x: 0, y: 0 },
                { x: canvas.width - 1, y: 0 },
                { x: 0, y: canvas.height - 1 },
                { x: canvas.width - 1, y: canvas.height - 1 }
            ];

            let bgR = 0, bgG = 0, bgB = 0;
            corners.forEach(corner => {
                const idx = (corner.y * canvas.width + corner.x) * 4;
                bgR += data[idx];
                bgG += data[idx + 1];
                bgB += data[idx + 2];
            });
            bgR = Math.round(bgR / 4);
            bgG = Math.round(bgG / 4);
            bgB = Math.round(bgB / 4);

            // Threshold for considering a pixel as background
            const threshold = 60;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Calculate color distance from background
                const distance = Math.sqrt(
                    Math.pow(r - bgR, 2) +
                    Math.pow(g - bgG, 2) +
                    Math.pow(b - bgB, 2)
                );

                // If color is similar to background, make transparent
                if (distance < threshold) {
                    data[i + 3] = 0; // Set alpha to 0
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setProcessedImage(canvas.toDataURL('image/png'));
            setIsProcessing(false);
        };
        img.src = image;
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
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Upload an image to automatically remove its background
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
                        <p className="text-xs text-gray-400 mt-2">Best results with solid color backgrounds</p>
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
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Click "Remove Background" to process
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        {!processedImage && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={removeBackground}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Eraser className="w-4 h-4" />
                                        Remove Background
                                    </>
                                )}
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
                        onClick={() => { setImage(null); setProcessedImage(null); }}
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
