// src/components/DynamicMuscleSvg.tsx
import { SVGProps } from 'react';
import MuscleWikiSvg from '../assets/musclewiki.svg';

interface DynamicMuscleSvgProps extends SVGProps<SVGSVGElement> {
  activations: Record<string, number>;
}

export const DynamicMuscleSvg = ({ activations, ...props }: DynamicMuscleSvgProps) => {
  const getColor = (activation: number) => {
    if (activation >= 80) return '#FF1A1A';
    if (activation >= 60) return '#FF4D4D';
    if (activation >= 40) return '#FF8080';
    if (activation >= 20) return '#FFB3B3';
    if (activation > 0) return '#FFE5E5';
    return '#EBEBEB';
  };

  return (
    <MuscleWikiSvg
      {...props}
      ref={(ref: SVGSVGElement | null) => {
        if (ref) {
          Object.entries(activations).forEach(([muscle, activation]) => {
            const element = ref.getElementById(muscle);
            if (element) {
              const paths = element.getElementsByTagName('path');
              Array.from(paths).forEach(path => {
                path.style.fill = getColor(activation);
              });
            }
          });
        }
      }}
    />
  );
};