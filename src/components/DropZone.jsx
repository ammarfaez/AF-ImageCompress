import { Upload, Image as ImageIcon } from 'lucide-react';
import { useFileDrop } from '../hooks/useFileDrop';

const DropZone = ({ onFilesAdded }) => {
  const {
    isDragOver,
    errors,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput
  } = useFileDrop(onFilesAdded);

  return (
    <div className="w-full">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          w-full h-80 border-2 border-dashed rounded-2xl
          cursor-pointer transition-all duration-300 ease-in-out
          ${isDragOver 
            ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
            : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900/80'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={`
          p-5 rounded-full mb-5 transition-colors duration-300
          ${isDragOver ? 'bg-blue-500/20' : 'bg-slate-700/50'}
        `}>
          {isDragOver ? (
            <ImageIcon className="w-14 h-14 text-blue-400" />
          ) : (
            <Upload className="w-14 h-14 text-slate-400" />
          )}
        </div>
        
        <p className={`
          text-lg font-medium mb-2 transition-colors duration-300
          ${isDragOver ? 'text-blue-300' : 'text-slate-300'}
        `}>
          {isDragOver ? 'Drop your images here' : 'Drag & drop images here'}
        </p>
        
        <p className="text-sm text-slate-500 mb-4">
          or click to browse
        </p>
        
        <p className="text-xs text-slate-600 mt-2">
          Supports: JPG, PNG, WebP, BMP, GIF (max 50MB each)
        </p>
      </label>

      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-400">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropZone;
