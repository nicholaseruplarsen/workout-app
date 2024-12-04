// src/components/BodyMap/ExerciseSearch.tsx
'use client';

import { useState, useRef } from 'react';
import { Exercise } from '@/types/exercise';
import { exerciseDatabase } from '@/data/exercises';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { normalizeExerciseName } from '@/utils/exercises';

interface ExerciseSearchProps {
  onExerciseAdd: (exercise: Exercise) => void;
}

// src/components/BodyMap/ExerciseSearch.tsx
export function ExerciseSearch({ onExerciseAdd }: ExerciseSearchProps) {
  const [input, setInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelection = (exercise: Exercise) => {
    onExerciseAdd(exercise);
    setInput('');
    setSelectedIndex(-1);
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.blur(); // Remove focus from input
    }
  };

  const matchingExercises = Object.values(exerciseDatabase).filter((exercise) =>
    input.length === 0 ? true : // Show all exercises if input is empty
    exercise.name.toLowerCase().includes(normalizeExerciseName(input)) ||
    exercise.tags?.some(tag => tag.toLowerCase().includes(normalizeExerciseName(input)))
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isFocused) {
          setIsFocused(true);
        } else {
          setSelectedIndex(prev => 
            prev < matchingExercises.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (!isFocused) {
          setIsFocused(true);
        } else if (selectedIndex >= 0 && matchingExercises[selectedIndex]) {
          handleSelection(matchingExercises[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.blur();
        }
        setIsFocused(false);
        break;
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md mb-8">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (!relatedTarget?.closest('.suggestions-container')) {
              setIsFocused(false);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter exercise (e.g. bicep curls)"
        />
        
        {isFocused && (
          <div className="suggestions-container absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg 
                         shadow-lg max-h-60 overflow-y-auto">
            {matchingExercises.map((exercise, index) => (
              <button
                key={exercise.id}
                onClick={() => handleSelection(exercise)}
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