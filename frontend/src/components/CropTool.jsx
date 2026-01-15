import React, { useState, useRef, useCallback } from 'react';
import { Upload, Crop, Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';

const CropTool = () => {
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 200, height: 200 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [croppedImage, setCroppedImage] = useState(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null);

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
                setCroppedImage(null);
                setCropArea({ x: 50, y: 50, width: 200, height: 200 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = (e, type) => {
        e.preventDefault();
        if (type === 'move') {
            setIsDragging(true);
        } else {
            setIsResizing(type);
        }
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging && !isResizing) return;

        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;

        if (isDragging) {
            setCropArea(prev => ({
                ...prev,
                x: Math.max(0, prev.x + dx),
                y: Math.max(0, prev.y + dy)
            }));
        } else if (isResizing) {
            setCropArea(prev => {
                let newWidth = prev.width;
                let newHeight = prev.height;
                let newX = prev.x;
                let newY = prev.y;

                if (isResizing.includes('e')) newWidth = Math.max(50, prev.width + dx);
                if (isResizing.includes('s')) newHeight = Math.max(50, prev.height + dy);
                if (isResizing.includes('w')) {
                    newWidth = Math.max(50, prev.width - dx);
                    newX = prev.x + dx;
                }
                if (isResizing.includes('n')) {
                    newHeight = Math.max(50, prev.height - dy);
                    newY = prev.y + dy;
                }

                return { x: newX, y: newY, width: newWidth, height: newHeight };
            });
        }

        setDragStart({ x: e.clientX, y: e.clientY });
    }, [isDragging, isResizing, dragStart]);

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const performCrop = () => {
        if (!imageRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = imageRef.current;

        // Calculate scale between displayed image and actual image
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        canvas.width = cropArea.width * scaleX;
        canvas.height = cropArea.height * scaleY;

        ctx.drawImage(
            img,
            cropArea.x * scaleX,
            cropArea.y * scaleY,
            cropArea.width * scaleX,
            cropArea.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        setCroppedImage(canvas.toDataURL('image/png'));
    };

    const downloadCropped = () => {
        if (!croppedImage) return;
        const link = document.createElement('a');
        link.download = `cropped-${imageName}`;
        link.href = croppedImage;
        link.click();
    };

    const resetCrop = () => {
        setCropArea({ x: 50, y: 50, width: 200, height: 200 });
        setCroppedImage(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Crop Image
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Upload an image and drag to select the area you want to crop
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
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div
                        ref={containerRef}
                        className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden inline-block"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <img
                            ref={imageRef}
                            src={image}
                            alt="To crop"
                            className="max-w-full max-h-96"
                            draggable={false}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

                        {/* Crop Area */}
                        <div
                            className="absolute border-2 border-white cursor-move"
                            style={{
                                left: cropArea.x,
                                top: cropArea.y,
                                width: cropArea.width,
                                height: cropArea.height,
                                boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'move')}
                        >
                            {/* Clear inside */}
                            <div className="absolute inset-0 bg-transparent" />

                            {/* Resize handles */}
                            {['nw', 'ne', 'sw', 'se'].map((pos) => (
                                <div
                                    key={pos}
                                    className={`absolute w-3 h-3 bg-white border border-gray-400 cursor-${pos}-resize`}
                                    style={{
                                        top: pos.includes('n') ? -6 : 'auto',
                                        bottom: pos.includes('s') ? -6 : 'auto',
                                        left: pos.includes('w') ? -6 : 'auto',
                                        right: pos.includes('e') ? -6 : 'auto',
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, pos)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={performCrop}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700"
                        >
                            <Crop className="w-4 h-4" />
                            Crop
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetCrop}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </motion.button>
                    </div>

                    {croppedImage && (
                        <div className="mt-6 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Preview:</h3>
                            <img src={croppedImage} alt="Cropped" className="mx-auto max-h-64 rounded border border-gray-300" />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={downloadCropped}
                                className="mt-4 flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mx-auto"
                            >
                                <Download className="w-4 h-4" />
                                Download Cropped Image
                            </motion.button>
                        </div>
                    )}

                    <button
                        onClick={() => { setImage(null); setCroppedImage(null); }}
                        className="block mx-auto text-sm text-gray-500 underline"
                    >
                        Upload different image
                    </button>
                </div>
            )}
        </div>
    );
};

export default CropTool;
