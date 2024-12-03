// In Controls.tsx
'use client';

interface ControlsProps {
  muscleActivations: Record<string, number>;
}

export default function Controls({ muscleActivations }: ControlsProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4 text-center">Muscle Activations</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(muscleActivations).map(([muscle, activation]) => (
          <div 
            key={muscle} 
            className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <span className="capitalize">{muscle.replace(/-/g, ' ')}</span>
            <span className="font-mono font-semibold">
              {Math.round(activation)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}