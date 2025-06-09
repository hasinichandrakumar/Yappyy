import { useEffect, useRef } from "react";

interface YapUpLogoPNGProps {
  width?: number;
  height?: number;
  onReady?: (dataUrl: string) => void;
}

export default function YapUpLogoPNG({ width = 400, height = 120, onReady }: YapUpLogoPNGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear background with white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Create gradients
    const logoGradient = ctx.createLinearGradient(0, 0, width, 0);
    logoGradient.addColorStop(0, '#3B82F6');
    logoGradient.addColorStop(1, '#06B6D4');

    const iconGradient = ctx.createLinearGradient(0, 0, 80, 80);
    iconGradient.addColorStop(0, '#06B6D4');
    iconGradient.addColorStop(1, '#3B82F6');

    // Draw microphone icon
    const iconX = 20;
    const iconY = 30;

    // Microphone body
    ctx.fillStyle = iconGradient;
    ctx.beginPath();
    ctx.roundRect(iconX + 24, iconY + 16, 12, 32, 6);
    ctx.fill();

    // Microphone base
    ctx.beginPath();
    ctx.roundRect(iconX + 20, iconY + 52, 20, 8, 4);
    ctx.fill();

    // Microphone stand
    ctx.strokeStyle = iconGradient;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(iconX + 30, iconY + 60);
    ctx.lineTo(iconX + 30, iconY + 68);
    ctx.stroke();

    // Sound waves
    ctx.strokeStyle = iconGradient;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.8;
    
    // Wave 1
    ctx.beginPath();
    ctx.arc(iconX + 30, iconY + 32, 20, -Math.PI/3, Math.PI/3, false);
    ctx.stroke();

    ctx.globalAlpha = 0.6;
    // Wave 2
    ctx.beginPath();
    ctx.arc(iconX + 30, iconY + 32, 30, -Math.PI/3, Math.PI/3, false);
    ctx.stroke();

    ctx.globalAlpha = 0.4;
    // Wave 3
    ctx.beginPath();
    ctx.arc(iconX + 30, iconY + 32, 40, -Math.PI/3, Math.PI/3, false);
    ctx.stroke();

    ctx.globalAlpha = 1;

    // Draw text
    const textX = 130;
    const textY = 60;

    // YapUp text
    ctx.fillStyle = logoGradient;
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
    ctx.fillText('YapUp', textX, textY);

    // Tagline
    ctx.fillStyle = '#6B7280';
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Master Your Voice', textX, textY + 30);

    // Convert to PNG data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    if (onReady) {
      onReady(dataUrl);
    }

    // Auto-download functionality
    const link = document.createElement('a');
    link.download = 'yapup-logo.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }, [width, height, onReady]);

  return (
    <div className="text-center p-8">
      <canvas ref={canvasRef} className="border border-gray-200 rounded-lg shadow-lg" />
      <p className="mt-4 text-gray-600">YapUp logo exported as PNG - download started automatically</p>
    </div>
  );
}