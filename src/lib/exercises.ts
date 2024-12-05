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

export function findOptimalWorkout(
  onProgress?: (combination: Exercise[]) => void
): OptimalWorkoutResult {
  const allExercises = Object.values(exerciseDatabase);
  const muscleTargets = new Set<string>();
  
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

  function calculateTotalActivations(exercises: Exercise[]): Record<string, number> {
    const totals: Record<string, number> = {};
    exercises.forEach(exercise => {
      Object.entries(exercise.muscleActivations).forEach(([muscle, activation]) => {
        totals[muscle] = (totals[muscle] || 0) + activation;
      });
    });
    return totals;
  }

  function calculateScore(activations: Record<string, number>): number {
    let score = 0;
    muscleTargets.forEach(muscle => {
      const activation = activations[muscle] || 0;
      if (activation < 95) {
        score += Math.pow(95 - activation, 2);
      }
      if (activation > 105) {
        score += Math.pow(activation - 105, 2);
      }
    });
    return score;
  }

  let combinationIndex = 0;

  function findCombination(current: Exercise[], index: number) {
    if (onProgress && current.length > 0) {
      setTimeout(() => {
        onProgress(current);
      }, combinationIndex * 500);
      combinationIndex++;
    }

    const activations = calculateTotalActivations(current);
    const score = calculateScore(activations);

    if (score < bestScore) {
      bestScore = score;
      bestSolution = {
        exercises: [...current],
        totalActivations: {...activations}
      };
    }

    if (current.length >= 6 || score < 100) return;

    // Try adding each remaining exercise
    for (let i = index; i < allExercises.length; i++) {
      findCombination([...current, allExercises[i]], i + 1);
    }
  }

  findCombination([], 0);

  // Force a minimum optimization display time
  setTimeout(() => {
    if (onProgress) {
      onProgress(bestSolution.exercises);
    }
  }, combinationIndex * 200);

  return bestSolution;
}