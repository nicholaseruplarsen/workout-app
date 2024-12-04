// src/components/MuscleSvg.tsx
'use client';

import { useEffect, useRef } from 'react';

interface MuscleSvgProps {
  className?: string;
  svgContent: string;
  muscleActivations: Record<string, number>;
}

export const MuscleSvg = ({ className = '', svgContent, muscleActivations }: MuscleSvgProps) => {
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
            const muscleId = group.id;
            const activation = muscleActivations[muscleId] || 0;

            const tooltip = document.createElement('div');
            tooltip.className = 'muscle-tooltip';
            tooltip.innerHTML = `
              <div class="font-semibold">
                ${muscleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div class="text-sm opacity-80">
                Activation: ${Math.round(activation)}%
              </div>
            `;
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
  }, [muscleActivations]);

  return (
    <div 
      ref={svgRef} 
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
};