// src/components/BodyMap.tsx
'use client';

import { useState } from 'react';
import { MuscleSvg } from './MuscleSvg';
import { Exercise } from '@/types/exercise';
import { exerciseDatabase } from '@/data/exercises';

const muscleGroups = [
  'neck', 'feet', 'groin', 'upper-trapezius', 'gastrocnemius',
  'tibialis', 'soleus', 'outer-quadricep', 'rectus-femoris',
  'inner-quadricep', 'inner-thigh', 'wrist-extensors', 'wrist-flexors',
  'long-head-bicep', 'short-head-bicep', 'obliques', 'upper-abdominals',
  'lower-abdominals', 'upper-pectoralis', 'mid-lower-pectoralis',
  'anterior-deltoid', 'lateral-deltoid', 'hands'
];

interface SavedExercise extends Exercise {
  completed: boolean;
  dateAdded: string;
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

  const updateMuscleActivations = (exercises: SavedExercise[]) => {
    // Reset all muscle activations
    const newActivations = muscleGroups.reduce((acc, muscle) => {
      acc[muscle] = 0;
      return acc;
    }, {} as Record<string, number>);
  
    // Combine activations from all exercises
    exercises.forEach(exercise => {
      Object.entries(exercise.muscleActivations).forEach(([muscle, activation]) => {
        // Take the maximum activation value for each muscle
        newActivations[muscle] = Math.max(
          newActivations[muscle] || 0,
          activation
        );
      });
    });
  
    setMuscleActivations(newActivations);
  };
  
  // Update the handleExerciseSubmit function
  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedInput = exerciseInput.toLowerCase().trim();
    
    if (normalizedInput && exerciseDatabase[normalizedInput]) {
      const exercise = exerciseDatabase[normalizedInput];
      
      // Add to saved exercises
      const updatedExercises = [...savedExercises, {
        ...exercise,
        completed: false,
        dateAdded: new Date().toISOString()
      }];
      
      setSavedExercises(updatedExercises);
      // Update muscle activations based on all exercises
      updateMuscleActivations(updatedExercises);
      setExerciseInput('');
    }
  };
  
  // Also update the removeExercise function
  const removeExercise = (index: number) => {
    const updatedExercises = savedExercises.filter((_, i) => i !== index);
    setSavedExercises(updatedExercises);
    updateMuscleActivations(updatedExercises);
  };

  const toggleExercise = (index: number) => {
    setSavedExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const getActivationColor = (activation: number) => {
    if (activation === 0) return '#EBEBEB';
    if (activation >= 80) return '#FF1A1A';
    if (activation >= 60) return '#FF4D4D';
    if (activation >= 40) return '#FF8080';
    if (activation >= 20) return '#FFB3B3';
    return '#FFE5E5';
  };

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  
  // Add this function to handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const matchingExercises = Object.values(exerciseDatabase).filter((exercise: Exercise) =>
      exercise.name.toLowerCase().includes(exerciseInput.toLowerCase()) ||
      (exercise.tags ?? []).some(tag => tag.toLowerCase().includes(exerciseInput.toLowerCase()))
    );
  
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < matchingExercises.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && matchingExercises[selectedIndex]) {
          const exercise = matchingExercises[selectedIndex];
          setExerciseInput('');
          setSelectedIndex(-1);
            const updatedExercises = [...savedExercises, {
              ...exercise,
              completed: false,
              dateAdded: new Date().toISOString()
            }];
            setSavedExercises(updatedExercises);
            updateMuscleActivations(updatedExercises);
          }
          break;
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <form onSubmit={handleExerciseSubmit} className="w-full max-w-md mb-8">
        <div className="relative">
          <input
            type="text"
            value={exerciseInput}
            onChange={(e) => {
              setExerciseInput(e.target.value);
              setSelectedIndex(-1); // Reset selection when input changes
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter exercise (e.g. bicep curls)"
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg 
                       text-white placeholder-gray-400 
                       focus:ring-2 focus:ring-mw-red-500 focus:border-transparent
                       transition-colors"
          />
          {exerciseInput.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg 
                            shadow-lg max-h-60 overflow-y-auto">
              {Object.values(exerciseDatabase)
                .filter((exercise: Exercise) => 
                  exercise.name.toLowerCase().includes(exerciseInput.toLowerCase()) ||
                  (exercise.tags ?? []).some(tag => tag.toLowerCase().includes(exerciseInput.toLowerCase()))
                )
                .map((exercise: Exercise, index: number) => (
                  <button
                    key={exercise.id}
                    onClick={() => {
                      setExerciseInput('');
                      setSelectedIndex(-1);
                          const updatedExercises = [...savedExercises, {
                            ...exercise,
                            completed: false,
                            dateAdded: new Date().toISOString()
                          }];
                          setSavedExercises(updatedExercises);
                          updateMuscleActivations(updatedExercises);
                        }}
                        className={`w-full px-4 py-2 text-left text-white 
                                   ${index === selectedIndex ? 'bg-gray-800' : 'hover:bg-gray-800'}
                                   transition-colors cursor-pointer`}
                      >
                    <div className="font-medium">{exercise.name}</div>
                    {exercise.tags && (
                      <div className="text-sm text-gray-400">
                        {exercise.tags.join(', ')}
                      </div>
                    )}
                  </button>
                ))}
            </div>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 
                       bg-mw-red-500 text-white rounded-md hover:bg-mw-red-700 
                       transition-colors"
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