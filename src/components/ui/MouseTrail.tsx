import { useEffect, useRef } from 'react';

interface TrailParticle {
  x: number;
  y: number;
  life: number;
  size: number;
}

export const MouseTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailParticle[]>([]);

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

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        trailRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          life: 1,
          size: Math.random() * 4 + 2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      trailRef.current = trailRef.current.filter((particle) => {
        particle.life -= 0.02;
        particle.y += Math.random() * 2;

        if (particle.life > 0) {
          const hue = (particle.life * 360) % 360;
          ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${particle.life * 0.5})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
          ctx.fill();

          // Add glow
          ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${particle.life * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          return true;
        }
        return false;
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="mouse-trail" />;
};
