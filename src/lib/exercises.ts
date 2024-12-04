// src/lib/exercises.ts
import { Exercise } from '@/types/exercise';

// Example exercise database
export const exerciseDatabase: Record<string, Exercise> = {
  'bicep-curls': {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    muscleActivations: {
      'long-head-bicep': 90,
      'short-head-bicep': 85,
      'wrist-flexors': 30,
    },
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold dumbbells at your sides',
      'Curl weights up while keeping elbows still',
      'Lower weights back down slowly',
    ],
  },
  // Add more exercises...
};

export function findExercise(query: string): Exercise | null {
  const normalizedQuery = query.toLowerCase();
  return Object.values(exerciseDatabase).find(
    exercise => exercise.name.toLowerCase().includes(normalizedQuery)
  ) || null;
}