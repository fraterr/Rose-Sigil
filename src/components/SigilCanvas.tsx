
import { useEffect, useRef, useState } from 'react';
import { PETAL_COORDINATES } from '../logic/coordinates';
import type { SigilLetter } from '../logic/transliteration';

interface SigilCanvasProps {
  letters: SigilLetter[];
  baseImageUrl: string;
  isGenerating: boolean;
  onGenerationComplete?: () => void;
}

export const SigilCanvas: React.FC<SigilCanvasProps> = ({ 
  letters, 
  baseImageUrl, 
  isGenerating,
  onGenerationComplete 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      setProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += 0.008; // Slower increment for ritual feeling
        if (p >= 1) {
          p = 1;
          clearInterval(interval);
          onGenerationComplete?.();
        }
        setProgress(p);
      }, 25); // Faster interval (40fps) for smoothness
      return () => clearInterval(interval);
    } else if (letters.length === 0) {
      setProgress(0);
    } else {
      setProgress(1);
    }
  }, [isGenerating, letters.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = baseImageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Removed ctx.drawImage to allow transparent export
      
      if (letters.length === 0 || progress === 0) return;

      const mappedPoints = letters
        .map(l => ({ ...PETAL_COORDINATES[l.char], isDouble: l.isDouble }))
        .filter(p => !!p.x)
        .map(p => ({
          x: (p.x / 1000) * canvas.width,
          y: (p.y / 1000) * canvas.height,
          isDouble: p.isDouble
        }));

      if (mappedPoints.length === 0) return;

      // Premium Gold Style
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 8;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';

      // 1. Draw Start Circle
      const start = mappedPoints[0];
      ctx.beginPath();
      ctx.arc(start.x, start.y, 10, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Draw Lines with Progress
      const totalSteps = mappedPoints.length - 1;
      const currentStep = progress * totalSteps;

      for (let i = 0; i < totalSteps; i++) {
        if (i > currentStep) break;

        const p1 = mappedPoints[i];
        const p2 = mappedPoints[i + 1];
        
        const stepProgress = Math.min(1, currentStep - i);
        const targetX = p1.x + (p2.x - p1.x) * stepProgress;
        const targetY = p1.y + (p2.y - p1.y) * stepProgress;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
      }

      // 3. Draw End Bar if complete
      if (progress === 1) {
        const end = mappedPoints[mappedPoints.length - 1];
        const lastP = mappedPoints[mappedPoints.length - 2] || { x: end.x, y: end.y - 10 };
        
        const dx = end.x - lastP.x;
        const dy = end.y - lastP.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        
        const barHalfLen = 15;
        ctx.beginPath();
        ctx.moveTo(end.x + nx * barHalfLen, end.y + ny * barHalfLen);
        ctx.lineTo(end.x - nx * barHalfLen, end.y - ny * barHalfLen);
        ctx.stroke();
      }
    };
  }, [letters, progress, baseImageUrl]);

  return (
    <div className="canvas-container" style={{ 
      backgroundImage: `url(${baseImageUrl})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <canvas 
        ref={canvasRef} 
        width={1000} 
        height={1000} 
        className="sigil-canvas"
      />
    </div>
  );
};
