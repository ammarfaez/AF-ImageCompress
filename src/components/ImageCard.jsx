import { Download, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { formatFileSize, calculateSavings, getFileNameWithoutExtension } from '../utils/fileHelpers';
import { downloadSingleFile } from '../utils/downloadHelpers';

const ImageCard = ({ image, format, onRemove }) => {
  const handleDownload = () => {
    if (image.compressed) {
      const baseName = getFileNameWithoutExtension(image.original.name);
      const extension = format === 'jpeg' ? 'jpg' : format;
      downloadSingleFile(image.compressed, `${baseName}-compressed.${extension}`);
    }
  };

  const savings = image.compressedSize 
    ? calculateSavings(image.originalSize, image.compressedSize) 
    : 0;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-lg hover:shadow-black/30 flex flex-col">
      {/* Image Preview */}
      <div className="relative aspect-video bg-slate-950">
        <img
          src={image.compressedUrl || image.originalUrl}
          alt={image.original.name}
          className="w-full h-full object-cover"
        />
        
        {/* Status Overlay */}
        {image.status === 'compressing' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader className="w-8 h-8 text-blue-400 animate-spin mb-2" />
              <span className="text-sm text-slate-300">{image.progress}%</span>
            </div>
          </div>
        )}
        
        {image.status === 'done' && (
          <div className="absolute top-3 right-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        )}
        
        {image.status === 'error' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
              <span className="text-sm text-red-300">Failed</span>
            </div>
          </div>
        )}
      </div>

        {/* Info Section */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-sm font-medium text-slate-200 truncate mb-4" title={image.original.name}>
            {image.original.name}
          </p>

          {/* File Sizes */}
          <div className="space-y-2.5 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Original:</span>
              <span className="text-slate-300">{formatFileSize(image.originalSize)}</span>
            </div>

            {image.compressedSize && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Compressed:</span>
                  <span className="text-green-400">{formatFileSize(image.compressedSize)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Saved:</span>
                  <span className={`font-medium ${savings > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {savings}%
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            {image.status === 'done' && (
              <button
                onClick={handleDownload}
                className="btn btn-primary flex-1 px-4 py-2.5 text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}

            <button
              onClick={() => onRemove(image.id)}
              className="btn-icon"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
    </div>
  );
};

export default ImageCard;
