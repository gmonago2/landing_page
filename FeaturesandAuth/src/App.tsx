import React, { useState } from 'react';
import { 
  MessageCircle, 
  BookOpen, 
  Target, 
  BarChart3, 
  Users, 
  Brain, 
  Award, 
  DollarSign, 
  TrendingUp, 
  Heart, 
  HelpCircle,
  CheckCircle,
  Zap,
  ChevronRight,
  Shield,
  LogOut,
  User
} from 'lucide-react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthModal } from './components/AuthModal';
import { ProtectedFeature } from './components/ProtectedFeature';
import { JargonTranslator } from './components/JargonTranslator';
import { Missions } from './components/Missions';
import { InvestmentPlan } from './components/InvestmentPlan';
import { SocialFeed } from './components/SocialFeed';
import { EmotionalSupport } from './components/EmotionalSupport';

type ActiveTab = 'all' | 'jargon' | 'emotional' | 'missions' | 'plan' | 'social';

function AppContent() {
  const { user, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');

  const handleLoginRequired = () => {
    setAuthMode('signin');
    setAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  const features = [
    {
      category: "Cut Through the Jargon",
      icon: <Brain className="w-8 h-8" />,
      description: "We translate complex financial terms into plain English, so you can focus on learning instead of decoding.",
      requiresAuth: true,
      hasCustomComponent: true,
      onClick: () => setActiveTab('jargon'),
      items: []
    },
    {
      category: "Emotional Support & Confidence",
      icon: <Heart className="w-8 h-8" />,
      description: "We address your worries head-on and help you build the confidence to invest at your own pace.",
      requiresAuth: false,
      items: [
        {
          title: "Your Worries Are Normal",
          description: "Get reassurance about common investor concerns. You're not alone in feeling uncertain—we're here to help.",
          icon: <HelpCircle className="w-6 h-6" />,
          requiresAuth: false
        },
        {
          title: "Start Small, Think Big",
          description: "Begin with just $5. Every dollar counts, and small investments build powerful habits over time.",
          icon: <DollarSign className="w-6 h-6" />,
          requiresAuth: false
        },
        {
          title: "When Stocks Go Down",
          description: "Learn why market ups and downs are completely normal and how they fit into your long-term success.",
          icon: <TrendingUp className="w-6 h-6" />,
          requiresAuth: false
        }
      ]
    },
    {
      category: "Learn by Doing",
      icon: <Target className="w-8 h-8" />,
      description: "Build confidence through hands-on missions that make learning feel like progress, not homework.",
      requiresAuth: true,
      items: [
        {
          title: "Your First Investment",
          description: "Take the leap with guided support. We'll walk you through making your first stock purchase step by step.",
          icon: <Award className="w-6 h-6" />,
          requiresAuth: true
        },
        {
          title: "Knowledge That Sticks",
          description: "Read beginner-friendly articles and test your understanding with quizzes that actually make sense.",
          icon: <CheckCircle className="w-6 h-6" />,
          requiresAuth: true
        },
        {
          title: "Learn Together",
          description: "Share your wins, ask questions, and learn from others who started exactly where you are now.",
          icon: <Users className="w-6 h-6" />,
          requiresAuth: true
        }
      ]
    },
    {
      category: "Your Personal Investment Plan",
      icon: <BarChart3 className="w-8 h-8" />,
      description: "We help you create a plan that fits your life, your values, and your timeline—no cookie-cutter advice.",
      requiresAuth: true,
      items: [
        {
          title: "What Fits Your Life",
          description: "Answer simple questions about your goals and values to discover investment approaches that feel right for you.",
          icon: <Zap className="w-6 h-6" />,
          requiresAuth: true
        },
        {
          title: "Your Timeline, Your Goals",
          description: "Whether you're planning for 5 years or 15, we'll help you set realistic targets based on what you can actually invest.",
          icon: <Target className="w-6 h-6" />,
          requiresAuth: true
        },
        {
          title: "Invest in What Matters",
          description: "Support companies that align with your values and avoid those that don't. Your money, your choice.",
          icon: <Heart className="w-6 h-6" />,
          requiresAuth: true
        },
        {
          title: "See Your Future",
          description: "Visualize how your investments might grow over time with easy-to-understand projections.",
          icon: <BarChart3 className="w-6 h-6" />,
          requiresAuth: true
        }
      ]
    },
    {
      category: "Safe Community Learning",
      icon: <Users className="w-8 h-8" />,
      description: "Connect with other beginners in a supportive, public environment where everyone's learning together.",
      requiresAuth: true,
      items: [
        {
          title: "Celebrate Your Wins",
          description: "Share your investing milestones and cheer on others. Every step forward deserves recognition.",
          icon: <Award className="w-6 h-6" />,
          requiresAuth: true
        },
        {
          title: "No Question Too Small",
          description: "Ask anything—from 'What's a stock?' to complex strategy questions. Our community is here to help.",
          icon: <MessageCircle className="w-6 h-6" />,
          requiresAuth: true
        },
        {
          title: "Safe & Supportive",
          description: "All conversations are public and moderated. No private messaging means no pressure, just genuine help.",
          icon: <Shield className="w-6 h-6" />,
          requiresAuth: true
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-cream to-white flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-brand-blue animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <img
                src="/src/assets/Gemini_Generated_Image_o6l9p9o6l9p9o6l9-removebg-preview.png"
                alt="First Shares Logo"
                className="h-14 w-auto"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-blue" />
                    </div>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleLoginRequired()}
                    className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-blue/90 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stocks, Explained in Plain English
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-6">
              We make the stock market beginner-friendly by stripping away confusing jargon and providing emotional support for new investors.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Instead of telling you what to buy, we teach you how to think—so you can approach investing with clarity, calm, and confidence, no matter your age or background.
            </p>
            
            {!user && (
              <div className="bg-gradient-to-r from-brand-yellow/20 to-brand-cream/50 border border-brand-yellow/40 rounded-2xl p-6 max-w-2xl mx-auto shadow-sm">
                <p className="text-brand-blue font-semibold mb-4">
                  🌟 Get started with a free account to unlock personalized learning and community features!
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-brand-green bg-brand-green/10 px-2 py-1 rounded">Free access:</span> All emotional support and anxiety help •
                  <span className="font-semibold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded ml-2">Premium:</span> Investment planning, community, and guided lessons
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <button
              onClick={() => setActiveTab('jargon')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold whitespace-nowrap transition-all duration-300 border-b-4 ${
                activeTab === 'jargon'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Jargon</span>
              {!user && <span className="ml-1 text-xs bg-brand-yellow/20 text-brand-blue px-2 py-0.5 rounded-full hidden lg:inline">Premium</span>}
            </button>
            <button
              onClick={() => setActiveTab('emotional')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold whitespace-nowrap transition-all duration-300 border-b-4 ${
                activeTab === 'emotional'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Emotional</span>
              <span className="ml-1 text-xs bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full hidden lg:inline">Free</span>
            </button>
            <button
              onClick={() => setActiveTab('missions')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold whitespace-nowrap transition-all duration-300 border-b-4 ${
                activeTab === 'missions'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Missions</span>
              {!user && <span className="ml-1 text-xs bg-brand-yellow/20 text-brand-blue px-2 py-0.5 rounded-full hidden lg:inline">Premium</span>}
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold whitespace-nowrap transition-all duration-300 border-b-4 ${
                activeTab === 'plan'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Plan</span>
              {!user && <span className="ml-1 text-xs bg-brand-yellow/20 text-brand-blue px-2 py-0.5 rounded-full hidden lg:inline">Premium</span>}
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold whitespace-nowrap transition-all duration-300 border-b-4 ${
                activeTab === 'social'
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Social</span>
              {!user && <span className="ml-1 text-xs bg-brand-yellow/20 text-brand-blue px-2 py-0.5 rounded-full hidden lg:inline">Premium</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Features Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'jargon' ? (
          user ? (
            <JargonTranslator />
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-yellow/30 to-brand-blue/20 rounded-3xl mb-6">
                <Brain className="w-10 h-10 text-brand-blue" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Jargon Translator</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Access our word bank with common investing terms explained in plain English, or use our smart chatbot to find the right concept.
              </p>
              <button
                onClick={handleLoginRequired}
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-semibold rounded-xl hover:bg-brand-blue/90 transition-all duration-300 shadow-lg"
              >
                Sign In to Access
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )
        ) : activeTab === 'missions' ? (
          user ? (
            <Missions />
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 rounded-3xl mb-6">
                <Target className="w-10 h-10 text-brand-blue" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Learn by Doing</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Build confidence through hands-on missions that make learning feel like progress, not homework.
              </p>
              <button
                onClick={handleLoginRequired}
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-semibold rounded-xl hover:bg-brand-blue/90 transition-all duration-300 shadow-lg"
              >
                Sign In to Access
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )
        ) : activeTab === 'plan' ? (
          user ? (
            <InvestmentPlan />
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 rounded-3xl mb-6">
                <BarChart3 className="w-10 h-10 text-brand-blue" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Personal Investment Plan</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                We help you create a plan that fits your life, your values, and your timeline—no cookie-cutter advice.
              </p>
              <button
                onClick={handleLoginRequired}
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-semibold rounded-xl hover:bg-brand-blue/90 transition-all duration-300 shadow-lg"
              >
                Sign In to Access
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )
        ) : activeTab === 'social' ? (
          user ? (
            <SocialFeed />
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 rounded-3xl mb-6">
                <Users className="w-10 h-10 text-brand-blue" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Safe Community Learning</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Connect with other beginners in a supportive, public environment where everyone's learning together.
              </p>
              <button
                onClick={handleLoginRequired}
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-semibold rounded-xl hover:bg-brand-blue/90 transition-all duration-300 shadow-lg"
              >
                Sign In to Access
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )
        ) : activeTab === 'emotional' ? (
          <EmotionalSupport />
        ) : (
        <div className="space-y-16">
          {features.map((category, categoryIndex) => (
            <section key={categoryIndex} className="relative">
              {/* Category Header */}
              <div className="text-center mb-16">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                  category.requiresAuth && !user
                    ? 'bg-gray-100 text-gray-400 shadow-sm'
                    : 'bg-gradient-to-br from-brand-green/20 to-brand-blue/20 text-brand-green shadow-lg'
                }`}>
                  {category.icon}
                </div>
                <div className="flex items-center justify-center mb-4">
                  <h2 className={`text-3xl md:text-4xl font-bold ${
                    category.requiresAuth && !user ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    {category.category}
                  </h2>
                  {category.requiresAuth && !user && (
                    <div className="ml-4 bg-gradient-to-r from-brand-yellow/30 to-brand-yellow/20 text-brand-blue px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-brand-yellow/30">
                      Premium Feature
                    </div>
                  )}
                  {!category.requiresAuth && (
                    <div className="ml-4 bg-gradient-to-r from-brand-green/30 to-brand-green/20 text-brand-green px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-brand-green/30">
                      Always Free
                    </div>
                  )}
                </div>
                <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${
                  category.requiresAuth && !user ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {category.description}
                </p>
              </div>

              {/* Single Feature Card */}
              <div className="flex justify-center">
                <div
                  className={`group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all duration-300 max-w-2xl w-full cursor-pointer ${
                    category.requiresAuth && !user
                      ? 'hover:shadow-xl hover:border-brand-blue/40 hover:-translate-y-1'
                      : 'hover:shadow-xl hover:border-brand-green/40 hover:-translate-y-1'
                  }`}
                  onClick={() => {
                    if (category.requiresAuth && !user) {
                      handleLoginRequired();
                    } else if (category.onClick) {
                      category.onClick();
                    } else {
                      const tabMap: { [key: string]: ActiveTab } = {
                        'Emotional Support & Confidence': 'emotional',
                        'Learn by Doing': 'missions',
                        'Your Personal Investment Plan': 'plan',
                        'Safe Community Learning': 'social'
                      };
                      const tab = tabMap[category.category];
                      if (tab) setActiveTab(tab);
                    }
                  }}
                >
                  {category.requiresAuth && !user && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-br from-brand-yellow/30 to-brand-yellow/20 text-brand-blue p-2 rounded-lg shadow-sm border border-brand-yellow/30">
                        <Shield className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                      category.requiresAuth && !user
                        ? 'bg-gray-100 text-gray-500 group-hover:bg-gradient-to-br group-hover:from-brand-yellow/30 group-hover:to-brand-blue/20 group-hover:text-brand-blue shadow-sm'
                        : 'bg-gradient-to-br from-brand-yellow/20 to-brand-green/20 text-brand-blue group-hover:from-brand-yellow/30 group-hover:to-brand-green/30 shadow-sm'
                    }`}>
                      {category.icon}
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 ${
                      category.requiresAuth && !user ? 'text-gray-500 group-hover:text-gray-900' : 'text-gray-900'
                    }`}>
                      {category.category}
                    </h3>
                    <p className={`leading-relaxed mb-6 ${
                      category.requiresAuth && !user ? 'text-gray-400 group-hover:text-gray-600' : 'text-gray-600'
                    }`}>
                      {category.description}
                    </p>
                    <div className={`flex items-center justify-center font-medium transition-colors duration-300 ${
                      category.requiresAuth && !user
                        ? 'text-gray-400 group-hover:text-brand-blue group-hover:font-semibold'
                        : 'text-brand-blue group-hover:text-brand-green group-hover:font-semibold'
                    }`}>
                      <span>{category.requiresAuth && !user ? 'Sign in to access' : 'Explore'}</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
        )}

        {/* Call to Action */}
        <section className="mt-24 text-center">
          <div className="bg-gradient-to-br from-brand-blue via-brand-green to-brand-yellow rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 to-brand-green/90"></div>
            <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Turn Investing from Overwhelming into Empowering?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join beginners of every age who are learning to invest with clarity, calm, and confidence in our supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-blue font-semibold rounded-xl hover:bg-brand-cream transition-colors duration-300">
                  Continue Learning
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleSignUp}
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-blue font-semibold rounded-xl hover:bg-brand-cream transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Start Learning Today
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                  <button 
                    onClick={() => {
                      document.querySelector('[data-category="emotional-support"]')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-brand-blue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Try Anxiety Help (Free)
                  </button>
                </>
              )}
            </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-yellow to-brand-green rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">First Shares</h3>
          <p className="text-lg mb-2">
            Creating opportunities for beginners of every age.
          </p>
          <p className="text-sm text-gray-400">
            Clarity • Accessibility • Empowerment • Confidence
          </p>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;