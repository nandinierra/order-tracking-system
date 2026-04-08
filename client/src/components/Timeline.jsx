import React from 'react';
import { FileText, Package, Truck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const STAGES = [
  { id: 'placed', label: 'Placed', icon: FileText, desc: 'Order received' },
  { id: 'packed', label: 'Packed', icon: Package, desc: 'Items prepared' },
  { id: 'shipped', label: 'Shipped', icon: Truck, desc: 'In transit' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Final arrival' },
];

const Timeline = ({ currentStatus }) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStatus);

  return (
    <div className="relative py-12 px-4">
      {/* Background Track */}
      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-10 rounded-full overflow-hidden">
        {/* Progress Fill */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        />
      </div>

      {/* Steps Container */}
      <div className="relative flex justify-between items-center">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={stage.id} className="flex flex-col items-center flex-1 max-w-[120px]">
              {/* Step Circle/Icon */}
              <div className="relative mb-6">
                {/* Glowing Pulse for Current Step */}
                {isCurrent && (
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl"
                  />
                )}
                
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: isCurrent ? 1.15 : 1,
                    backgroundColor: isCompleted ? '#4f46e5' : isCurrent ? '#ffffff' : '#f8fafc',
                    borderColor: isCompleted ? '#4338ca' : isCurrent ? '#4f46e5' : '#f1f5f9'
                  }}
                  className={`relative w-14 h-14 rounded-2xl border-4 flex items-center justify-center transition-all duration-500 z-10 ${
                    isCurrent ? 'shadow-[0_10px_25px_-5px_rgba(79,70,229,0.3)]' : ''
                  }`}
                >
                  <Icon 
                    className={`w-6 h-6 transition-colors duration-500 ${
                      isCompleted ? 'text-white' : isCurrent ? 'text-indigo-600' : 'text-slate-300'
                    }`} 
                    strokeWidth={2.5}
                  />
                </motion.div>

                {/* Status Indicator Dot (Floating above) */}
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full z-20 animate-bounce" />
                )}
              </div>

              {/* Labels */}
              <div className="text-center">
                <p className={`text-[11px] font-black uppercase tracking-widest leading-none mb-1 transition-colors duration-500 ${
                  isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {stage.label}
                </p>
                <p className={`text-[9px] font-bold transition-colors duration-500 ${
                  isCurrent ? 'text-indigo-400' : 'text-slate-300'
                }`}>
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;

