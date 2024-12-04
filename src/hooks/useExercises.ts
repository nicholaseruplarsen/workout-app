// src/hooks/useExercises.ts
import { useState, useCallback } from 'react';
import { Exercise, SavedExercise } from '@/types/exercise';

export function useExercises() {
  const [savedExercises, setSavedExercises] = useState<SavedExercise[]>([]);

  const addExercise = useCallback((exercise: Exercise) => {
    setSavedExercises(prev => [...prev, {
      ...exercise,
      completed: false,
      dateAdded: new Date().toISOString()
    }]);
  }, []);

  const toggleExercise = useCallback((id: string) => {
    setSavedExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  }, []);

  const removeExercise = useCallback((id: string) => {
    setSavedExercises(prev => prev.filter(ex => ex.id !== id));
  }, []);

  return {
    savedExercises,
    addExercise,
    toggleExercise,
    removeExercise
  };
}