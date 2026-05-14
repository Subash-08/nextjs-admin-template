'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import type { IContentBlock } from '@/types/blog';

interface Props {
  block: IContentBlock;
  onUpdate: (updates: Partial<IContentBlock>) => void;
}

export default function ImageBlock({ block, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onUpdate({
          imageUrl: result.data.url,
          imagePublicId: result.data.publicId,
          imageWidth: result.data.width,
          imageHeight: result.data.height,
        });
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Image</div>

      {block.imageUrl ? (
        <div className="relative border border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="relative h-48 w-full mb-3 bg-gray-200 rounded overflow-hidden">
            <Image src={block.imageUrl} alt={block.imageAlt || ''} fill className="object-contain" />
            <button
              onClick={() => onUpdate({ imageUrl: undefined })}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm transition-colors"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={block.imageAlt || ''}
              onChange={(e) => onUpdate({ imageAlt: e.target.value })}
              placeholder="Alt text (required for SEO)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            <input
              type="text"
              value={block.imageCaption || ''}
              onChange={(e) => onUpdate({ imageCaption: e.target.value })}
              placeholder="Caption (optional)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Click to upload image</span>
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          {uploading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <span className="text-blue-600 font-medium text-sm flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></span>
                Uploading...
              </span>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
