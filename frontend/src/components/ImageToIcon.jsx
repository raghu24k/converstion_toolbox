import React, { useState } from 'react';
import { Upload, Download, Loader, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageToIcon = () => {
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [icons, setIcons] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState([16, 32, 48, 64, 128, 256]);

    const availableSizes = [16, 24, 32, 48, 64, 128, 256, 512];

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
                setIcons([]);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size].sort((a, b) => a - b)
        );
    };

    const generateIcons = async () => {
        if (!image || selectedSizes.length === 0) return;

        setIsProcessing(true);
        setIcons([]);

        const img = new Image();
        img.onload = () => {
            const generatedIcons = selectedSizes.map(size => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = size;
                canvas.height = size;

                // Draw image scaled to icon size
                ctx.drawImage(img, 0, 0, size, size);

                return {
                    size,
                    dataUrl: canvas.toDataURL('image/png')
                };
            });

            setIcons(generatedIcons);
            setIsProcessing(false);
        };
        img.src = image;
    };

    const downloadIcon = (icon) => {
        const link = document.createElement('a');
        link.download = `icon-${icon.size}x${icon.size}.png`;
        link.href = icon.dataUrl;
        link.click();
    };

    const downloadAllAsZip = async () => {
        // For simplicity, download each individually
        // In production, use JSZip library
        icons.forEach((icon, index) => {
            setTimeout(() => downloadIcon(icon), index * 200);
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Image to Icon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Convert any image to icon sizes for apps, websites, and favicons
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
                        <p className="text-xs text-gray-500">PNG, JPG (square images work best)</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Preview */}
                    <div className="text-center">
                        <div className="inline-block bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                            <img src={image} alt="Source" className="max-h-32 mx-auto rounded" />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{imageName}</p>
                    </div>

                    {/* Size Selection */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                            Select icon sizes (pixels):
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {availableSizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => toggleSize(size)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${selectedSizes.includes(size)
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {size}x{size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    {icons.length === 0 && (
                        <div className="text-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={generateIcons}
                                disabled={isProcessing || selectedSizes.length === 0}
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 mx-auto"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-4 h-4" />
                                        Generate Icons
                                    </>
                                )}
                            </motion.button>
                        </div>
                    )}

                    {/* Generated Icons */}
                    {icons.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                                Generated Icons
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {icons.map(icon => (
                                    <div
                                        key={icon.size}
                                        className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <div
                                            className="flex items-center justify-center mb-2 p-2 rounded"
                                            style={{
                                                backgroundImage: 'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)',
                                                backgroundSize: '10px 10px',
                                                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                                            }}
                                        >
                                            <img
                                                src={icon.dataUrl}
                                                alt={`${icon.size}px`}
                                                style={{ width: Math.min(icon.size, 64), height: Math.min(icon.size, 64) }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                            {icon.size}x{icon.size}
                                        </p>
                                        <button
                                            onClick={() => downloadIcon(icon)}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={downloadAllAsZip}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mx-auto"
                                >
                                    <Download className="w-4 h-4" />
                                    Download All
                                </motion.button>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => { setImage(null); setIcons([]); }}
                        className="block mx-auto text-sm text-gray-500 underline"
                    >
                        Upload different image
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageToIcon;
