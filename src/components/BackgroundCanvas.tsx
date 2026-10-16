import React, { useEffect, useRef } from 'react';

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    const particleCount = 40;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Background gradient
      const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
      bgGradient.addColorStop(0, '#0a0a1a');
      bgGradient.addColorStop(1, '#08080a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Radial Glow from design
      const glowGrad = ctx.createRadialGradient(width * 0.8, height * 0.1, 0, width * 0.8, height * 0.1, width * 0.6);
      glowGrad.addColorStop(0, 'rgba(60, 80, 150, 0.15)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'white';
      particles.forEach((p) => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
      });

      // Subtle light beams
      ctx.globalAlpha = 0.03;
      const time = Date.now() * 0.0005;
      for (let i = 0; i < 3; i++) {
        const x = width * (0.5 + Math.sin(time + i) * 0.3);
        const grad = ctx.createLinearGradient(x, 0, x + width * 0.1, height);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x - 50, 0);
        ctx.lineTo(x + 50, 0);
        ctx.lineTo(x + 150, height);
        ctx.lineTo(x + 50, height);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', init);
    init();
    drawParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
};
