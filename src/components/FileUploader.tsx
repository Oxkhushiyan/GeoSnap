'use client';

import { ChangeEvent } from 'react';

interface FileUploaderProps {
  onFilesSelected: (files: FileList) => void;
  className?: string;
}

export default function FileUploader({ onFilesSelected, className = '' }: FileUploaderProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <label 
        htmlFor="file-upload"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
      >
        Upload Photos
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
