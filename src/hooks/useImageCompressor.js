import { useState, useCallback, useEffect, useRef } from 'react';
import { compress } from 'compresso.js';
import { createPool } from 'compresso.js/pool';

export const useImageCompressor = () => {
  const [images, setImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const poolRef = useRef(null);

  useEffect(() => {
    poolRef.current = createPool();
    return () => {
      poolRef.current?.destroy();
    };
  }, []);

  const addImages = useCallback((files) => {
    const newImages = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      original: file,
      originalUrl: URL.createObjectURL(file),
      compressed: null,
      compressedUrl: null,
      originalSize: file.size,
      compressedSize: null,
      status: 'pending', // pending, compressing, done, error
      progress: 0,
      error: null
    }));
    
    setImages(prev => [...prev, ...newImages]);
    return newImages;
  }, []);

  const compressImage = useCallback(async (imageId, options) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, status: 'compressing', progress: 0 }
        : img
    ));

    try {
      const image = images.find(img => img.id === imageId);
      if (!image) throw new Error('Image not found');

      const result = await compress(image.original, {
        quality: options.quality / 100,
        maxWidth: options.maxWidth || 1920,
        format: options.format,
        onProgress: (event) => {
          if (event.stage === 'compressing' || event.stage === 'resizing') {
            setImages(prev => prev.map(img => 
              img.id === imageId 
                ? { ...img, progress: Math.round(event.progress * 100) }
                : img
            ));
          }
        }
      });

      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { 
              ...img, 
              compressed: result.file,
              compressedUrl: result.url,
              compressedSize: result.compressedSize,
              status: 'done',
              progress: 100
            }
          : img
      ));

      return result.file;
    } catch (error) {
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, status: 'error', error: error.message }
          : img
      ));
      throw error;
    }
  }, [images]);

  const compressAll = useCallback(async (options) => {
    const pendingImages = images.filter(img => img.status === 'pending' || img.status === 'error');
    
    if (pendingImages.length === 0) return;
    
    setIsCompressing(true);
    setOverallProgress(0);

    // Mark all as compressing
    setImages(prev => prev.map(img => 
      (img.status === 'pending' || img.status === 'error')
        ? { ...img, status: 'compressing', progress: 0 }
        : img
    ));

    try {
      const pool = poolRef.current || createPool();
      const files = pendingImages.map(img => img.original);
      
      const results = await pool.compressMany(
        files,
        {
          quality: options.quality / 100,
          maxWidth: options.maxWidth || 1920,
          format: options.format,
        },
        (event) => {
          setOverallProgress(Math.round(event.overallProgress * 100));
          const currentFile = pendingImages[event.fileIndex];
          if (currentFile) {
            setImages(prev => prev.map(img => 
              img.id === currentFile.id 
                ? { ...img, progress: Math.max(img.progress, Math.round(event.progress * 100)) }
                : img
            ));
          }
        }
      );

      results.forEach((result, index) => {
        const image = pendingImages[index];
        if (!image) return;

        if (result.status === 'fulfilled') {
          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { 
                  ...img, 
                  compressed: result.value.file,
                  compressedUrl: result.value.url,
                  compressedSize: result.value.compressedSize,
                  status: 'done',
                  progress: 100
                }
              : img
          ));
        } else {
          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, status: 'error', error: result.reason?.message || 'Failed to compress' }
              : img
          ));
        }
      });

      setOverallProgress(100);
    } catch (error) {
      console.error('Batch compression failed:', error);
      setImages(prev => prev.map(img => 
        (img.status === 'compressing')
          ? { ...img, status: 'error', error: error.message }
          : img
      ));
    } finally {
      setIsCompressing(false);
    }
  }, [images]);

  const removeImage = useCallback((imageId) => {
    setImages(prev => {
      const image = prev.find(img => img.id === imageId);
      if (image) {
        URL.revokeObjectURL(image.originalUrl);
        if (image.compressedUrl) {
          URL.revokeObjectURL(image.compressedUrl);
        }
      }
      return prev.filter(img => img.id !== imageId);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
      if (image.compressedUrl) {
        URL.revokeObjectURL(image.compressedUrl);
      }
    });
    setImages([]);
    setOverallProgress(0);
  }, [images]);

  return {
    images,
    isCompressing,
    overallProgress,
    addImages,
    compressImage,
    compressAll,
    removeImage,
    clearAll
  };
};
