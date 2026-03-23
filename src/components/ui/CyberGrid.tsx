import { useEffect, useRef } from 'react';

export const CyberGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const gridSize = 100;
    const spacing = 60;
    let rotation = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      rotation += 0.02;

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
      ctx.lineWidth = 1;

      for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
          const x1 = x * spacing;
          const y1 = y * spacing;
          const x2 = (x + 1) * spacing;
          const y3 = (y + 1) * spacing;

          // Apply perspective
          const scale = 500 / (500 + y1);
          const perspectiveY1 = y1 * scale;
          const perspectiveY3 = y3 * scale;

          // Horizontal lines
          ctx.beginPath();
          ctx.moveTo(x1 * scale, perspectiveY1);
          ctx.lineTo(x2 * scale, perspectiveY1);
          ctx.stroke();

          // Vertical lines
          ctx.beginPath();
          ctx.moveTo(x1 * scale, perspectiveY1);
          ctx.lineTo(x1 * scale, perspectiveY3);
          ctx.stroke();

          // Add cyan glow at intersections
          if (x % 2 === 0 && y % 2 === 0) {
            ctx.fillStyle = `rgba(0, 255, 136, ${0.3 * scale})`;
            ctx.beginPath();
            ctx.arc(x1 * scale, perspectiveY1, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="cyber-grid" />;
};
