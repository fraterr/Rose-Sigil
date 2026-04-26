
import { useEffect, useRef } from 'react';
import type { Point } from '../logic/coordinates';
import { PETAL_COORDINATES } from '../logic/coordinates';

interface SigilCanvasProps {
  letters: string[];
  baseImageUrl: string;
}

export const SigilCanvas: React.FC<SigilCanvasProps> = ({ letters, baseImageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = baseImageUrl;
    img.onload = () => {
      // Clear and draw background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (letters.length === 0) return;

      // Draw Sigil
      ctx.beginPath();
      ctx.strokeStyle = '#000000'; // Dark lines for visibility on white background, 
                                   // or should it be glowy? User asked for clean.
                                   // The base image is white with black lines.
                                   // I'll use a deep red or gold for the sigil.
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const points = letters
        .map(l => PETAL_COORDINATES[l])
        .filter(p => !!p) as Point[];

      if (points.length === 0) return;

      // Map 1000x1000 coordinates to actual canvas size
      const mapPoint = (p: Point): Point => ({
        x: (p.x / 1000) * canvas.width,
        y: (p.y / 1000) * canvas.height
      });

      const mappedPoints = points.map(mapPoint);

      // Start circle
      const start = mappedPoints[0];
      ctx.beginPath();
      ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Draw lines
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < mappedPoints.length; i++) {
        ctx.lineTo(mappedPoints[i].x, mappedPoints[i].y);
      }
      ctx.stroke();

      // End bar
      const end = mappedPoints[mappedPoints.length - 1];
      const prev = mappedPoints[mappedPoints.length - 2] || { x: end.x, y: end.y - 10 };
      
      const dx = end.x - prev.x;
      const dy = end.y - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len;
      const ny = dx / len;
      
      const barHalfLen = 12;
      ctx.beginPath();
      ctx.moveTo(end.x + nx * barHalfLen, end.y + ny * barHalfLen);
      ctx.lineTo(end.x - nx * barHalfLen, end.y - ny * barHalfLen);
      ctx.stroke();
    };
  }, [letters, baseImageUrl]);

  return (
    <div className="canvas-container">
      <canvas 
        ref={canvasRef} 
        width={1000} 
        height={1000} 
        className="sigil-canvas"
      />
    </div>
  );
};
