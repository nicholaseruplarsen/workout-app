// src/components/BodyMap/index.tsx
'use client';

import './styles.css';
import { Exercise } from '@/types/exercise';
import { ExerciseSearch } from './ExerciseSearch';
import { MuscleMap } from './MuscleMap';
import { ExerciseList } from './ExerciseList';
import { useExercises } from '@/hooks/useExercises';
import { useMuscleActivations } from '@/hooks/useMuscleActivations';
import { useEffect, useState } from 'react';
import { findOptimalWorkout } from '@/lib/exercises';
import { OptimizationProgress } from './OptimizationProgress'; 

interface BodyMapProps {
  svgContent: string;
}

export default function BodyMap({ svgContent }: BodyMapProps) {
  const { savedExercises, addExercise, removeExercise } = useExercises();
  const muscleActivations = useMuscleActivations(savedExercises);
  const [canOpenSearch, setCanOpenSearch] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentCombination, setCurrentCombination] = useState<Exercise[]>([]);

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

  const handleOptimalWorkout = async () => {
    setIsOptimizing(true);
    setCurrentCombination([]);
  
    try {
      const result = await findOptimalWorkout((combination) => {
        setCurrentCombination([...combination]);
      });
  
      // Small delay before adding exercises to ensure animation is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear previous exercises
      savedExercises.forEach(exercise => {
        removeExercise(exercise.id);
      });
  
      // Add new exercises
      result.exercises.forEach(exercise => {
        addExercise(exercise);
      });
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <button
        onClick={handleOptimalWorkout}
        disabled={isOptimizing}
        className="fixed top-4 left-4 px-4 py-2 bg-transparent border border-white rounded-md text-white hover:bg-white/10 transition-colors disabled:opacity-50"
      >
        {isOptimizing ? 'Optimizing...' : 'Generate Optimal Workout'}
      </button>
  
      <OptimizationProgress 
        combination={currentCombination}
        isOptimizing={isOptimizing}
      />
  
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