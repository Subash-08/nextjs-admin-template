'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';

interface ResponsiveImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    aspectRatio?: string; // e.g., "16:9", "4:5"
    className?: string;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
    quality?: number;
}

export default function ResponsiveImage({
    src,
    alt,
    width,
    height,
    aspectRatio,
    className = '',
    priority = false,
    fill = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quality = 90,
}: ResponsiveImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    // Handle Cloudinary IDs vs Full URLs
    const isCloudinary = src && !src.startsWith('http') && !src.startsWith('/');

    // Calculate specific aspect ratio styles if provided and not filling
    const style = aspectRatio && !fill ? { aspectRatio } : undefined;

    const commonClasses = `transition-all duration-500 ${isLoading ? 'scale-[1.02] blur-xl grayscale' : 'scale-100 blur-0 grayscale-0'
        } ${className}`;

    if (isCloudinary) {
        return (
            <div className={`overflow-hidden relative bg-gray-100 ${fill ? 'absolute inset-0 w-full h-full' : ''}`} style={style}>
                <CldImage
                    src={src}
                    alt={alt}
                    width={!fill ? width || 800 : undefined}
                    height={!fill ? height || 600 : undefined}
                    fill={fill}
                    className={`object-cover ${commonClasses}`}
                    priority={priority}
                    sizes={sizes}
                    quality={quality}
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        );
    }

    // Fallback for standard images (though we mostly use Cloudinary)
    return (
        <div className={`overflow-hidden relative bg-gray-100 ${fill ? 'absolute inset-0 w-full h-full' : ''}`} style={style}>
            <Image
                src={src || '/placeholder.jpg'}
                alt={alt}
                width={!fill ? width || 800 : undefined}
                height={!fill ? height || 600 : undefined}
                fill={fill}
                className={`object-cover ${commonClasses}`}
                priority={priority}
                sizes={sizes}
                quality={quality}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
