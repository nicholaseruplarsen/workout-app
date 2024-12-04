// src/components/BodyMap/ExerciseList.tsx
'use client';

import { SavedExercise } from '@/types/exercise';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseListProps {
  exercises: SavedExercise[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ExerciseList({ exercises, onToggle, onRemove }: ExerciseListProps) {
  return (
    <div className="flex-1 bg-gray-900 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-white">Saved Exercises</h2>
      <AnimatePresence>
        {exercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center gap-2 bg-gray-800 p-2 rounded mb-2"
          >
            <input
              type="checkbox"
              checked={exercise.completed}
              onChange={() => onToggle(exercise.id)}
              className="w-5 h-5 accent-mw-red-500"
            />
            <span className={`text-white ${exercise.completed ? 'line-through' : ''}`}>
              {exercise.name}
            </span>
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