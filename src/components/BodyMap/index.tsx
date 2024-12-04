// src/components/BodyMap/index.tsx
'use client';

import { ExerciseSearch } from './ExerciseSearch';
import { MuscleMap } from './MuscleMap';
import { ExerciseList } from './ExerciseList';
import { useExercises } from '@/hooks/useExercises';
import { useMuscleActivations } from '@/hooks/useMuscleActivations';
import './styles.css';

interface BodyMapProps {
  svgContent: string;
}

export default function BodyMap({ svgContent }: BodyMapProps) {
  const { 
    savedExercises, 
    addExercise, 
    toggleExercise, 
    removeExercise 
  } = useExercises();
  
  const muscleActivations = useMuscleActivations(savedExercises);

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <ExerciseSearch onExerciseAdd={addExercise} />

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        <MuscleMap
          svgContent={svgContent}
          muscleActivations={muscleActivations}
        />

        {savedExercises.length > 0 && (
          <ExerciseList
            exercises={savedExercises}
            onToggle={toggleExercise}
            onRemove={removeExercise}
          />
        )}
      </div>
    </div>
  );
}