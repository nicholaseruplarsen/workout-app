// src/components/BodyMap.tsx
'use client';

import { useEffect, useState } from 'react';
import { MuscleSvg } from './MuscleSvg';

const muscleGroups = [
  'neck', 'feet', 'groin', 'upper-trapezius', 'gastrocnemius',
  'tibialis', 'soleus', 'outer-quadricep', 'rectus-femoris',
  'inner-quadricep', 'inner-thigh', 'wrist-extensors', 'wrist-flexors',
  'long-head-bicep', 'short-head-bicep', 'obliques', 'upper-abdominals',
  'lower-abdominals', 'upper-pectoralis', 'mid-lower-pectoralis',
  'anterior-deltoid', 'lateral-deltoid', 'hands'
];

interface BodyMapProps {
  svgContent: string;
}

export default function BodyMap({ svgContent }: BodyMapProps) {
  const [muscleActivations, setMuscleActivations] = useState<Record<string, number>>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize random activations
    const initialActivations = muscleGroups.reduce((acc, muscle) => {
      acc[muscle] = Math.floor(Math.random() * 100);
      return acc;
    }, {} as Record<string, number>);
    setMuscleActivations(initialActivations);
  }, []);

  const getActivationColor = (activation: number) => {
    if (activation >= 80) return '#FF1A1A';
    if (activation >= 60) return '#FF4D4D';
    if (activation >= 40) return '#FF8080';
    if (activation >= 20) return '#FFB3B3';
    return '#FFE5E5';
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <style jsx global>{`
        .bodymap-container {
          visibility: hidden;
        }
        
        .bodymap-container.ready {
          visibility: visible;
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .bodymap path { 
          transition: all 0.2s ease-in-out;
        }
        
        .bodymap g[id] path:not([fill="none"]) { 
          fill: #EBEBEB;
        }

        ${muscleGroups.map(muscle => `
          .bodymap #${muscle} {
            cursor: pointer;
          }
          .bodymap #${muscle} path:not([fill="none"]) {
            fill: ${muscleActivations[muscle] ? getActivationColor(muscleActivations[muscle]) : '#EBEBEB'};
          }
        `).join('\n')}

        .muscle-tooltip {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          pointer-events: none;
          transform: translate(-50%, -100%);
          margin-top: -12px;
          z-index: 1000;
        }
      `}</style>
      <div className={`w-full max-w-2xl bodymap-container ${isReady ? 'ready' : ''}`}>
        <MuscleSvg 
          className="w-full h-auto preserve-aspect-ratio bodymap"
          svgContent={svgContent}
          muscleActivations={muscleActivations}
          onReady={() => setIsReady(true)}
        />
      </div>
    </div>
  );
}