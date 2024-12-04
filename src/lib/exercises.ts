// src/lib/exercises.ts
import { Exercise } from '@/types/exercise';
import { Equipment } from '@/lib/constants';
import { exerciseDatabase } from '@/data/exercises';

export function findExercise(query: string): Exercise | null {
  const normalizedQuery = query.toLowerCase();
  
  return Object.values(exerciseDatabase).find(exercise => {
    // Search through multiple fields
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

export function getExercisesByCategory(category: string): Exercise[] {
  return Object.values(exerciseDatabase).filter(exercise => 
    exercise.category === category
  );
}

export function getExercisesByEquipment(equipment: Equipment): Exercise[] {
  return Object.values(exerciseDatabase).filter(exercise => 
    exercise.equipment?.includes(equipment)
  );
}
