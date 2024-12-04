// src/components/musclewiki-svg.tsx
import MuscleWikiSvg from '../assets/musclewiki.svg'

interface MuscleSvgProps {
  activations: Record<string, number>;
}

const getActivationClass = (activation: number) => {
  if (activation >= 80) return 'activation-100';
  if (activation >= 60) return 'activation-80';
  if (activation >= 40) return 'activation-60';
  if (activation >= 20) return 'activation-40';
  if (activation > 0) return 'activation-20';
  return 'activation-0';
};

export const MuscleSvg = ({ activations }: MuscleSvgProps) => {
  return (
    <div className="relative">
      <object
        data={MuscleWikiSvg}
        type="image/svg+xml"
        className="w-full h-auto"
        onLoad={(e) => {
          const svgDoc = (e.target as HTMLObjectElement).contentDocument;
          if (svgDoc) {
            Object.entries(activations).forEach(([muscle, activation]) => {
              const element = svgDoc.getElementById(muscle);
              if (element) {
                // Remove existing activation classes
                element.classList.remove(
                  'activation-0',
                  'activation-20',
                  'activation-40',
                  'activation-60',
                  'activation-80',
                  'activation-100'
                );
                // Add new activation class
                element.classList.add(getActivationClass(activation));
              }
            });
          }
        }}
      />
    </div>
  );
};