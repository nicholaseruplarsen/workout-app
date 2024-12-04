// src/utils/exercises.ts
import { Exercise } from '@/types/exercise';
import { exerciseDatabase } from '@/data/exercises';

export function normalizeExerciseName(name: string) {
  return name.toLowerCase().trim();
}

export function findExercise(query: string): Exercise | null {
  const normalizedQuery = normalizeExerciseName(query);
  
  return Object.values(exerciseDatabase).find(exercise => {
    return (
      exercise.name.toLowerCase().includes(normalizedQuery) ||
      exercise.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
      exercise.category.toLowerCase().includes(normalizedQuery)
    );
  }) || null;
}

export function getExercisesByMuscle(muscle: string): Exercise[] {
  return Object.values(exerciseDatabase).filter(exercise => 
    exercise.muscleActivations[muscle] && exercise.muscleActivations[muscle] > 0
  );
}