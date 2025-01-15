import EXIF from 'exif-js';

export interface PhotoData {
  url: string;
  name: string;
  location?: {
    lat: number;
    lng: number;
  };
}

function convertDMSToDD(degrees: number, minutes: number, seconds: number, direction: string) {
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') {
    dd = dd * -1;
  }
  return dd;
}

export async function extractPhotoData(file: File): Promise<PhotoData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      if (!e.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }

      const image = new Image();
      image.src = e.target.result as string;

      image.onload = function() {
        EXIF.getData(image as any, function(this: any) {
          const exifData = EXIF.getAllTags(this);
          
          let location;
          if (exifData.GPSLatitude && exifData.GPSLongitude) {
            const lat = convertDMSToDD(
              exifData.GPSLatitude[0],
              exifData.GPSLatitude[1],
              exifData.GPSLatitude[2],
              exifData.GPSLatitudeRef
            );
            
            const lng = convertDMSToDD(
              exifData.GPSLongitude[0],
              exifData.GPSLongitude[1],
              exifData.GPSLongitude[2],
              exifData.GPSLongitudeRef
            );

            location = { lat, lng };
          }

          resolve({
            url: e.target.result as string,
            name: file.name,
            location,
          });
        });
      };
    };

    reader.readAsDataURL(file);
  });
}
