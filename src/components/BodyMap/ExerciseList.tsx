// src/components/BodyMap/ExerciseList.tsx
'use client';

import { SavedExercise } from '@/types/exercise';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseListProps {
  exercises: SavedExercise[];
  onRemove: (id: string) => void;
}

export function ExerciseList({ exercises, onRemove }: ExerciseListProps) {
  return (
    <div className="backdrop-blur-sm p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-white">Saved Exercises</h2>
      <AnimatePresence>
        {exercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center gap-2 p-2 rounded mb-2"
          >
            <span className="text-white">{exercise.name}</span>
            <button
              onClick={() => onRemove(exercise.id)}
              className="ml-auto text-gray-400 hover:text-mw-red-500"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
