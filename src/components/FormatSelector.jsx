import { Check } from 'lucide-react';

const formats = [
  { id: 'jpeg', label: 'JPEG', description: 'Best for photos' },
  { id: 'webp', label: 'WebP', description: 'Best compression', recommended: true },
  { id: 'png', label: 'PNG', description: 'Lossless quality' }
];

const FormatSelector = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-3">
        Output Format
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onChange(format.id)}
            className={`
              relative flex flex-col items-center p-4 rounded-xl border-2 
              transition-all duration-200
              ${value === format.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
              }
            `}
          >
            {value === format.id && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
            )}
            
            <span className={`
              text-lg font-bold mb-1
              ${value === format.id ? 'text-blue-400' : 'text-slate-300'}
            `}>
              {format.label}
            </span>
            
            <span className="text-xs text-slate-500">
              {format.description}
            </span>
            
            {format.recommended && (
              <span className="mt-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                Recommended
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;
