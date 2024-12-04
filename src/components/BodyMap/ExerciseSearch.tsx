// src/components/BodyMap/ExerciseSearch.tsx
'use client';

import { useState } from 'react';
import { Exercise } from '@/types/exercise';
import { exerciseDatabase } from '@/data/exercises';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { normalizeExerciseName } from '@/utils/exercises';

interface ExerciseSearchProps {
  onExerciseAdd: (exercise: Exercise) => void;
}

export function ExerciseSearch({ onExerciseAdd }: ExerciseSearchProps) {
  const [input, setInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const matchingExercises = Object.values(exerciseDatabase).filter((exercise) =>
    exercise.name.toLowerCase().includes(normalizeExerciseName(input)) ||
    exercise.tags?.some(tag => tag.toLowerCase().includes(normalizeExerciseName(input)))
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
          onExerciseAdd(matchingExercises[selectedIndex]);
          setInput('');
          setSelectedIndex(-1);
        }
        break;
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md mb-8">
      <div className="relative">
        <Input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value);
            setSelectedIndex(-1);
          }}
          
          onKeyDown={handleKeyDown}
          placeholder="Enter exercise (e.g. bicep curls)"
        />
        
        {input.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg 
                         shadow-lg max-h-60 overflow-y-auto">
            {matchingExercises.map((exercise, index) => (
              <button
                key={exercise.id}
                onClick={() => {
                  onExerciseAdd(exercise);
                  setInput('');
                  setSelectedIndex(-1);
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
      </div>
    </form>
  );
}