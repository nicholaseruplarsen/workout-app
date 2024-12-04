// src/app/page.tsx
import { getSvgContent } from '@/lib/svg';
import BodyMap from '@/components/BodyMap';

export default async function Home() {
  const svgContent = await getSvgContent();

  return (
    <main className="min-h-screen">
      <BodyMap svgContent={svgContent} />
    </main>
  );
}