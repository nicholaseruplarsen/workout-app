'use client';

import { useEffect, useState } from 'react';
import Controls from './Controls';
import { MuscleSvg } from './MuscleSvg';

const muscleGroups = [
  'neck',
  'feet',
  'groin',
  'upper-trapezius',
  'gastrocnemius',
  'tibialis',
  'soleus',
  'outer-quadricep',
  'rectus-femoris',
  'inner-quadricep',
  'inner-thigh',
  'wrist-extensors',
  'wrist-flexors',
  'long-head-bicep',
  'short-head-bicep',
  'obliques',
  'upper-abdominals',
  'lower-abdominals',
  'upper-pectoralis',
  'mid-lower-pectoralis',
  'anterior-deltoid',
  'lateral-deltoid',
  'hands'
];

interface BodyMapProps {
  svgContent: string;
}

export default function BodyMap({ svgContent }: BodyMapProps) {
  const [muscleActivations, setMuscleActivations] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialActivations = muscleGroups.reduce((acc, muscle) => {
      acc[muscle] = Math.random() * 100;
      return acc;
    }, {} as Record<string, number>);
    setMuscleActivations(initialActivations);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <style jsx global>{`
        .bodymap path { fill: #EBEBEB; }
        .bodymap.activation-0 path { fill: #EBEBEB !important; }
        .bodymap.activation-20 path { fill: #FFE5E5 !important; }
        .bodymap.activation-40 path { fill: #FFB3B3 !important; }
        .bodymap.activation-60 path { fill: #FF8080 !important; }
        .bodymap.activation-80 path { fill: #FF4D4D !important; }
        .bodymap.activation-100 path { fill: #FF1A1A !important; }
      `}</style>
      <div className="flex flex-row gap-8 w-full max-w-7xl px-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-h-xl">
            <MuscleSvg 
              activations={muscleActivations} 
              className="w-full h-auto preserve-aspect-ratio" 
              svgContent={svgContent}
            />
          </div>
        </div>
        <div className="w-100">
          <Controls muscleActivations={muscleActivations} />
        </div>
      </div>
    </div>
  );
}