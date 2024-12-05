// src/components/BodyMap/OptimizationProgress.tsx
import { Exercise } from '@/types/exercise';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizationProgressProps {
  combination: Exercise[];
  isOptimizing: boolean;
}

export function OptimizationProgress({ combination, isOptimizing }: OptimizationProgressProps) {
  if (!isOptimizing) return null;

  return (
    <div className="fixed top-16 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-4">
      <div className="text-white font-medium mb-2">
        Testing combinations...
      </div>
      
      {/* Loading bar */}
      <div className="w-full h-0.5 bg-white/10 mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }}
        />
      </div>

      {/* Exercise list */}
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {combination.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.1,
                delay: index * 0.1 // Stagger the animations
              }}
              className="text-white/90 text-sm"
            >
              {exercise.name}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}