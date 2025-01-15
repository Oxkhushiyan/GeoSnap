'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import Map from '@/components/Map';
import PhotoDisplay from '@/components/PhotoDisplay';
import { extractPhotoData, type PhotoData } from '@/lib/photoUtils';

export default function Home() {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);

  const handleFilesSelected = async (files: FileList) => {
    const newPhotos: PhotoData[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const photoData = await extractPhotoData(files[i]);
        newPhotos.push(photoData);
      } catch (error) {
        console.error('Error processing photo:', files[i].name, error);
      }
    }

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">GeoSnap</h1>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <div className="w-full md:w-2/3 h-[50vh] md:h-auto relative">
          <Map 
            photos={photos}
            onPhotoSelect={setSelectedPhoto}
            className="rounded-lg shadow-lg" 
          />
        </div>
        
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-lg">
          <FileUploader onFilesSelected={handleFilesSelected} />
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Uploaded Photos</h2>
            <div className="space-y-2">
              {photos.map((photo, index) => (
                <div 
                  key={index}
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  {photo.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <PhotoDisplay 
        photo={selectedPhoto} 
        onClose={() => setSelectedPhoto(null)} 
      />
    </div>
  );
}
