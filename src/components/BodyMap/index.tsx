// src/components/BodyMap/index.tsx
'use client';

import { Exercise } from '@/types/exercise';
import { ExerciseSearch } from './ExerciseSearch';
import { MuscleMap } from './MuscleMap';
import { ExerciseList } from './ExerciseList';
import { useExercises } from '@/hooks/useExercises';
import { useMuscleActivations } from '@/hooks/useMuscleActivations';
import { useEffect, useState } from 'react';
import './styles.css';

interface BodyMapProps {
  svgContent: string;
}

export default function BodyMap({ svgContent }: BodyMapProps) {
  const { savedExercises, addExercise, removeExercise } = useExercises();
  const muscleActivations = useMuscleActivations(savedExercises);
  const [canOpenSearch, setCanOpenSearch] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Handle both Enter and ArrowDown when search isn't focused
      if (
        (e.key === 'Enter' || e.key === 'ArrowDown') && 
        document.activeElement === document.body &&
        canOpenSearch
      ) {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    };
  
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [canOpenSearch]);

  const handleExerciseAdd = (exercise: Exercise) => {
    setCanOpenSearch(false);
    addExercise(exercise);
    setTimeout(() => setCanOpenSearch(true), 100);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <ExerciseSearch onExerciseAdd={handleExerciseAdd} />
    
      {/* Modified container */}
      <div className="relative w-full max-w-6xl">
        <div className="flex justify-center">
          <MuscleMap
            svgContent={svgContent}
            muscleActivations={muscleActivations}
          />
        </div>
    
        {savedExercises.length > 0 && (
          <div className="absolute top-0 right-0 w-80">
            <ExerciseList
              exercises={savedExercises}
              onRemove={removeExercise}
            />
          </div>
        )}
      </div>
    </div>
  );
}