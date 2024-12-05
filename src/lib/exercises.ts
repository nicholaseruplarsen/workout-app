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
  let combinationsChecked = 0;
  const MAX_TIME = 3000; // 3 seconds

  async function findCombination(current: Exercise[], index: number) {
    const currentTime = Date.now() - startTime;
    if (currentTime >= MAX_TIME) {
      return;
    }

    combinationsChecked++;
    
    if (onProgress && current.length > 0) {
      // Show progress of current combination being tested
      onProgress([...current]);
      // Delay based on remaining time and estimated remaining combinations
      const remainingTime = MAX_TIME - currentTime;
      const delay = Math.min(50, remainingTime / (allExercises.length - current.length));
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const activations = calculateTotalActivations(current);
    const score = calculateScore(activations);

    if (score < bestScore) {
      bestScore = score;
      bestSolution = {
        exercises: [...current],
        totalActivations: {...activations}
      };
      // Show when we find a better solution
      if (onProgress) {
        onProgress([...current]);
      }
    }

    if (current.length >= 6 || score < 100) return;

    // Try adding exercises from different categories to ensure variety
    const categoriesSeen = new Set(current.map(ex => ex.category));
    
    for (let i = index; i < allExercises.length; i++) {
      const nextExercise = allExercises[i];
      if (!categoriesSeen.has(nextExercise.category) || current.length < 3) {
        await findCombination([...current, nextExercise], i + 1);
      }
    }
  }

  await findCombination([], 0);
  
  // Ensure final best solution is shown in progress
  if (onProgress) {
    onProgress(bestSolution.exercises);
  }
  
  return bestSolution;
}