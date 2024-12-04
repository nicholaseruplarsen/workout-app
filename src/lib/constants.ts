// src/lib/constants.ts
export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;
export type Difficulty = typeof DIFFICULTIES[number];

export const CATEGORIES = ['arms', 'legs', 'chest', 'back', 'core'] as const;
export type Category = typeof CATEGORIES[number];

export const EQUIPMENT = [
  'dumbbells',
  'barbell',
  'cable',
  'bodyweight',
  'machine',
  'resistance bands'
] as const;
export type Equipment = typeof EQUIPMENT[number];