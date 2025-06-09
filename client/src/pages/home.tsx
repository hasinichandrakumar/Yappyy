import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Mic, 
  Video, 
  Brain, 
  TrendingUp, 
  Users, 
  Award, 
  PlayCircle, 
  MessageCircle,
  Eye,
  Volume2,
  BarChart3,
  Sparkles,
  Bot,
  Zap,
  Waves,
  ArrowUpRight,
  Globe,
  Lightbulb,
  Settings,
  Shield,
  Activity,
  FileText
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
    // Redirect to Google OAuth for authentication
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

  const speechTypes = [
    "School Presentations",
    "TED Talks", 
    "Business Pitches",
    "Conference Talks",
    "Wedding Speeches",
    "Job Interviews",
    "Sales Presentations",
    "Training Sessions"
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
        {/* Animated background pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({length: 6}).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 border border-[#0BF9EA]/10 rounded-full opacity-5"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 20}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.02, 0.08, 0.02],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </div>

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

      {/* Mission/About Us Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#0BF9EA]/10 text-[#0BF9EA] px-4 py-2">Our Mission</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Unlock Your True Potential Through Masterful Communication
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Public speaking is the ultimate multiplier of human influence. It shapes careers, builds movements, 
              and transforms ideas into reality. Yet for millions, fear and lack of skill in communication becomes 
              the invisible barrier that keeps their true potential locked away.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0BF9EA] to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">The Hidden Cost of Poor Communication</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Studies show that 75% of people fear public speaking more than death itself. This fear doesn't just affect presentations—it limits career advancement, 
                    reduces leadership opportunities, and prevents brilliant ideas from reaching the world.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0BF9EA] to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">The Power of Influential Speaking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Great speakers don't just communicate—they inspire action, change minds, and create lasting impact. 
                    From boardroom presentations to wedding toasts, masterful communication opens doors that talent alone cannot.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0BF9EA] to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Breaking Through the Barrier</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We believe every person has something valuable to share with the world. Our AI-powered platform doesn't just 
                    teach speaking skills—it systematically dismantles the barriers between your potential and your impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <Globe className="w-16 h-16 mx-auto text-[#0BF9EA] mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h4>
                </div>
                <blockquote className="text-lg text-gray-700 italic leading-relaxed text-center">
                  "A world where every person can confidently share their ideas, influence positive change, 
                  and unlock opportunities through the power of masterful communication."
                </blockquote>
                <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-[#0BF9EA]/10 rounded-lg p-4">
                    <div className="text-2xl font-bold text-[#0BF9EA]">10M+</div>
                    <div className="text-sm text-gray-600">Lives Transformed</div>
                  </div>
                  <div className="bg-[#0BF9EA]/10 rounded-lg p-4">
                    <div className="text-2xl font-bold text-[#0BF9EA]">100%</div>
                    <div className="text-sm text-gray-600">Confidence Boost</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Showcase */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-[#0BF9EA]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="feature-title mb-4">
              Complete <span className="highlight-word">AI-Powered</span> Speaking Assistant
            </h2>
            <p className="creative-text max-w-3xl mx-auto">
              Everything you need to master public speaking in one intelligent platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Real-Time Analysis */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-[#0BF9EA] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Speech Analysis</h3>
                <p className="text-gray-600 mb-4">Live monitoring of voice clarity, pace, volume, and confidence with instant feedback</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Words per minute tracking
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Voice clarity analysis
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Confidence scoring
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Body Language Detection */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Body Language AI</h3>
                <p className="text-gray-600 mb-4">MediaPipe-powered analysis of posture, gestures, and eye contact patterns</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Posture monitoring
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Gesture analysis
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Eye contact tracking
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Templates */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Speech Templates</h3>
                <p className="text-gray-600 mb-4">Unlimited free templates for every scenario with AI-powered customization</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    TED Talks & Keynotes
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Business Presentations
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Wedding & Social Speeches
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Vibe Tracker</h4>
              <p className="text-sm text-gray-600">Emotional engagement and energy level monitoring</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">ROI Analyzer</h4>
              <p className="text-sm text-gray-600">Measure speech impact and persuasiveness</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Speech DNA</h4>
              <p className="text-sm text-gray-600">Discover your unique speaking personality</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Badge System</h4>
              <p className="text-sm text-gray-600">Earn achievements as you master skills</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Speech Types Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="feature-title mb-4">
              Tailored for Every <span className="highlight-word">Speaking Scenario</span>
            </h2>
            <p className="creative-text max-w-3xl mx-auto">
              Get purpose-specific feedback and coaching for any type of <span className="highlight-word">presentation</span> or speech.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {speechTypes.map((type, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#0BF9EA]/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#0BF9EA]/10 group-hover:to-blue-100 rounded-full flex items-center justify-center transition-all duration-300">
                    <Users className="w-6 h-6 text-gray-600 group-hover:text-[#0BF9EA]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{type}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Award className="w-16 h-16 mx-auto mb-8 text-white/80" />
          <h2 className="text-4xl font-bold text-white mb-6 floating-text">
            Ready to Transform Your <span className="bg-white/20 px-3 py-1 rounded-lg">Speaking Skills</span>?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Join thousands of speakers who have improved their presentation skills with our <span className="bg-white/20 px-2 py-1 rounded">AI-powered coaching</span> platform.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl px-12 py-4 text-lg font-semibold">
              Start Your Journey
              <PlayCircle className="w-5 h-5 ml-3" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src={yapUpLogo}
            alt="YapUp Logo"
            className="w-40 h-12 mx-auto mb-6 object-contain"
          />
          <p className="text-gray-400 mb-6">
            Empowering speakers worldwide with intelligent feedback and coaching.
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