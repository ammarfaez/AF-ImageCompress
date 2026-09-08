import { useState, useCallback } from 'react';
import { validateFile } from '../utils/fileHelpers';

export const useFileDrop = (onFilesAdded) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const processFiles = useCallback((files) => {
    const fileList = Array.from(files);
    const allErrors = [];
    const validFiles = [];
    
    fileList.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        allErrors.push(...fileErrors);
      } else {
        validFiles.push(file);
      }
    });
    
    setErrors(allErrors);
    
    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }
    
    // Clear errors after 5 seconds
    if (allErrors.length > 0) {
      setTimeout(() => setErrors([]), 5000);
    }
  }, [onFilesAdded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    processFiles(files);
  }, [processFiles]);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    processFiles(files);
    e.target.value = '';
  }, [processFiles]);

  return {
    isDragOver,
    errors,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput
  };
};
