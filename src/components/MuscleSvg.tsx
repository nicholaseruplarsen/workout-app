// src/components/MuscleSvg.tsx
'use client';

import { useEffect, useRef } from 'react';

// MuscleSvg.tsx
interface MuscleSvgProps {
  className?: string;
  svgContent: string;
}

export const MuscleSvg = ({ className = '', svgContent }: MuscleSvgProps) => {
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svgElement = svgRef.current.querySelector('svg');
      if (svgElement) {
        // Set dimensions
        svgElement.setAttribute('height', '650');
        const width = (900 * 676.49) / 1203.49;
        svgElement.setAttribute('width', width.toString());

        // Add interactivity to muscle groups
        const muscleGroups = svgElement.querySelectorAll('g[id]');
        muscleGroups.forEach((group) => {
          group.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'muscle-tooltip';
            tooltip.textContent = group.id
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
            document.body.appendChild(tooltip);

            const updateTooltipPosition = (e: MouseEvent) => {
              tooltip.style.left = `${e.pageX}px`;
              tooltip.style.top = `${e.pageY}px`;
            };

            updateTooltipPosition(e as MouseEvent);
            document.addEventListener('mousemove', updateTooltipPosition);

            group.addEventListener('mouseleave', () => {
              document.removeEventListener('mousemove', updateTooltipPosition);
              tooltip.remove();
            }, { once: true });
          });
        });
      }
    }
  }, []);

  return (
    <div 
      ref={svgRef} 
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
};