export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const calculateSavings = (original, compressed) => {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
};

export const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/gif'
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const validateFile = (file) => {
  const errors = [];
  
  if (!ACCEPTED_TYPES.includes(file.type)) {
    errors.push(`"${file.name}" is not a supported image format`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`"${file.name}" exceeds 50MB limit`);
  }
  
  return errors;
};

export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

export const getFileNameWithoutExtension = (filename) => {
  return filename.replace(/\.[^/.]+$/, '');
};
