import { TrendingDown, FileImage, HardDrive } from 'lucide-react';
import { formatFileSize, calculateSavings } from '../utils/fileHelpers';

const CompressionStats = ({ images }) => {
  const completedImages = images.filter(img => img.status === 'done');
  
  if (completedImages.length === 0) return null;

  const totalOriginalSize = completedImages.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = completedImages.reduce((sum, img) => sum + img.compressedSize, 0);
  const totalSavings = calculateSavings(totalOriginalSize, totalCompressedSize);

  return (
    <div className="w-full p-5 sm:p-6 bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-800">
      <h3 className="text-sm font-medium text-slate-400 mb-5 flex items-center gap-2">
        <TrendingDown className="w-4 h-4" />
        Compression Summary
      </h3>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Original Size */}
        <div className="text-center p-3 sm:p-4 bg-slate-950/60 rounded-xl">
          <FileImage className="w-5 h-5 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-1">Original</p>
          <p className="text-base sm:text-lg font-bold text-slate-300">
            {formatFileSize(totalOriginalSize)}
          </p>
        </div>

        {/* Compressed Size */}
        <div className="text-center p-3 sm:p-4 bg-slate-950/60 rounded-xl">
          <HardDrive className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-1">Compressed</p>
          <p className="text-base sm:text-lg font-bold text-green-400">
            {formatFileSize(totalCompressedSize)}
          </p>
        </div>

        {/* Savings */}
        <div className="text-center p-3 sm:p-4 bg-slate-950/60 rounded-xl">
          <TrendingDown className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-1">Saved</p>
          <p className="text-base sm:text-lg font-bold text-blue-400">
            {totalSavings}%
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-5 text-center">
        {completedImages.length} image{completedImages.length !== 1 ? 's' : ''} compressed
      </p>
    </div>
  );
};

export default CompressionStats;
