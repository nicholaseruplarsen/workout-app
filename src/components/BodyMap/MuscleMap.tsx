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
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !svgContent) return;

    const container = svgRef.current;
    container.innerHTML = svgContent;
    const svgElement = container.querySelector('svg');
    
    if (!svgElement) return;

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

    const createTooltip = (muscleId: string, activation: number, x: number, y: number) => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }

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
      
      tooltip.style.position = 'fixed';
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      
      document.body.appendChild(tooltip);
      tooltipRef.current = tooltip;
    };

    const muscleGroups = svgElement.querySelectorAll('g[id]');
    muscleGroups.forEach(group => {
      // Fix the style type error by checking if it's an HTMLElement
      if (group instanceof HTMLElement) {
        group.style.cursor = 'pointer';
      }
      
      // Fix the mousemove event type error
      group.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const muscleId = group.id;
        const activation = muscleActivations[muscleId] || 0;
        createTooltip(muscleId, activation, mouseEvent.clientX + 10, mouseEvent.clientY - 10);
      });

      // Fix the mouseleave event type
      group.addEventListener('mouseleave', (_e: Event) => {
        if (tooltipRef.current) {
          tooltipRef.current.remove();
          tooltipRef.current = null;
        }
      });
    });

    setIsReady(true);

    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
      container.innerHTML = '';
    };
  }, [svgContent, muscleActivations]);

  return (
    <div 
      ref={svgRef}
      className={`bodymap-container ${isReady ? 'ready' : ''}`}
    />
  );
}