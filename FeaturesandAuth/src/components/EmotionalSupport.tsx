import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronDown, ChevronUp, MessageCircle, Send, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
}

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  created_at: string;
  isUser?: boolean;
}

const CATEGORY_INFO = {
  fear: { title: 'Overcoming Fear', icon: Shield, color: 'brand-blue' },
  confidence: { title: 'Building Confidence', icon: Heart, color: 'brand-green' },
  getting_started: { title: 'Getting Started', icon: Sparkles, color: 'brand-yellow' },
  mistakes: { title: 'Avoiding Mistakes', icon: AlertCircle, color: 'brand-blue' }
};

export function EmotionalSupport() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFAQs();
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    if (showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChat]);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: ChatMessage[] = [];
      (data || []).forEach((msg) => {
        formattedMessages.push({
          id: `${msg.id}-user`,
          message: msg.message,
          response: '',
          created_at: msg.created_at,
          isUser: true
        });
        formattedMessages.push({
          id: `${msg.id}-bot`,
          message: msg.response,
          response: '',
          created_at: msg.created_at,
          isUser: false
        });
      });

      setChatMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('lose') && (lowerMessage.includes('money') || lowerMessage.includes('all'))) {
      return "I understand that fear of losing money is very real and valid. The truth is, with diversified investments like index funds, you're spreading risk across hundreds of companies. Even during major market downturns, diversified portfolios have historically recovered over time. The key is: 1) Only invest money you won't need for 5+ years, 2) Diversify broadly, and 3) Stay invested for the long term. Would you like to talk more about diversification strategies?";
    }

    if (lowerMessage.includes('scared') || lowerMessage.includes('afraid') || lowerMessage.includes('nervous')) {
      return "It's completely normal to feel scared when starting to invest—it shows you're taking it seriously! Every successful investor started exactly where you are. Here's what helps: Start small with amounts you're comfortable with, learn as you go, and remember that you're building a skill. You don't need to have everything figured out on day one. What specifically makes you most nervous?";
    }

    if (lowerMessage.includes('late') || lowerMessage.includes('too old') || lowerMessage.includes('missed')) {
      return "You haven't missed the boat! While starting earlier gives you more time for compound growth, starting today is always better than waiting. Many people successfully started investing in their 30s, 40s, 50s, and beyond. What matters is starting now with whatever you have and being consistent. The second-best time to start is today. How can I help you take that first step?";
    }

    if (lowerMessage.includes('how much') || lowerMessage.includes('start with')) {
      return "Great question! You can start investing with as little as $10-50 per month with many modern platforms. What's more important than the amount is developing the habit and consistency. Starting small lets you learn and build confidence without risking large amounts. As you become more comfortable, you can gradually increase your contributions. Does a small starting amount sound manageable to you?";
    }

    if (lowerMessage.includes('mistake') || lowerMessage.includes('wrong') || lowerMessage.includes('mess up')) {
      return "Everyone makes mistakes when learning to invest—even experienced investors! The good news is that most mistakes are recoverable, especially when you start small and diversify. Common beginner mistakes include: panic selling during downturns, not diversifying, and trying to time the market. But these are all learning opportunities. The best approach is to start simple (like with index funds), invest regularly, and learn as you go. What concerns you most about making mistakes?";
    }

    if (lowerMessage.includes('debt') || lowerMessage.includes('loan') || lowerMessage.includes('owe')) {
      return "Balancing debt and investing is important. Generally: 1) Prioritize high-interest debt like credit cards first, 2) If you have employer 401(k) matching, contribute enough to get it—it's free money, 3) For low-interest debt like mortgages, you can often do both. Every situation is unique, so consider your specific interest rates and financial stability. Would you like to discuss your specific situation?";
    }

    if (lowerMessage.includes('diversif') || lowerMessage.includes('spread')) {
      return "Diversification means not putting all your eggs in one basket! Instead of buying stock in just one company, you spread your investment across many companies, industries, and even countries. Index funds are a great way to diversify automatically—one fund can give you exposure to hundreds or thousands of companies. This way, if one company struggles, it doesn't devastate your entire portfolio. Think of it as financial safety in numbers!";
    }

    if (lowerMessage.includes('time') && lowerMessage.includes('market')) {
      return "Trying to time the market—buying low and selling high—sounds great in theory, but even professionals struggle to do it consistently. Research shows that 'time IN the market beats timing the market.' Instead, invest regularly regardless of market conditions (called dollar-cost averaging). This way, you buy some shares when prices are high and some when they're low, averaging out over time. It removes the guesswork and emotion from investing!";
    }

    if (lowerMessage.includes('stock') || lowerMessage.includes('bond')) {
      return "Great question! A stock is like owning a piece of a company—when the company does well, your stock value can grow. A bond is like making a loan to a company or government—they pay you interest and return your money later. Stocks are riskier but have higher growth potential. Bonds are more stable but grow slower. Most portfolios include both to balance growth and stability. Does that help clarify things?";
    }

    if (lowerMessage.includes('index fund') || lowerMessage.includes('etf')) {
      return "Index funds are one of the best options for beginners! They're like a basket containing small pieces of many companies (sometimes hundreds or thousands). When you buy an index fund, you're automatically diversified. They're low-cost, simple to understand, and historically perform well over time. Famous investors like Warren Buffett recommend them for most people. They take the guesswork out of picking individual stocks. Would you like to know more about choosing an index fund?";
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! Remember, investing is a journey, not a destination. Be patient with yourself, keep learning, and don't let fear hold you back from starting. Every expert was once a beginner. I'm here anytime you need support or have questions. You've got this! 💪";
    }

    return "That's a great question! While I'm here to provide emotional support and answer common concerns, I want to make sure you get the most accurate information. I'd recommend checking our FAQ section below for detailed answers, or you can ask me about specific fears or concerns you have about investing. Some common topics I can help with: fear of losing money, feeling overwhelmed, worries about mistakes, or questions about getting started. What's weighing on your mind most?";
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sendingMessage || !user) return;

    const userMessage = newMessage.trim();
    setSendingMessage(true);
    setNewMessage('');

    const userMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      message: userMessage,
      response: '',
      created_at: new Date().toISOString(),
      isUser: true
    };

    setChatMessages(prev => [...prev, userMsg]);

    try {
      const botResponse = generateResponse(userMessage);

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: userMessage,
          response: botResponse
        });

      if (error) throw error;

      const botMsg: ChatMessage = {
        id: `temp-bot-${Date.now()}`,
        message: botResponse,
        response: '',
        created_at: new Date().toISOString(),
        isUser: false
      };

      setChatMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const getFAQsByCategory = (category: string) => {
    return faqs.filter(faq => faq.category === category);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading support resources...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-green/20 to-brand-blue/20 rounded-2xl mb-4">
          <Heart className="w-8 h-8 text-brand-green" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">You're Not Alone</h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Every worry, fear, and question you have is valid. We're here to help you build confidence and overcome the emotional barriers to investing.
        </p>
      </div>

      <div className="bg-gradient-to-br from-brand-green/10 to-brand-blue/10 rounded-2xl p-8 border-2 border-brand-green/20">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-brand-green rounded-xl flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Need to Talk?</h3>
            <p className="text-gray-700 mb-4">
              Can't find your answer in the FAQ? Chat with our support bot to discuss your specific concerns and fears.
            </p>
            <button
              onClick={() => setShowChat(!showChat)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-xl font-medium hover:bg-brand-green/90 transition-colors"
            >
              {showChat ? 'Hide Chat' : 'Start Conversation'}
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showChat && (
          <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-brand-green to-brand-blue p-4">
              <h4 className="text-white font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Support Chat
              </h4>
            </div>

            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-green/10 rounded-full mb-4">
                    <MessageCircle className="w-8 h-8 text-brand-green" />
                  </div>
                  <p className="text-gray-600">Share your worries or questions. I'm here to help!</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.isUser
                          ? 'bg-brand-blue text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your worry or question..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-green focus:outline-none"
                  disabled={sendingMessage}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="px-6 py-3 bg-brand-green text-white rounded-xl hover:bg-brand-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-gray-900 text-center">Frequently Asked Questions</h3>

        {Object.entries(CATEGORY_INFO).map(([category, info]) => {
          const categoryFAQs = getFAQsByCategory(category);
          const Icon = info.icon;

          if (categoryFAQs.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 bg-${info.color}/10 rounded-xl`}>
                  <Icon className={`w-5 h-5 text-${info.color}`} />
                </div>
                <h4 className="text-xl font-bold text-gray-900">{info.title}</h4>
              </div>

              <div className="space-y-3">
                {categoryFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-brand-blue/10 to-brand-green/10 rounded-2xl p-8 text-center border-2 border-brand-blue/20">
        <Heart className="w-12 h-12 text-brand-green mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Remember</h3>
        <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Every expert investor was once a beginner with the same fears and questions you have now.
          The difference is they started anyway. Your feelings are valid, your questions are important,
          and you absolutely can do this. Take it one step at a time.
        </p>
      </div>
    </div>
  );
}
