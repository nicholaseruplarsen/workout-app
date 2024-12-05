// src/lib/exercises.ts
import { Exercise } from '@/types/exercise';
import { Equipment } from '@/lib/constants';
import { exerciseDatabase } from '@/data/exercises';

interface OptimalWorkoutResult {
  exercises: Exercise[];
  totalActivations: Record<string, number>;
}

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

export function findOptimalWorkout(): OptimalWorkoutResult {
  const allExercises = Object.values(exerciseDatabase);
  const muscleTargets = new Set<string>();
  
  // Collect all unique muscles
  allExercises.forEach(exercise => {
    Object.keys(exercise.muscleActivations).forEach(muscle => {
      muscleTargets.add(muscle);
    });
  });

  let bestSolution: OptimalWorkoutResult = {
    exercises: [],
    totalActivations: {}
  };
  let bestScore = Number.MAX_VALUE;

  // Helper to calculate total activations
  function calculateTotalActivations(exercises: Exercise[]): Record<string, number> {
    const totals: Record<string, number> = {};
    exercises.forEach(exercise => {
      Object.entries(exercise.muscleActivations).forEach(([muscle, activation]) => {
        totals[muscle] = (totals[muscle] || 0) + activation;
      });
    });
    return totals;
  }

  // Helper to calculate score (lower is better)
  function calculateScore(activations: Record<string, number>): number {
    let score = 0;
    muscleTargets.forEach(muscle => {
      const activation = activations[muscle] || 0;
      if (activation < 95) {
        score += Math.pow(95 - activation, 2); // Penalize under-activation
      }
      if (activation > 105) {
        score += Math.pow(activation - 105, 2); // Penalize over-activation
      }
    });
    return score;
  }

  // Try different combinations of exercises
  function findCombination(current: Exercise[], index: number) {
    const activations = calculateTotalActivations(current);
    const score = calculateScore(activations);

    if (score < bestScore) {
      bestScore = score;
      bestSolution = {
        exercises: [...current],
        totalActivations: {...activations}
      };
    }

    // Stop if we have too many exercises or the score is good enough
    if (current.length >= 6 || score < 100) return;

    // Try adding each remaining exercise
    for (let i = index; i < allExercises.length; i++) {
      findCombination([...current, allExercises[i]], i + 1);
    }
  }

  findCombination([], 0);
  return bestSolution;
}

