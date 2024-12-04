// src/components/BodyMap/MuscleMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { getActivationColor } from '@/utils/muscleActivations';

interface MuscleMapProps {
  svgContent: string;
  muscleActivations: Record<string, number>;
}

export function MuscleMap({ svgContent, muscleActivations }: MuscleMapProps) {
  const svgRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [processedSvg, setProcessedSvg] = useState('');

  useEffect(() => {
    if (!svgContent) return;

    const temp = document.createElement('div');
    temp.innerHTML = svgContent;
    const svgElement = temp.querySelector('svg');
    
    if (svgElement) {
      svgElement.setAttribute('height', '650');
      const width = (900 * 676.49) / 1203.49;
      svgElement.setAttribute('width', width.toString());
      
      Object.entries(muscleActivations).forEach(([muscleId, activation]) => {
        const group = svgElement.getElementById(muscleId);
        if (group) {
          const paths = group.getElementsByTagName('path');
          Array.from(paths).forEach(path => {
            if (path.getAttribute('fill') !== 'none') {
              path.setAttribute('fill', getActivationColor(activation));
            }
          });
        }
      });

      setProcessedSvg(temp.innerHTML);
    }
  }, [svgContent, muscleActivations]);

  useEffect(() => {
    if (!processedSvg || !svgRef.current) return;

    const svgElement = svgRef.current.querySelector('svg');
    if (svgElement) {
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

      setIsReady(true);
    }
  }, [processedSvg, muscleActivations]);

  return (
    <div 
      ref={svgRef}
      className={`bodymap-container ${isReady ? 'ready' : ''}`}
      dangerouslySetInnerHTML={{ __html: processedSvg }}
    />
  );
}