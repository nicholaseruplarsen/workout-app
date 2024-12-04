// src/types/exercise.ts
import type { Category, Difficulty, Equipment } from '@/lib/constants';

// src/types/exercise.ts
export interface Exercise {
  id: string;
  name: string;
  category: Category;
  muscleActivations: Record<string, number>;
  instructions: string[];
  equipment?: Equipment[];
  difficulty: Difficulty;
  tags?: string[];
}

export interface SavedExercise extends Exercise {
  completed: boolean;
  dateAdded: string;
}