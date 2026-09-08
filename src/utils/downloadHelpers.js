import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getFileNameWithoutExtension } from './fileHelpers';

export const downloadSingleFile = (file, filename) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAllAsFiles = (images, format) => {
  images.forEach((image, index) => {
    if (image.compressed) {
      const baseName = getFileNameWithoutExtension(image.original.name);
      const extension = format === 'jpeg' ? 'jpg' : format;
      const filename = `${baseName}-compressed.${extension}`;
      setTimeout(() => downloadSingleFile(image.compressed, filename), index * 150);
    }
  });
};

export const downloadAllAsZip = async (images, format) => {
  const zip = new JSZip();
  const folder = zip.folder('compressed-images');
  
  images.forEach((image) => {
    if (image.compressed) {
      const baseName = getFileNameWithoutExtension(image.original.name);
      const extension = format === 'jpeg' ? 'jpg' : format;
      const filename = `${baseName}-compressed.${extension}`;
      folder.file(filename, image.compressed);
    }
  });
  
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'compressed-images.zip');
};
