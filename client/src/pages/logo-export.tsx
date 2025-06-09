import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Check } from "lucide-react";

export default function LogoExport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    generateLogo();
  }, []);

  const generateLogo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 120;

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
    setDataUrl(dataUrl);
    setIsReady(true);
  };

  const downloadLogo = () => {
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = 'yapup-logo.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadIcon = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Clear background with white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // Create gradient
    const iconGradient = ctx.createLinearGradient(0, 0, size, size);
    iconGradient.addColorStop(0, '#06B6D4');
    iconGradient.addColorStop(1, '#3B82F6');

    // Center the icon
    const iconX = size / 2 - 30;
    const iconY = size / 2 - 40;

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

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'yapup-icon.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>YapUp Logo Export</CardTitle>
            <p className="text-gray-600">Download the YapUp logo in PNG format</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <canvas 
                ref={canvasRef} 
                className="border border-gray-200 rounded-lg shadow-lg bg-white" 
              />
            </div>

            {isReady && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={downloadLogo} className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Full Logo</span>
                </Button>
                <Button variant="outline" onClick={downloadIcon} className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Icon Only</span>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Logo Specifications</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <ul className="space-y-1">
                    <li><Check className="w-4 h-4 inline mr-2 text-green-500" />Size: 400x120 pixels</li>
                    <li><Check className="w-4 h-4 inline mr-2 text-green-500" />Format: PNG with transparency</li>
                    <li><Check className="w-4 h-4 inline mr-2 text-green-500" />Colors: Blue to Cyan gradient</li>
                    <li><Check className="w-4 h-4 inline mr-2 text-green-500" />High DPI ready</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Usage Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <ul className="space-y-1">
                    <li><Check className="w-4 h-4 inline mr-2 text-green-500" />Maintain aspect ratio</li>
                    <li><Check className="w-4 h-4 inline mr-2 text-green-500" />Use on light backgrounds</li>
                    <li><Check className="w-4 h-4 inline mr-2 text-green-500" />Minimum width: 100px</li>
                    <li><Check className="w-4 h-4 inline mr-2 text-green-500" />Clear space around logo</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}