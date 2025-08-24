import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Brain, BarChart3, Gauge, Palette, Zap, Play, Video, Check, Clock } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Mic,
      title: "Voice-Enabled Mock Interviews",
      description: "Practice with AI voice agents that simulate real interview conversations. Get comfortable with verbal communication and timing.",
      gradient: "from-primary to-blue-600"
    },
    {
      icon: Brain,
      title: "Dynamic Question Generation",
      description: "AI-powered questions tailored to your specific job role, tech stack, and experience level using Google Gemini.",
      gradient: "from-secondary to-purple-600"
    },
    {
      icon: BarChart3,
      title: "AI Feedback & Scoring",
      description: "Receive detailed feedback on communication skills, confidence levels, and technical knowledge with actionable insights.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Gauge,
      title: "Comprehensive Dashboard",
      description: "Track your progress, view interview history, and analyze performance trends with detailed analytics and insights.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Palette,
      title: "Modern UI/UX",
      description: "Beautiful, responsive interface built with Tailwind CSS and shadcn components. Works seamlessly on all devices.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant voice processing and transcription with LiveKit integration for seamless interview experiences.",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Choose Your Role",
      description: "Select your target job role, tech stack, and experience level. Our AI will customize questions specifically for your needs.",
      color: "from-primary to-blue-600"
    },
    {
      number: 2,
      title: "Practice with AI",
      description: "Engage in natural voice conversations with our AI interviewer. Practice answering questions in real-time with instant feedback.",
      color: "from-secondary to-purple-600"
    },
    {
      number: 3,
      title: "Improve & Succeed",
      description: "Review detailed feedback, track your progress, and continuously improve your interview skills until you're ready to excel.",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: [
        "3 interviews per month",
        "Basic AI feedback",
        "5 job roles",
        "Text-based interviews only"
      ],
      buttonText: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      price: 19,
      description: "For serious job seekers",
      features: [
        "Unlimited interviews",
        "Voice-enabled interviews",
        "Advanced AI feedback",
        "50+ job roles",
        "Performance analytics"
      ],
      buttonText: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: 99,
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "Custom integrations",
        "Priority support"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 w-full overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Master Your Interview Skills with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    AI-Powered
                  </span>{" "}
                  Practice
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Practice real-time interviews with our AI voice agent. Get personalized feedback, improve your confidence, and land your dream job.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
                  asChild
                  data-testid="button-start-interview"
                >
                  <a href="/api/login">
                    <Play className="mr-2 h-5 w-5" />
                    Start Free Interview
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                  data-testid="button-watch-demo"
                >
                  <Video className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>5-minute setup</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up">
              {/* Main Dashboard Preview */}
              <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Interview Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <CardContent className="p-6 space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
                      <div className="text-sm text-blue-600/70 dark:text-blue-400/70">Interviews</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">8.4</div>
                      <div className="text-sm text-green-600/70 dark:text-green-400/70">Avg Score</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</div>
                      <div className="text-sm text-purple-600/70 dark:text-purple-400/70">Confidence</div>
                    </div>
                  </div>

                  {/* Recent Interview */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900 dark:text-white">Recent Interview</h4>
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        Completed
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Frontend Developer - React</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Score: 8.5/10</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Voice Indicator */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-primary to-secondary rounded-full p-4 shadow-lg animate-pulse">
                <Mic className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our comprehensive AI interview platform provides all the tools you need to practice, improve, and succeed in your next interview.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700">
                <CardContent className="p-0">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get started with AI-powered interview practice in just a few simple steps. No complex setup required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              asChild
              data-testid="button-get-started"
            >
              <a href="/api/login">
                Start Your First Interview
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Choose the plan that fits your interview preparation needs. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`rounded-2xl p-8 border ${plan.popular ? 'border-2 border-primary bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-900/20 relative' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                      ${plan.price}
                      <span className="text-lg text-slate-500 dark:text-slate-400">/month</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{plan.description}</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                    asChild
                    data-testid={`button-plan-${plan.name.toLowerCase()}`}
                  >
                    <a href="/api/login">
                      {plan.buttonText}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Mic className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold">InterviewAI</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
                The most advanced AI-powered interview practice platform. Build confidence, improve skills, and land your dream job with personalized feedback and realistic interview simulations.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold mb-6">Support</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2024 InterviewAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
