// src/lib/search.ts
import { Exercise } from '@/types/exercise';
import { Category, Difficulty, Equipment } from '@/lib/constants';
import { exerciseDatabase } from '@/data/exercises';

interface SearchFilters {
  category?: Category;
  equipment?: Equipment;
  difficulty?: Difficulty;
  muscle?: string;
}

export function searchExercises(query: string, filters?: SearchFilters): Exercise[] {
  const normalizedQuery = query.toLowerCase();
  
  return Object.values(exerciseDatabase).filter((value: unknown): value is Exercise => {
    const exercise = value as Exercise;
    
    // Apply search query
    const matchesQuery = !query || 
      exercise.name.toLowerCase().includes(normalizedQuery) ||
      exercise.tags?.some((tag: string) => tag.toLowerCase().includes(normalizedQuery));

    // Apply filters
    const matchesCategory = !filters?.category || exercise.category === filters.category;
    const matchesEquipment = !filters?.equipment || exercise.equipment?.includes(filters.equipment);
    const matchesDifficulty = !filters?.difficulty || exercise.difficulty === filters.difficulty;
    const matchesMuscle = !filters?.muscle || (exercise.muscleActivations[filters.muscle] > 0);

    return Boolean(matchesQuery && matchesCategory && matchesEquipment && matchesDifficulty && matchesMuscle);
  });
}