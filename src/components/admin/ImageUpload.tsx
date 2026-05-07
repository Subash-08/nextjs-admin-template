'use client';

import React, { useState, useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

interface ImageUploadProps {
    value?: any; // Can be single object or array depending on mode, but simplified here
    onChange: (value: any) => void;
    disabled?: boolean;
    multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled,
    multiple = false
}) => {
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = useCallback((result: any) => {
        // result.info contains secure_url, width, height, bytes, format, etc.
        const imageData = {
            url: result.info.secure_url,
            width: result.info.width,
            height: result.info.height,
            aspectRatio: (result.info.width / result.info.height).toFixed(2),
            fileSize: result.info.bytes,
            alt: result.info.original_filename || 'Image',
        };

        if (multiple) {
            // If multiple, value should be an array. Append new image.
            const currentImages = Array.isArray(value) ? value : [];
            onChange([...currentImages, imageData]);
        } else {
            onChange(imageData);
        }
    }, [onChange, multiple, value]);

    const onRemove = (urlToRemove: string) => {
        if (multiple && Array.isArray(value)) {
            onChange(value.filter((current) => current.url !== urlToRemove));
        } else {
            onChange(null);
        }
    }

    if (!isMounted) {
        return null;
    }

    // Helper to render image preview
    const renderPreview = (img: any, index?: number) => (
        <div key={img.url} className="relative rounded-md overflow-hidden bg-gray-100 border border-gray-200 group">
            <div className="relative h-40 w-full">
                <Image fill style={{ objectFit: 'contain' }} src={img.url} alt="Upload" />
            </div>
            <div className="absolute top-2 right-2 z-10">
                <button
                    type="button"
                    onClick={() => onRemove(img.url)}
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="p-2 text-xs text-gray-500 bg-white">
                <p>Res: {img.width} x {img.height}</p>
                <p>Aspect: {img.aspectRatio}</p>
                <p>Size: {(img.fileSize / 1024).toFixed(1)} KB</p>
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-4 flex flex-wrap gap-4">
                {multiple && Array.isArray(value) && value.map((img, i) => renderPreview(img, i))}
                {!multiple && value && renderPreview(value)}
            </div>

            <CldUploadWidget
                onSuccess={onUpload}
                onError={(err, { widget }) => {
                    console.error('Cloudinary Upload Error:', err);
                    alert(`Upload Failed: ${err?.statusText || err?.message || 'Check console for details'}`);
                }}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                    maxFiles: multiple ? 10 : 1,
                    sources: ['local', 'url'],
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }
                    return (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={onClick}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            Upload Image{multiple ? 's' : ''}
                        </button>
                    )
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;
