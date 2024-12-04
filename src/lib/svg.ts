import fs from 'fs/promises';
import path from 'path';

export async function getSvgContent() {
  const svgContent = await fs.readFile(
    path.join(process.cwd(), 'src/assets/musclewiki.svg'), 
    'utf-8'
  );
  return svgContent;
}