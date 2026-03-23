import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  opacity: number;
  vz: number;
}

export const StarField: React.FC = () => {
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

    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      z: Math.random() * 1000,
      radius: Math.random() * 2,
      opacity: Math.random() * 0.8 + 0.2,
      vz: Math.random() * 5 + 2,
    }));

    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(10, 10, 20, 0.1)');
      gradient.addColorStop(0.5, 'rgba(10, 10, 30, 0.05)');
      gradient.addColorStop(1, 'rgba(20, 10, 30, 0.1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.z -= star.vz;

        if (star.z <= 0) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        // Perspective projection
        const scale = 1000 / (1000 + star.z);
        const x2d = centerX + star.x * scale;
        const y2d = centerY + star.y * scale;

        // Only draw if on screen
        if (x2d > 0 && x2d < canvas.width && y2d > 0 && y2d < canvas.height) {
          const size = star.radius * scale;
          const alpha = star.opacity * (1 - star.z / 1000);

          // Draw star with glow
          const glowGradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 3);
          glowGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.6})`);
          glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(x2d, y2d, size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Draw core
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x2d, y2d, Math.max(0.5, size), 0, Math.PI * 2);
          ctx.fill();

          // Draw tail for closer stars
          if (star.z < 500) {
            ctx.strokeStyle = `rgba(100, 150, 255, ${alpha * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(x2d + (centerX - x2d) * 0.1, y2d + (centerY - y2d) * 0.1);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="starfield" />;
};
