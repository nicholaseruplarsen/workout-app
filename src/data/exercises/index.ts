// src/data/exercises/index.ts
import { Exercise } from '@/types/exercise';
import rawArmsExercises from './arms.json';
import rawLegsExercises from './legs.json';
import rawChestExercises from './chest.json';
import rawBackExercises from './back.json';
import rawCoreExercises from './core.json';
import { Category, Difficulty, Equipment } from '@/lib/constants';

// Type guard functions
function isValidCategory(category: string): category is Category {
  return ['arms', 'legs', 'chest', 'back', 'core'].includes(category);
}

function isValidDifficulty(difficulty: string): difficulty is Difficulty {
  return ['beginner', 'intermediate', 'advanced'].includes(difficulty);
}

function isValidEquipment(equipment: string): equipment is Equipment {
  return ['dumbbells', 'barbell', 'cable', 'bodyweight', 'machine', 'resistance bands'].includes(equipment);
}

// Validate and transform exercise data
function validateExercise(exercise: any, id: string): Exercise {
  if (!isValidCategory(exercise.category)) {
    throw new Error(`Invalid category for exercise ${id}`);
  }
  
  if (!isValidDifficulty(exercise.difficulty)) {
    throw new Error(`Invalid difficulty for exercise ${id}`);
  }
  
  if (exercise.equipment) {
    exercise.equipment.forEach((eq: string) => {
      if (!isValidEquipment(eq)) {
        throw new Error(`Invalid equipment "${eq}" for exercise ${id}`);
      }
    });
  }

  return exercise as Exercise;
}

function validateExerciseGroup(exercises: Record<string, any>): Record<string, Exercise> {
  const validated: Record<string, Exercise> = {};
  
  Object.entries(exercises).forEach(([id, exercise]) => {
    validated[id] = validateExercise(exercise, id);
  });
  
  return validated;
}

// Export validated exercise data
export const exerciseDatabase: Record<string, Exercise> = {
  ...validateExerciseGroup(rawArmsExercises),
  ...validateExerciseGroup(rawLegsExercises),
  ...validateExerciseGroup(rawChestExercises),
  ...validateExerciseGroup(rawBackExercises),
  ...validateExerciseGroup(rawCoreExercises),
};