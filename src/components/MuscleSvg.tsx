'use client';

import { useEffect, useRef } from 'react';

interface MuscleSvgProps {
  activations: Record<string, number>;
  className?: string;
  svgContent: string;
}

export const MuscleSvg = ({ activations, className = '', svgContent }: MuscleSvgProps) => {
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getActivationClass = (activation: number) => {
      if (activation >= 80) return 'activation-100';
      if (activation >= 60) return 'activation-80';
      if (activation >= 40) return 'activation-60';
      if (activation >= 20) return 'activation-40';
      if (activation > 0) return 'activation-20';
      return 'activation-0';
    };

    if (svgRef.current) {
      const svgElement = svgRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.setAttribute('height', '650');
        // Optionally maintain aspect ratio
        const width = (900 * 676.49) / 1203.49;
        svgElement.setAttribute('width', width.toString());
      }
      if (svgElement) {
        Object.entries(activations).forEach(([muscle, activation]) => {
          const muscleGroup = svgElement.querySelector(`#${muscle}`);
          if (muscleGroup) {
            // Remove existing activation classes
            muscleGroup.classList.remove(
              'activation-0',
              'activation-20',
              'activation-40',
              'activation-60',
              'activation-80',
              'activation-100'
            );
            // Add new activation class
            muscleGroup.classList.add(getActivationClass(activation));
          }
        });
      }
    }
  }, [activations]);

  return (
    <div 
      ref={svgRef} 
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
};