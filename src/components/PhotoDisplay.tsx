'use client';

import Image from 'next/image';
import { useState } from 'react';

interface PhotoDisplayProps {
  photo: {
    url: string;
    name: string;
    location?: {
      lat: number;
      lng: number;
    };
  } | null;
  onClose: () => void;
  className?: string;
}

export default function PhotoDisplay({ photo, onClose, className = '' }: PhotoDisplayProps) {
  if (!photo) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{photo.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="relative aspect-video">
          <Image
            src={photo.url}
            alt={photo.name}
            fill
            className="object-contain rounded"
          />
        </div>
        {photo.location && (
          <p className="mt-2 text-sm text-gray-600">
            Location: {photo.location.lat.toFixed(6)}, {photo.location.lng.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  );
}
