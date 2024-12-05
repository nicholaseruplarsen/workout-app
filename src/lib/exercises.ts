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

export async function findOptimalWorkout(
  onProgress?: (combination: Exercise[]) => void
): Promise<OptimalWorkoutResult> {
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

  const startTime = Date.now();
  const MAX_TIME = 3000;
  const PROGRESS_INTERVAL = 100; // Show progress every 100ms

  let lastProgressTime = startTime;

  async function findCombination(current: Exercise[], index: number) {
    const currentTime = Date.now();
    
    // Only show progress periodically to avoid slowing down the search
    if (onProgress && currentTime - lastProgressTime >= PROGRESS_INTERVAL) {
      onProgress([...current]);
      lastProgressTime = currentTime;
      await new Promise(resolve => setTimeout(resolve, 5)); // Minimal delay
    }

    if (currentTime - startTime >= MAX_TIME) {
      return;
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

    // Try all possible next exercises
    for (let i = index; i < allExercises.length; i++) {
      await findCombination([...current, allExercises[i]], i + 1);
    }
  }

  // First run the algorithm without animation to find the true optimal solution
  await findCombination([], 0);

  // Then show a quick animation of the path to the optimal solution
  if (onProgress) {
    for (let i = 1; i <= bestSolution.exercises.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress(bestSolution.exercises.slice(0, i));
    }
  }

  return bestSolution;
}