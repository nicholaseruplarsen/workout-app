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

// BodyMap.tsx
export default function BodyMap({ svgContent }: BodyMapProps) {
  useEffect(() => {
    // Debug: Log all group IDs to see what we're working with
    const svg = document.querySelector('svg');
    if (svg) {
      const groups = svg.querySelectorAll('g[id]');
      console.log('Available muscle groups:', Array.from(groups).map(g => g.id));
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <style jsx global>{`
        /* Base styles for all paths */
        .bodymap path { 
          transition: all 0.2s ease-in-out;
        }
        
        /* Style for paths that should be filled */
        .bodymap g[id] path:not([fill="none"]) { 
          fill: #EBEBEB;
        }

        /* Hover styles */
        ${muscleGroups.map(muscle => `
          .bodymap #${muscle} {
            cursor: pointer;
          }
          .bodymap #${muscle}:hover path:not([fill="none"]) {
            fill: #FF1A1A !important;
          }
          .bodymap #${muscle}:hover path[fill="none"] {
            stroke: #CC0000;
          }
        `).join('\n')}

        .muscle-tooltip {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          pointer-events: none;
          transform: translate(-50%, -100%);
          margin-top: -8px;
          z-index: 1000;
        }
      `}</style>
      <div className="w-full max-w-2xl">
        <MuscleSvg 
          className="w-full h-auto preserve-aspect-ratio bodymap"
          svgContent={svgContent}
        />
      </div>
    </div>
  );
}