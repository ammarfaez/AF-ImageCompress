import { useState } from 'react';
import { Image as ImageIcon, Zap, Download, Trash2 } from 'lucide-react';
import DropZone from './components/DropZone';
import ImageGrid from './components/ImageGrid';
import QualitySlider from './components/QualitySlider';
import FormatSelector from './components/FormatSelector';
import CompressionStats from './components/CompressionStats';
import ProgressBar from './components/ProgressBar';
import { useImageCompressor } from './hooks/useImageCompressor';
import { downloadAllAsZip } from './utils/downloadHelpers';

function App() {
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState('webp');
  
  const {
    images,
    isCompressing,
    overallProgress,
    addImages,
    compressAll,
    removeImage,
    clearAll
  } = useImageCompressor();

  const hasImages = images.length > 0;
  const hasCompletedImages = images.some(img => img.status === 'done');
  const pendingCount = images.filter(img => img.status === 'pending' || img.status === 'error').length;

  const handleCompressAll = () => {
    compressAll({ quality, format, maxWidth: 1920 });
  };

  const handleDownloadAll = () => {
    const completedImages = images.filter(img => img.status === 'done');
    downloadAllAsZip(completedImages, format);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-2xl mb-6">
            <ImageIcon className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Image Compressor
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Compress your images directly in the browser. No upload to servers, 
            completely private and free.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        {/* Drop Zone */}
        <DropZone onFilesAdded={addImages} />

        {/* Controls Section */}
        {hasImages && (
          <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="grid md:grid-cols-2 gap-8">
              <QualitySlider value={quality} onChange={setQuality} />
              <FormatSelector value={format} onChange={setFormat} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={handleCompressAll}
                disabled={isCompressing || pendingCount === 0}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                  transition-all duration-200
                  ${isCompressing || pendingCount === 0
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                  }
                `}
              >
                <Zap className="w-5 h-5" />
                {isCompressing ? 'Compressing...' : `Compress All (${pendingCount})`}
              </button>

              {hasCompletedImages && (
                <>
                  <button
                    onClick={handleDownloadAll}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                      bg-green-600 hover:bg-green-500 text-white
                      transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
                  >
                    <Download className="w-5 h-5" />
                    Download All (ZIP)
                  </button>

                  <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                      bg-slate-700 hover:bg-slate-600 text-slate-300
                      transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear All
                  </button>
                </>
              )}
            </div>

            {/* Progress Bar */}
            {isCompressing && (
              <div className="mt-6">
                <ProgressBar progress={overallProgress} label="Overall Progress" />
              </div>
            )}
          </div>
        )}

        {/* Compression Stats */}
        {hasImages && (
          <div className="mt-6">
            <CompressionStats images={images} />
          </div>
        )}

        {/* Image Grid */}
        {hasImages && (
          <div className="mt-6">
            <ImageGrid 
              images={images} 
              format={format}
              onRemove={removeImage} 
            />
          </div>
        )}

        {/* Empty State */}
        {!hasImages && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center justify-center p-6 bg-slate-800/50 rounded-2xl mb-4">
              <ImageIcon className="w-16 h-16 text-slate-600" />
            </div>
            <h3 className="text-xl font-medium text-slate-400 mb-2">
              No images yet
            </h3>
            <p className="text-slate-500">
              Drop some images above to get started
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-slate-800">
        <p className="text-sm text-slate-500">
          All processing happens in your browser. Your images never leave your device.
        </p>
      </footer>
    </div>
  );
}

export default App;
