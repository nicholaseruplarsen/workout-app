// src/components/ExerciseList.tsx
'use client';

import { SavedExercise } from '@/types/exercise';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseListProps {
  exercises: SavedExercise[];
  onExerciseToggle: (id: string) => void;
  onExerciseDelete: (id: string) => void;
}

export function ExerciseList({ exercises, onExerciseToggle, onExerciseDelete }: ExerciseListProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence>
        {exercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center gap-4 p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <input
              type="checkbox"
              checked={exercise.completed}
              onChange={() => onExerciseToggle(exercise.id)}
              className="w-5 h-5 accent-mw-red-500"
            />
            <span className={exercise.completed ? 'line-through text-gray-500' : ''}>
              {exercise.name}
            </span>
            <button
              onClick={() => onExerciseDelete(exercise.id)}
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