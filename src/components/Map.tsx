'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PhotoData } from '@/lib/photoUtils';

interface MapProps {
  photos: PhotoData[];
  onPhotoSelect: (photo: PhotoData) => void;
  className?: string;
}

export default function Map({ photos, onPhotoSelect, className = '' }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when photos change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    photos.forEach(photo => {
      if (photo.location) {
        const marker = L.marker([photo.location.lat, photo.location.lng])
          .addTo(mapRef.current!)
          .on('click', () => onPhotoSelect(photo));
        
        markersRef.current.push(marker);
      }
    });

    // Fit bounds if there are markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [photos, onPhotoSelect]);

  return <div ref={mapContainerRef} className={`h-full w-full ${className}`} />;
}
