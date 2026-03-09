"use client";

import { useEffect, useRef } from "react";

export interface OrbitsBackgroundProps {
  className?: string;
  count?: number;
  color?: string;
  speed?: number;
}

interface Orbit {
  radius: number;
  tiltX: number;
  tiltY: number;
  rotationSpeed: number;
  particles: { angle: number; size: number }[];
  opacity: number;
  lineWidth: number;
}

export function OrbitsBackground({
  className,
  count = 5,
  color = "#6b7280",
  speed = 1,
}: OrbitsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let animationId: number;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : { r: 107, g: 114, b: 128 };
    };

    const rgb = hexToRgb(color);

    const createOrbits = (): Orbit[] => {
      const minDim = Math.min(width, height);
      const orbits: Orbit[] = [];

      for (let i = 0; i < count; i++) {
        const particleCount = 1 + Math.floor(Math.random() * 2);
        const particles = Array.from({ length: particleCount }, () => ({
          angle: Math.random() * Math.PI * 2,
          size: 1.5 + Math.random() * 1.5,
        }));

        orbits.push({
          radius: minDim * (0.15 + (i / count) * 0.35),
          tiltX: 0.3 + Math.random() * 0.5,
          tiltY: Math.random() * 0.3,
          rotationSpeed:
            (0.003 + Math.random() * 0.005) *
            (Math.random() > 0.5 ? 1 : -1) *
            speed,
          particles,
          opacity: 0.15 + (i / count) * 0.25,
          lineWidth: 0.5 + (i / count) * 0.8,
        });
      }

      return orbits;
    };

    let orbits = createOrbits();

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      orbits = createOrbits();
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    const cx = () => width / 2;
    const cy = () => height / 2;

    const drawOrbit = (orbit: Orbit) => {
      ctx.beginPath();
      ctx.ellipse(cx(), cy(), orbit.radius, orbit.radius * orbit.tiltX, orbit.tiltY, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${orbit.opacity})`;
      ctx.lineWidth = orbit.lineWidth;
      ctx.stroke();
    };

    const drawParticle = (orbit: Orbit, particle: { angle: number; size: number }) => {
      const x =
        cx() +
        Math.cos(particle.angle) * orbit.radius * Math.cos(orbit.tiltY) -
        Math.sin(particle.angle) * orbit.radius * orbit.tiltX * Math.sin(orbit.tiltY);
      const y =
        cy() +
        Math.cos(particle.angle) * orbit.radius * Math.sin(orbit.tiltY) +
        Math.sin(particle.angle) * orbit.radius * orbit.tiltX * Math.cos(orbit.tiltY);

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 5);
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`);
      gradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, particle.size * 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`;
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Center glow
      const centerGradient = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), 40);
      centerGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
      centerGradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
      centerGradient.addColorStop(1, "transparent");
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(cx(), cy(), 40, 0, Math.PI * 2);
      ctx.fill();

      // Center dot
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
      ctx.beginPath();
      ctx.arc(cx(), cy(), 3, 0, Math.PI * 2);
      ctx.fill();

      for (const orbit of orbits) {
        drawOrbit(orbit);
        for (const particle of orbit.particles) {
          particle.angle += orbit.rotationSpeed;
          drawParticle(orbit, particle);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [count, color, speed]);

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

export default OrbitsBackground;
