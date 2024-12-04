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
  const [canOpenSearch, setCanOpenSearch] = useState(true);
  const { 
    savedExercises, 
    addExercise, 
    toggleExercise, 
    removeExercise 
  } = useExercises();
  
  const muscleActivations = useMuscleActivations(savedExercises);

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

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        <MuscleMap
          svgContent={svgContent}
          muscleActivations={muscleActivations}
        />

        {savedExercises.length > 0 && (
          <ExerciseList
            exercises={savedExercises}
            onToggle={toggleExercise}
            onRemove={removeExercise}
          />
        )}
      </div>
    </div>
  );
}