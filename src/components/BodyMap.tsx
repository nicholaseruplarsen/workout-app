'use client';

import { useEffect, useState } from 'react';
import Controls from './Controls';
import { MuscleSvg } from './musclewiki-svg';

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

export default function BodyMap() {
  const [muscleActivations, setMuscleActivations] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialActivations = muscleGroups.reduce((acc, muscle) => {
      acc[muscle] = Math.random() * 100;
      return acc;
    }, {} as Record<string, number>);
    setMuscleActivations(initialActivations);
  }, []);

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto p-4">
      <style jsx global>{`
        .bodymap.activation-0 path { fill: #EBEBEB !important; }
        .bodymap.activation-20 path { fill: #FFE5E5 !important; }
        .bodymap.activation-40 path { fill: #FFB3B3 !important; }
        .bodymap.activation-60 path { fill: #FF8080 !important; }
        .bodymap.activation-80 path { fill: #FF4D4D !important; }
        .bodymap.activation-100 path { fill: #FF1A1A !important; }
      `}</style>
      <div className="relative w-full" style={{ maxWidth: '300px' }}>
        <MuscleSvg activations={muscleActivations} />
      </div>
      <div className="w-full max-w-md mt-8">
        <Controls muscleActivations={muscleActivations} />
      </div>
    </div>
  );
}
