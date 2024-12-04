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
    // Convert activation to decimal (0-1)
    const t = activation / 100;
    
    // Start color (light pink/white) - rgb(255, 229, 229)
    const r1 = 255;
    const g1 = 229;
    const b1 = 229;
    
    // End color (bright red) - rgb(255, 36, 0)
    const r2 = 255;
    const g2 = 36;
    const b2 = 0;
    
    // Linear interpolation between the two colors
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
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
      <div className={`bodymap-container ${isReady ? 'ready' : ''}`}>
        <MuscleSvg 
          className="w-auto h-auto preserve-aspect-ratio bodymap"
          svgContent={svgContent}
          muscleActivations={muscleActivations}
          onReady={() => setIsReady(true)}
        />
      </div>
    </div>
  );
}
