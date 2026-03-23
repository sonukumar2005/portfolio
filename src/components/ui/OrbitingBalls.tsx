import { useEffect, useRef } from 'react';

interface Orb {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  color: string;
}

export const OrbitingBalls: React.FC = () => {
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

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const orbs: Orb[] = [
      { angle: 0, distance: 150, speed: 0.003, size: 4, color: '#00ff88' },
      { angle: Math.PI / 2, distance: 150, speed: 0.003, size: 4, color: '#0088ff' },
      { angle: Math.PI, distance: 150, speed: 0.003, size: 4, color: '#ff0080' },
      { angle: (3 * Math.PI) / 2, distance: 150, speed: 0.003, size: 4, color: '#ffaa00' },
      { angle: 0, distance: 100, speed: -0.005, size: 3, color: '#00ffff' },
      { angle: Math.PI, distance: 100, speed: -0.005, size: 3, color: '#ff00ff' },
    ];

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw center dot
      ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
      ctx.fill();

      orbs.forEach((orb) => {
        orb.angle += orb.speed;

        const x = centerX + orb.distance * Math.cos(orb.angle);
        const y = centerY + orb.distance * Math.sin(orb.angle);

        // Draw orbit line
        ctx.strokeStyle = `rgba(0, 255, 136, 0.1)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orb.distance, 0, Math.PI * 2);
        ctx.stroke();

        // Draw orb with glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, orb.size * 2);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, orb.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.arc(x, y, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="orbiting-balls" />;
};
