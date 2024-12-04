// src/types/exercise.ts
export interface Exercise {
  id: string;
  name: string;
  muscleActivations: Record<string, number>;
  instructions?: string[];
  equipment?: string[];
}

export interface SavedExercise extends Exercise {
  completed: boolean;
  dateAdded: string;
}