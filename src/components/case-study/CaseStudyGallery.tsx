import { IProject } from '@/models/Project';
import ResponsiveImage from '@/components/shared/ResponsiveImage';

export default function CaseStudyGallery({ images }: { images: IProject['galleryImages'] }) {
    if (!images || images.length === 0) return null;

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.map((img, index) => (
                <div key={index} className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="relative w-full">
                        {/* 
                           Note: For true masonry with Next.js Image, we often need known heights or use 'width: 100%, height: auto' style. 
                           Since we might not know aspect ratios, we'll use a wrapper but let the image determine height roughly or use standard aspect if preferred.
                           Here we try to respect natural aspect ratio if possible, or fallback to a standard cover.
                           For simplicity in this setup without external masonry libs, we'll standardise width but let height vary naturally if we had the data.
                           However, `ResponsiveImage` usually enforces fill. We will switch to a fixed aspect ratio wrapper BUT vary it slightly for visual interest or just use standard 4:3 for all 
                           to keep it robust unless we switch to `width={800} height={600}` approach.
                           Let's stick to a robust flexible grid for now but with better styling.
                        */}
                        <div className="aspect-[4/3] w-full relative">
                            <ResponsiveImage
                                src={img.url}
                                alt={img.alt || `Gallery image ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </div>
                    </div>

                    {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <p className="text-white text-sm font-medium">{img.caption}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
