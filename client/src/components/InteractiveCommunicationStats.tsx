import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function InteractiveCommunicationStats() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const stats = [
    {
      percentage: '7%',
      title: 'Spoken Words',
      description: 'Only 7% of communication impact comes from the actual words you speak',
      color: 'blue'
    },
    {
      percentage: '38%',
      title: 'Tone of Voice',
      description: '38% comes from your vocal delivery, pace, volume, and inflection',
      color: 'blue'
    },
    {
      percentage: '55%',
      title: 'Body Language',
      description: '55% of your message impact comes from posture, gestures, and eye contact',
      color: 'blue'
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8 overflow-hidden"
    >
      {/* Floating cursor effect */}
      <div 
        className="absolute w-32 h-32 bg-blue-200 rounded-full opacity-20 pointer-events-none transition-all duration-300 ease-out blur-xl"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          transform: `scale(${hoveredCard !== null ? 1.5 : 1})`
        }}
      />
      
      {/* Secondary cursor ripple effect */}
      <div 
        className="absolute w-16 h-16 bg-cyan-300 rounded-full opacity-30 pointer-events-none transition-all duration-500 ease-out blur-md"
        style={{
          left: mousePosition.x - 32,
          top: mousePosition.y - 32,
          transform: `scale(${hoveredCard !== null ? 2 : 0.8})`,
          animationDelay: '100ms'
        }}
      />
      
      {/* Additional floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-pulse"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 5)}%`,
              animationDelay: `${i * 0.5}s`,
              transform: hoveredCard !== null ? 'scale(1.5)' : 'scale(1)',
              transition: 'transform 0.3s ease'
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Communication Impact Breakdown
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding how different elements contribute to effective communication
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`p-8 text-center transition-all duration-300 cursor-pointer group relative overflow-hidden
                ${hoveredCard === index 
                  ? 'shadow-2xl scale-105 bg-white border-blue-200' 
                  : 'shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm'
                }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity duration-300 ${hoveredCard === index ? 'opacity-100' : ''}`} />
              
              <div className="relative z-10">
                <div className={`text-6xl font-extrabold mb-4 transition-all duration-300 ${
                  hoveredCard === index ? 'text-blue-600 scale-110' : 'text-blue-500'
                }`}>
                  {stat.percentage}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {stat.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>

              {/* Interactive corner decoration */}
              <div className={`absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full transition-all duration-300 ${
                hoveredCard === index ? 'scale-150 bg-blue-600' : ''
              }`} />
            </Card>
          ))}
        </div>

        {/* Central Circle */}
        <div className="flex justify-center">
          <div 
            className={`relative w-80 h-80 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center transition-all duration-500 cursor-pointer group ${
              hoveredCard !== null ? 'scale-110 shadow-blue-200' : ''
            }`}
            onMouseEnter={() => setHoveredCard(-1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Animated ring */}
            <div className={`absolute inset-0 rounded-full border-4 border-blue-200 transition-all duration-500 ${
              hoveredCard === -1 ? 'border-blue-400 scale-105' : ''
            }`} />
            
            <div className="text-center relative z-10">
              <p className="text-lg font-semibold text-gray-700 mb-2">We coach</p>
              <div className={`text-7xl font-extrabold text-blue-600 mb-2 transition-all duration-300 ${
                hoveredCard === -1 ? 'scale-110' : ''
              }`}>
                100%
              </div>
              <p className="text-lg font-semibold text-gray-900">of you</p>
            </div>

            {/* Pulsing dots around circle */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 bg-blue-400 rounded-full transition-all duration-300 ${
                  hoveredCard === -1 ? 'scale-150 bg-blue-600' : ''
                }`}
                style={{
                  transform: `rotate(${i * 60}deg) translateY(-200px)`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom description */}
        <div className="text-center mt-12">
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            Our AI coaching system analyzes and improves all aspects of your communication - 
            from word choice and vocal delivery to body language and presence.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105">
                Start Practicing
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg transition-all duration-300 hover:scale-105">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}