import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, Download, RotateCcw, Image as ImageIcon, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to center the crop initially
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

const CropTool = () => {
    const [imgSrc, setImgSrc] = useState('');
    const [imageName, setImageName] = useState('');
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [aspect, setAspect] = useState(undefined); // undefined = free form
    const [imageRef, setImageRef] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);

    const aspectRatios = [
        { label: 'Free', value: undefined },
        { label: 'Square (1:1)', value: 1 },
        { label: '16:9', value: 16 / 9 },
        { label: '4:3', value: 4 / 3 },
        { label: 'Portrait (9:16)', value: 9 / 16 },
    ];

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Reset crop
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
            setImageName(e.target.files[0].name);
            setDownloadUrl(null);
        }
    }

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        setImageRef(e.currentTarget);
        // Default to a centered free-form crop
        setCrop(centerAspectCrop(width, height, 16 / 9));
    }

    // Generate the cropped image
    useEffect(() => {
        if (!completedCrop || !imageRef) {
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scaleX = imageRef.naturalWidth / imageRef.width;
        const scaleY = imageRef.naturalHeight / imageRef.height;

        const pixelRatio = window.devicePixelRatio;

        canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
        canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        ctx.drawImage(
            imageRef,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            Math.floor(completedCrop.width * scaleX),
            Math.floor(completedCrop.height * scaleY),
        );

        canvas.toBlob((blob) => {
            if (!blob) return;
            setDownloadUrl(URL.createObjectURL(blob));
        }, 'image/png');

    }, [completedCrop]);

    const handleDownload = () => {
        if (downloadUrl) {
            const link = document.createElement('a');
            link.download = `cropped-${imageName}`;
            link.href = downloadUrl;
            link.click();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Crop Image
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Upload images and resize them freely or use preset ratios
            </p>

            {!imgSrc ? (
                <div className="flex justify-center px-6 pt-10 pb-10 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-primary transition-colors bg-white dark:bg-gray-800">
                    <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                            <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-indigo-500 text-lg">
                                <span>Click to Upload Image</span>
                                <input type="file" className="sr-only" accept="image/*" onChange={onSelectFile} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-800">
                        {aspectRatios.map((ratio) => (
                            <button
                                key={ratio.label}
                                onClick={() => setAspect(ratio.value)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${aspect === ratio.value
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {ratio.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Editor Area */}
                        <div className="lg:col-span-2 bg-gray-900/5 dark:bg-black/20 rounded-xl p-4 flex items-center justify-center min-h-[400px]">
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                                className="max-h-[60vh]"
                            >
                                <img
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    alt="Crop me"
                                    className="max-w-full max-h-[60vh] object-contain rounded-sm"
                                />
                            </ReactCrop>
                        </div>

                        {/* Preview and Actions */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Preview Result
                                </h3>

                                {downloadUrl ? (
                                    <div className="bg-[url('https://www.transparenttextures.com/patterns/checkerboard-cross-gray.png')] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square flex items-center justify-center relative">
                                        <img src={downloadUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg aspect-square flex items-center justify-center text-gray-400 text-sm">
                                        Adjustment needed
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDownload}
                                    disabled={!completedCrop?.width || !completedCrop?.height}
                                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Cut
                                </motion.button>
                            </div>

                            <button
                                onClick={() => { setImgSrc(''); setDownloadUrl(null); }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Start Over
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropTool;
