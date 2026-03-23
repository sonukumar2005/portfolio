import { useEffect, useRef } from 'react';

export const GlitchEffect: React.FC = () => {
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

    let time = 0;
    const glitchLines = Array.from({ length: 15 }, () => ({
      y: Math.random() * canvas.height,
      height: Math.random() * 20 + 5,
      noise: Math.random() * 0.5,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.03)';

      // Random glitch lines
      glitchLines.forEach((line) => {
        if (Math.random() > 0.95) {
          const offsetX = (Math.random() - 0.5) * 50;
          ctx.fillRect(
            offsetX,
            line.y + Math.sin(time * 0.1) * 10,
            canvas.width - offsetX,
            line.height
          );
        }
      });

      // Scan lines effect
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillStyle = `rgba(0, 255, 136, ${Math.random() * 0.02})`;
        ctx.fillRect(0, i, canvas.width, 2);
      }

      // RGB shift effect
      ctx.strokeStyle = 'rgba(255, 0, 128, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const offset = Math.sin(time * 0.05 + i) * 3;
        ctx.strokeRect(
          offset,
          offset,
          canvas.width - offset * 2,
          canvas.height - offset * 2
        );
      }

      time++;
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="glitch-effect" />;
};
