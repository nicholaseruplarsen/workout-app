// src/components/MuscleSvg.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface MuscleSvgProps {
  className?: string;
  svgContent: string;
  muscleActivations: Record<string, number>;
  onReady?: () => void;
}

export const MuscleSvg = ({ 
  className = '', 
  svgContent, 
  muscleActivations,
  onReady 
}: MuscleSvgProps) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const [processedSvg, setProcessedSvg] = useState<string>('');

  useEffect(() => {
    if (!svgContent) return;

    // Create a temporary DOM element to process the SVG
    const temp = document.createElement('div');
    temp.innerHTML = svgContent;
    const svgElement = temp.querySelector('svg');
    
    if (svgElement) {
      // Set dimensions
      svgElement.setAttribute('height', '650');
      const width = (900 * 676.49) / 1203.49;
      svgElement.setAttribute('width', width.toString());
      
      // Apply colors to muscle groups
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

      // Store the processed SVG
      setProcessedSvg(temp.innerHTML);
    }
  }, [svgContent, muscleActivations]);

  useEffect(() => {
    if (!processedSvg || !svgRef.current) return;

    const svgElement = svgRef.current.querySelector('svg');
    if (svgElement) {
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

      // Signal that the SVG is ready
      requestAnimationFrame(() => {
        onReady?.();
      });
    }
  }, [processedSvg, muscleActivations, onReady]);

  const getActivationColor = (activation: number) => {
    if (activation >= 80) return '#FF1A1A';
    if (activation >= 60) return '#FF4D4D';
    if (activation >= 40) return '#FF8080';
    if (activation >= 20) return '#FFB3B3';
    return '#FFE5E5';
  };

  return (
    <div 
      ref={svgRef} 
      className={className}
      dangerouslySetInnerHTML={{ __html: processedSvg }} 
    />
  );
};