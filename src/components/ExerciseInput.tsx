// src/components/ExerciseInput.tsx
'use client';

import { useState } from 'react';

interface ExerciseInputProps {
  onExerciseSubmit: (exercise: string) => void;
}

export function ExerciseInput({ onExerciseSubmit }: ExerciseInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onExerciseSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter exercise (e.g. bicep curls)"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mw-red-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-mw-red-500 text-white rounded-md hover:bg-mw-red-700 transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}