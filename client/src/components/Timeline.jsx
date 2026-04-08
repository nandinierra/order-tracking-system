import React from 'react';
import { Package, Box, Truck, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { id: 'placed', label: 'Placed', icon: Package },
  { id: 'packed', label: 'Packed', icon: Box },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const Timeline = ({ currentStatus }) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStatus);

  return (
    <div className="relative py-8 px-2">
      {/* Connector Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full">
        <div 
          className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between items-center">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={stage.id} className="flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                  isCompleted ? 'bg-indigo-600 border-indigo-100 text-white' :
                  isCurrent ? 'bg-white border-indigo-500 text-indigo-600 scale-125 shadow-xl shadow-indigo-100' :
                  'bg-white border-slate-50 text-slate-300'
                }`}
              >
                <Icon className={`${isCurrent ? 'w-6 h-6' : 'w-5 h-5'}`} strokeWidth={isCurrent ? 3 : 2} />
              </div>
              <span className={`mt-4 text-[10px] font-black uppercase tracking-tighter ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
