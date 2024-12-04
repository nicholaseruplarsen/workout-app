// src/components/BodyMap.tsx
'use client';

import { useState } from 'react';
import { MuscleSvg } from './MuscleSvg';

const muscleGroups = [
  'neck', 'feet', 'groin', 'upper-trapezius', 'gastrocnemius',
  'tibialis', 'soleus', 'outer-quadricep', 'rectus-femoris',
  'inner-quadricep', 'inner-thigh', 'wrist-extensors', 'wrist-flexors',
  'long-head-bicep', 'short-head-bicep', 'obliques', 'upper-abdominals',
  'lower-abdominals', 'upper-pectoralis', 'mid-lower-pectoralis',
  'anterior-deltoid', 'lateral-deltoid', 'hands'
];

// Exercise database
const exerciseDatabase: Record<string, Record<string, number>> = {
  'bicep curls': {
    'long-head-bicep': 90,
    'short-head-bicep': 85,
    'wrist-flexors': 30,
  },
  // Add more exercises as needed
};

interface SavedExercise {
  name: string;
  completed: boolean;
}

export default function BodyMap({ svgContent }: { svgContent: string }) {
  // Initialize all muscles with 0 activation
  const [muscleActivations, setMuscleActivations] = useState<Record<string, number>>(() => {
    return muscleGroups.reduce((acc, muscle) => {
      acc[muscle] = 0;
      return acc;
    }, {} as Record<string, number>);
  });
  
  const [isReady, setIsReady] = useState(false);
  const [exerciseInput, setExerciseInput] = useState('');
  const [savedExercises, setSavedExercises] = useState<SavedExercise[]>([]);

  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedInput = exerciseInput.toLowerCase().trim();
    
    if (normalizedInput && exerciseDatabase[normalizedInput]) {
      // Update muscle activations
      setMuscleActivations(prev => ({
        ...muscleGroups.reduce((acc, muscle) => {
          acc[muscle] = 0;
          return acc;
        }, {} as Record<string, number>),
        ...exerciseDatabase[normalizedInput]
      }));

      // Add to saved exercises
      setSavedExercises(prev => [...prev, {
        name: exerciseInput.trim(),
        completed: false
      }]);

      setExerciseInput('');
    }
  };

  const toggleExercise = (index: number) => {
    setSavedExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const removeExercise = (index: number) => {
    setSavedExercises(prev => prev.filter((_, i) => i !== index));
    if (savedExercises.length === 1) {
      // Reset all muscle activations to 0 when removing the last exercise
      setMuscleActivations(muscleGroups.reduce((acc, muscle) => {
        acc[muscle] = 0;
        return acc;
      }, {} as Record<string, number>));
    }
  };

  const getActivationColor = (activation: number) => {
    if (activation === 0) return '#EBEBEB';
    if (activation >= 80) return '#FF1A1A';
    if (activation >= 60) return '#FF4D4D';
    if (activation >= 40) return '#FF8080';
    if (activation >= 20) return '#FFB3B3';
    return '#FFE5E5';
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <form onSubmit={handleExerciseSubmit} className="w-full max-w-md mb-8">
        <div className="relative">
          <input
            type="text"
            value={exerciseInput}
            onChange={(e) => setExerciseInput(e.target.value)}
            placeholder="Enter exercise (e.g. bicep curls)"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mw-red-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-mw-red-500 text-white rounded-md hover:bg-mw-red-700 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1">
          <div className={`bodymap-container ${isReady ? 'ready' : ''}`}>
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
            <MuscleSvg 
              className="w-auto h-auto preserve-aspect-ratio bodymap"
              svgContent={svgContent}
              muscleActivations={muscleActivations}
              onReady={() => setIsReady(true)}
            />
          </div>
        </div>

        {savedExercises.length > 0 && (
          <div className="flex-1 bg-gray-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-white">Saved Exercises</h2>
            <div className="space-y-2">
              {savedExercises.map((exercise, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-gray-800 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={exercise.completed}
                    onChange={() => toggleExercise(index)}
                    className="w-5 h-5 accent-mw-red-500"
                  />
                  <span className={`text-white ${exercise.completed ? 'line-through' : ''}`}>
                    {exercise.name}
                  </span>
                  <button
                    onClick={() => removeExercise(index)}
                    className="ml-auto text-gray-400 hover:text-mw-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}