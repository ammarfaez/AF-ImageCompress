const QualitySlider = ({ value, onChange }) => {
  const getQualityLabel = (quality) => {
    if (quality >= 90) return 'High Quality';
    if (quality >= 70) return 'Balanced';
    if (quality >= 50) return 'Smaller Size';
    return 'Maximum Compression';
  };

  const getQualityColor = (quality) => {
    if (quality >= 90) return 'text-green-400';
    if (quality >= 70) return 'text-blue-400';
    if (quality >= 50) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-slate-300">
          Quality
        </label>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{value}%</span>
          <span className={`text-xs ${getQualityColor(value)}`}>
            {getQualityLabel(value)}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="1"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-blue-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:hover:bg-blue-400
            [&::-webkit-slider-thumb]:transition-colors
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-blue-500/30"
        />
        
        {/* Scale markers */}
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>1%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default QualitySlider;
