// src/hooks/useMuscleActivations.ts
import { useEffect, useState } from 'react';
import { SavedExercise } from '@/types/exercise';
import { calculateMuscleActivations, initializeMuscleActivations } from '@/utils/muscleActivations';

export function useMuscleActivations(exercises: SavedExercise[]) {
  const [muscleActivations, setMuscleActivations] = useState(initializeMuscleActivations());

  useEffect(() => {
    setMuscleActivations(calculateMuscleActivations(exercises));
  }, [exercises]);

  return muscleActivations;
}