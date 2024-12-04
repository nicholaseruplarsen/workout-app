import type { SavedExercise } from '@/types/exercise';

// src/utils/muscleActivations.ts
export const muscleGroups = [
  'neck', 'feet', 'groin', 'upper-trapezius', 'gastrocnemius',
  'tibialis', 'soleus', 'outer-quadricep', 'rectus-femoris',
  'inner-quadricep', 'inner-thigh', 'wrist-extensors', 'wrist-flexors',
  'long-head-bicep', 'short-head-bicep', 'obliques', 'upper-abdominals',
  'lower-abdominals', 'upper-pectoralis', 'mid-lower-pectoralis',
  'anterior-deltoid', 'lateral-deltoid', 'hands'
] as const;

export function initializeMuscleActivations() {
  return muscleGroups.reduce((acc, muscle) => {
    acc[muscle] = 0;
    return acc;
  }, {} as Record<string, number>);
}

export function calculateMuscleActivations(exercises: SavedExercise[]) {
  const activations = initializeMuscleActivations();

  exercises.forEach(exercise => {
    (Object.entries(exercise.muscleActivations) as [string, number][]).forEach(([muscle, activation]) => {
      activations[muscle] = Math.max(
        activations[muscle] || 0,
        activation
      );
    });
  });

  return activations;
}

export function getActivationColor(activation: number) {
  if (activation === 0) return '#EBEBEB';
  if (activation >= 80) return '#FF1A1A';
  if (activation >= 60) return '#FF4D4D';
  if (activation >= 40) return '#FF8080';
  if (activation >= 20) return '#FFB3B3';
  return '#FFE5E5';
}