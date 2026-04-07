import React from 'react';

interface RetroSliderProps {
  label: string;
  value: number; // 0 to 100
  onChange: (val: number) => void;
}

export default function RetroSlider({ label, value, onChange }: RetroSliderProps) {
  const bars = 20; // 20 blocks means each block is 5%
  const filledCount = Math.round((value / 100) * bars);
  
  const filledString = '■'.repeat(filledCount);
  const emptyString = '·'.repeat(bars - filledCount);

  return (
    <div className="flex items-center justify-between mb-2 relative group w-full">
      {/* Invisible HTML range slider for interaction */}
      <input 
        type="range" 
        min={0} 
        max={100} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full cursor-ew-resize z-10"
        style={{ opacity: 0 }}
      />
      
      {/* Visual ASCII display */}
      <div className="flex-1 mr-4 text-[11px] uppercase font-bold tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-opacity">
        $ {label}
      </div>
      <div className="text-[12px] font-mono tracking-[0.2em] whitespace-pre flex items-center">
        <span className="opacity-50">[</span>
        <span className="retro-ide-glow">{filledString}</span>
        <span className="opacity-30">{emptyString}</span>
        <span className="opacity-50">]</span>
        <span className="ml-3 w-10 text-right retro-ide-glow text-[11px]">{value}%</span>
      </div>
    </div>
  );
}
