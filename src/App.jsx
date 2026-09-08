import { useState } from 'react';
import { Image as ImageIcon, Zap, Download, Trash2, ShieldCheck, Sparkles, HardDrive } from 'lucide-react';
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
    <div className="w-full min-h-screen bg-slate-950 text-slate-200 antialiased">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* Header / Hero */}
      <header className="relative px-4 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center" style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-sm font-medium mb-10">
            <Sparkles className="w-4 h-4" />
            Free · Private · In-browser
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-6">
            Image Compressor
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto text-center leading-relaxed" style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            Shrink JPG, PNG and WebP images right in your browser.
            No uploads, no servers — your photos never leave your device.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto px-4 pb-20 sm:pb-24" style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        {/* Drop Zone */}
        <div className="mt-6">
          <DropZone onFilesAdded={addImages} />
        </div>

        {/* Controls Section */}
        {hasImages && (
          <section className="mt-16 p-6 sm:p-10 bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-800">
            <div className="grid md:grid-cols-2 gap-12">
              <QualitySlider value={quality} onChange={setQuality} />
              <FormatSelector value={format} onChange={setFormat} />
            </div>

            <div className="h-px bg-slate-800 my-10" />

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleCompressAll}
                disabled={isCompressing || pendingCount === 0}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                  transition-all duration-200
                  ${isCompressing || pendingCount === 0
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30'
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
                      shadow-lg shadow-green-600/25 hover:shadow-green-500/30
                      transition-all duration-200"
                  >
                    <Download className="w-5 h-5" />
                    Download All (ZIP)
                  </button>

                  <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                      bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700
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
              <div className="mt-10">
                <ProgressBar progress={overallProgress} label="Overall Progress" />
              </div>
            )}
          </section>
        )}

        {/* Compression Stats */}
        {hasImages && (
          <div className="mt-16">
            <CompressionStats images={images} />
          </div>
        )}

        {/* Image Grid */}
        {hasImages && (
          <div className="mt-16">
            <ImageGrid 
              images={images} 
              format={format}
              onRemove={removeImage} 
            />
          </div>
        )}

        {/* Empty State */}
        {!hasImages && (
          <div className="mt-24 text-center">
            <div className="inline-flex items-center justify-center p-8 bg-slate-900/70 backdrop-blur rounded-2xl mb-6">
              <ImageIcon className="w-16 h-16 text-slate-600" />
            </div>
            <h3 className="text-xl font-medium text-slate-300 mb-3">
              No images yet
            </h3>
            <p className="text-slate-500">
              Drop some images above to get started
            </p>
          </div>
        )}
      </main>

      {/* Features strip */}
      {!hasImages && (
        <div className="relative max-w-4xl mx-auto px-4 pb-28" style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <ShieldCheck className="w-6 h-6 text-green-400 mb-3" />
              <p className="text-sm font-medium text-slate-300 mb-1.5">100% Private</p>
              <p className="text-xs text-slate-500">Files never uploaded</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <Zap className="w-6 h-6 text-blue-400 mb-3" />
              <p className="text-sm font-medium text-slate-300 mb-1.5">Instant & Free</p>
              <p className="text-xs text-slate-500">No sign-up required</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <HardDrive className="w-6 h-6 text-indigo-400 mb-3" />
              <p className="text-sm font-medium text-slate-300 mb-1.5">Save Storage</p>
              <p className="text-xs text-slate-500">Up to 90% smaller</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative py-12 text-center border-t border-slate-800/70">
        <div className="max-w-4xl mx-auto px-4" style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
          <p className="text-sm text-slate-500">
            All processing happens in your browser. Your images never leave your device.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
