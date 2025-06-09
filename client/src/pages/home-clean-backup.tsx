import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Mic, 
  Brain, 
  TrendingUp, 
  PlayCircle, 
  Eye,
  Volume2,
  BarChart3,
  Sparkles,
  Bot,
  Lightbulb,
  Globe
} from "lucide-react";
import yapUpLogo from "@assets/YapUp-2_1749483329460.png";

export default function Home() {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const isHeroInView = useInView(heroRef);
  const isFeaturesInView = useInView(featuresRef);

  const handleStartPracticing = () => {
    window.location.href = "/api/auth/google";
  };

  const advancedFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Speech Intelligence",
      description: "Advanced neural networks analyze your vocal patterns, speech rhythm, and emotional delivery in real-time",
      stats: "95% accuracy in identifying improvement areas",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Eye,
      title: "Computer Vision Body Language",
      description: "Real-time posture tracking, gesture analysis, and eye contact monitoring using advanced computer vision",
      stats: "Track 50+ body language metrics simultaneously",
      color: "from-blue-500 to-[#0BF9EA]"
    },
    {
      icon: Bot,
      title: "Personalized AI Coach",
      description: "Your dedicated AI speaking coach adapts to your learning style and provides contextual feedback",
      stats: "Customized coaching for 10,000+ speech patterns",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Performance Analytics",
      description: "Deep insights into your speaking trends, progress tracking, and predictive improvement forecasting",
      stats: "Analyze 25+ speaking dimensions",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Lightbulb,
      title: "Smart Content Enhancement",
      description: "AI-powered content suggestions, structure optimization, and persuasion technique recommendations",
      stats: "Increase speech impact by 40%",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Cultural Communication Adaptation",
      description: "Adapt your speaking style for global audiences with cultural context awareness and regional communication preferences",
      stats: "Support for 25+ cultural communication styles",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const metrics = [
    { icon: Eye, label: "Eye Contact", value: "Real-time tracking" },
    { icon: Volume2, label: "Voice Clarity", value: "AI-powered analysis" },
    { icon: TrendingUp, label: "Speaking Pace", value: "Optimal WPM guidance" },
    { icon: Brain, label: "Confidence Score", value: "Live assessment" }
  ];

  return (
    <div className="min-h-screen gradient-bg-light">

      {/* Navigation */}
      <motion.nav 
        className="gradient-card backdrop-blur-md shadow-lg purple-border sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    "0 0 20px hsla(180, 85%, 60%, 0.3)",
                    "0 0 40px hsla(180, 85%, 60%, 0.5)",
                    "0 0 20px hsla(180, 85%, 60%, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.img
                  src={yapUpLogo}
                  alt="YapUp Logo"
                  className="w-10 h-10 rounded-xl"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <h1 className="text-xl font-bold yapup-gradient">
                YapUp
              </h1>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartPracticing}
              >
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  Sign In
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartPracticing}
              >
                <Button className="gradient-bg text-white hover:opacity-90 shadow-lg purple-glow">
                  Start Practicing
                  <PlayCircle className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-cyan-500/10 text-cyan-600 border-cyan-500/20 px-4 py-2 flex items-center justify-center">
              <motion.div
                className="flex items-center justify-center mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              Powered by GPT-4 Turbo & MediaPipe Neural Networks
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="mb-8 tracking-tight text-balance"
            initial={{ y: 100, opacity: 0 }}
            animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.span 
              className="block hero-title floating-text yapup-gradient"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              YapUp
            </motion.span>
            <motion.span 
              className="hero-subtitle block mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              Master Your <span className="highlight-word">Public Speaking</span>
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="creative-text mb-8 max-w-3xl mx-auto text-balance"
            initial={{ y: 50, opacity: 0 }}
            animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Transform your presentation skills with <span className="highlight-word">AI-powered</span> real-time feedback, intelligent coaching, 
            and personalized improvement plans tailored to your <span className="highlight-word">speaking goals</span>.
          </motion.p>
          
          <motion.div 
            className="mb-12 p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-[#0BF9EA]/20 max-w-3xl mx-auto purple-glow"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isHeroInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center">
              <div className="grid grid-cols-3 gap-8 mb-4">
                {[
                  { value: "55%", label: "Body Language" },
                  { value: "38%", label: "Tone of Voice" },
                  { value: "7%", label: "Words" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  >
                    <motion.div 
                      className="text-3xl font-display gradient-text mb-1"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              <div className="border-t border-[#0BF9EA]/20 pt-6">
                <motion.h2 
                  className="text-4xl md:text-5xl font-display gradient-text tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={isHeroInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 1.5 }}
                >
                  We coach 100% of you.
                </motion.h2>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 10px 30px rgba(6, 182, 212, 0.3)",
                  "0 20px 60px rgba(6, 182, 212, 0.4)",
                  "0 10px 30px rgba(6, 182, 212, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={handleStartPracticing}
            >
              <Button size="lg" className="gradient-bg text-white hover:opacity-90 shadow-xl px-8 py-4 text-lg font-semibold tracking-wide purple-glow">
                Start Your Free Session
                <PlayCircle className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Real-time Metrics Preview */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ y: 100, opacity: 0 }}
            animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.4 }}
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={isHeroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#0BF9EA] to-blue-600 rounded-full flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, delay: index * 0.5 }
                      }}
                    >
                      <metric.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="font-semibold text-gray-900 mb-1">{metric.label}</h3>
                    <p className="text-sm text-gray-600">{metric.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        className="py-20 bg-white/50 backdrop-blur-sm relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            animate={isFeaturesInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="feature-title mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              Advanced <span className="highlight-word">AI-Powered</span> Features
            </motion.h2>
            <motion.p 
              className="creative-text max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isFeaturesInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Our <span className="highlight-word">intelligent coaching</span> system provides comprehensive feedback across every aspect of your presentation.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 100, opacity: 0, scale: 0.8 }}
                animate={isFeaturesInView ? { y: 0, opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  type: "spring",
                  bounce: 0.4
                }}
                whileHover={{ 
                  y: -20, 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                onMouseEnter={() => setIsHovered(feature.title)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 relative">
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-15 transition-opacity duration-500`}
                      animate={isHovered === feature.title ? { opacity: 0.15 } : { opacity: 0.05 }}
                    />
                    <motion.div 
                      className={`w-16 h-16 mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg relative z-10`}
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: isHovered === feature.title ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        rotate: { duration: 2, repeat: Infinity },
                        scale: { duration: 0.3 }
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4 relative z-10">{feature.description}</p>
                    <motion.div 
                      className="space-y-2 relative z-10"
                      initial={{ opacity: 0.7 }}
                      animate={isHovered === feature.title ? { opacity: 1 } : { opacity: 0.7 }}
                    >
                      <Badge className="bg-white/10 text-gray-700 border-gray-300">
                        {feature.stats}
                      </Badge>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6 floating-text">
            Ready to Transform Your <span className="bg-white/20 px-3 py-1 rounded-lg">Speaking Skills</span>?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Join thousands of speakers who have improved their presentation skills with our <span className="bg-white/20 px-2 py-1 rounded">AI-powered coaching</span> platform.
          </p>
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartPracticing}
          >
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl px-12 py-4 text-lg font-semibold">
              Start Your Journey
              <PlayCircle className="w-5 h-5 ml-3" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src={yapUpLogo}
            alt="YapUp Logo"
            className="w-16 h-16 mx-auto mb-6 rounded-lg"
          />
          <p className="text-gray-400 mb-6">
            Empowering speakers worldwide with AI-powered intelligent feedback and coaching.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}