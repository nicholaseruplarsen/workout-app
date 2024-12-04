// src/hooks/useMuscleActivations.ts
import { useEffect, useState } from 'react';
import type { SavedExercise, MuscleActivation } from '@/types/exercise';
import { calculateMuscleActivations } from '@/utils/muscleActivations';

export function useMuscleActivations(exercises: SavedExercise[]) {
  const [muscleActivations, setMuscleActivations] = useState<Record<string, MuscleActivation>>({});

  useEffect(() => {
    setMuscleActivations(calculateMuscleActivations(exercises));
  }, [exercises]);

  return muscleActivations;
}