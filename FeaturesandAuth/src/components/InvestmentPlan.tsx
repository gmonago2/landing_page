import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, Heart, Globe, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface InvestmentPlan {
  monthly_investment: number;
  goal_5_years: number;
  goal_10_years: number;
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
  investment_experience: string;
  time_horizon: string;
  esg_important: boolean;
  esg_causes_support: string[];
  esg_causes_avoid: string[];
  investment_focus: 'domestic' | 'international' | 'balanced';
}

interface Strategy {
  name: string;
  description: string;
  allocation: { category: string; percentage: number }[];
  expectedReturn: number;
  reasoning: string[];
}

const ESG_CAUSES = [
  'Clean Energy',
  'Environmental Conservation',
  'Social Justice',
  'Education',
  'Healthcare',
  'Technology Innovation',
  'Sustainable Agriculture',
  'Financial Inclusion'
];

export function InvestmentPlan() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingPlan, setExistingPlan] = useState<any>(null);

  const [formData, setFormData] = useState<InvestmentPlan>({
    monthly_investment: 0,
    goal_5_years: 0,
    goal_10_years: 0,
    risk_tolerance: 'moderate',
    investment_experience: '',
    time_horizon: '',
    esg_important: false,
    esg_causes_support: [],
    esg_causes_avoid: [],
    investment_focus: 'balanced'
  });

  useEffect(() => {
    if (user) {
      loadExistingPlan();
    }
  }, [user]);

  const loadExistingPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setExistingPlan(data);
        setFormData({
          monthly_investment: parseFloat(data.monthly_investment) || 0,
          goal_5_years: parseFloat(data.goal_5_years) || 0,
          goal_10_years: parseFloat(data.goal_10_years) || 0,
          risk_tolerance: data.risk_tolerance || 'moderate',
          investment_experience: data.investment_experience || '',
          time_horizon: data.time_horizon || '',
          esg_important: data.esg_important || false,
          esg_causes_support: data.esg_causes_support || [],
          esg_causes_avoid: data.esg_causes_avoid || [],
          investment_focus: data.investment_focus || 'balanced'
        });
        setStep(6);
      }
    } catch (error) {
      console.error('Error loading plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    setSaving(true);
    try {
      const strategy = generateStrategy();
      const planData = {
        user_id: user!.id,
        ...formData,
        recommended_strategy: JSON.stringify(strategy),
        updated_at: new Date().toISOString()
      };

      if (existingPlan) {
        await supabase
          .from('investment_plans')
          .update(planData)
          .eq('id', existingPlan.id);
      } else {
        await supabase
          .from('investment_plans')
          .insert(planData);
      }

      await loadExistingPlan();
      setStep(6);
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateStrategy = (): Strategy => {
    const { risk_tolerance, investment_focus, monthly_investment, goal_5_years } = formData;

    let allocation: { category: string; percentage: number }[] = [];
    let expectedReturn = 0;
    let name = '';
    let description = '';
    let reasoning: string[] = [];

    if (risk_tolerance === 'conservative') {
      allocation = [
        { category: 'Bonds', percentage: 60 },
        { category: 'Stocks', percentage: 30 },
        { category: 'Cash', percentage: 10 }
      ];
      expectedReturn = 5;
      name = 'Conservative Growth';
      description = 'A stable, low-risk portfolio focused on capital preservation with steady growth';
      reasoning.push('Your conservative risk tolerance suggests prioritizing stability over high returns');
      reasoning.push('60% bonds provide steady income and reduce volatility');
    } else if (risk_tolerance === 'aggressive') {
      allocation = [
        { category: 'Stocks', percentage: 80 },
        { category: 'Bonds', percentage: 15 },
        { category: 'Alternative Assets', percentage: 5 }
      ];
      expectedReturn = 10;
      name = 'Aggressive Growth';
      description = 'A high-growth portfolio maximizing long-term returns with higher volatility';
      reasoning.push('Your aggressive risk tolerance allows for higher stock allocation');
      reasoning.push('80% stocks offer maximum growth potential over time');
    } else {
      allocation = [
        { category: 'Stocks', percentage: 60 },
        { category: 'Bonds', percentage: 30 },
        { category: 'Cash & Alternatives', percentage: 10 }
      ];
      expectedReturn = 7.5;
      name = 'Balanced Growth';
      description = 'A well-rounded portfolio balancing growth potential with risk management';
      reasoning.push('Your moderate risk tolerance suggests a balanced approach');
      reasoning.push('60/30/10 split provides growth while managing downside risk');
    }

    if (investment_focus === 'international') {
      name = `Global ${name}`;
      reasoning.push('International focus provides geographic diversification and exposure to global growth');
    } else if (investment_focus === 'domestic') {
      name = `Domestic ${name}`;
      reasoning.push('Domestic focus reduces currency risk and leverages familiarity with local markets');
    } else {
      reasoning.push('Balanced geographic exposure reduces regional risk');
    }

    if (formData.esg_important) {
      name = `ESG ${name}`;
      reasoning.push(`ESG investing aligns your portfolio with causes you support: ${formData.esg_causes_support.slice(0, 2).join(', ')}`);
    }

    const monthlyRequired = goal_5_years / 60;
    if (monthly_investment > 0 && goal_5_years > 0) {
      if (monthly_investment < monthlyRequired * 0.7) {
        reasoning.push(`Consider increasing monthly contributions to $${monthlyRequired.toFixed(0)} to reach your 5-year goal more comfortably`);
      } else if (monthly_investment >= monthlyRequired) {
        reasoning.push('Your current monthly investment is well-aligned with your 5-year goal');
      }
    }

    return { name, description, allocation, expectedReturn, reasoning };
  };

  const calculateProjectedValue = (months: number, monthlyInvestment: number, annualReturn: number) => {
    const monthlyReturn = annualReturn / 12 / 100;
    let balance = 0;

    for (let i = 0; i < months; i++) {
      balance = (balance + monthlyInvestment) * (1 + monthlyReturn);
    }

    return balance;
  };

  const toggleESGCause = (cause: string, type: 'support' | 'avoid') => {
    const field = type === 'support' ? 'esg_causes_support' : 'esg_causes_avoid';
    const current = formData[field];

    if (current.includes(cause)) {
      setFormData({ ...formData, [field]: current.filter(c => c !== cause) });
    } else {
      setFormData({ ...formData, [field]: [...current, cause] });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your plan...</p>
      </div>
    );
  }

  const strategy = existingPlan ? JSON.parse(existingPlan.recommended_strategy || '{}') : generateStrategy();

  return (
    <div className="max-w-4xl mx-auto">
      {step < 6 ? (
        <>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 rounded-2xl mb-4">
              <BarChart3 className="w-8 h-8 text-brand-blue" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Build Your Investment Plan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Answer a few questions to create a personalized investment strategy tailored to your goals
            </p>

            <div className="flex items-center justify-center gap-2 mt-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step ? 'w-12 bg-brand-blue' : s < step ? 'w-8 bg-brand-green' : 'w-8 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-brand-blue/10 rounded-xl">
                    <DollarSign className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Monthly Investment</h3>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    How much can you invest each month?
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      value={formData.monthly_investment || ''}
                      onChange={(e) => setFormData({ ...formData, monthly_investment: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none text-lg"
                      placeholder="500"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Enter the amount you can comfortably invest monthly</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    What's your investment experience level?
                  </label>
                  <div className="space-y-2">
                    {['Complete beginner', 'Some knowledge', 'Experienced investor'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({ ...formData, investment_experience: level })}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          formData.investment_experience === level
                            ? 'border-brand-blue bg-brand-blue/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{level}</span>
                          {formData.investment_experience === level && (
                            <CheckCircle className="w-5 h-5 text-brand-blue" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-brand-green/10 rounded-xl">
                    <Target className="w-5 h-5 text-brand-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Investment Goals</h3>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    What do you want your investments to be worth in 5 years?
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      value={formData.goal_5_years || ''}
                      onChange={(e) => setFormData({ ...formData, goal_5_years: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none text-lg"
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    What about in 10 years?
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      value={formData.goal_10_years || ''}
                      onChange={(e) => setFormData({ ...formData, goal_10_years: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none text-lg"
                      placeholder="150000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    When do you plan to need this money?
                  </label>
                  <div className="space-y-2">
                    {['Less than 5 years', '5-10 years', '10+ years', 'Retirement (20+ years)'].map((horizon) => (
                      <button
                        key={horizon}
                        onClick={() => setFormData({ ...formData, time_horizon: horizon })}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          formData.time_horizon === horizon
                            ? 'border-brand-blue bg-brand-blue/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{horizon}</span>
                          {formData.time_horizon === horizon && (
                            <CheckCircle className="w-5 h-5 text-brand-blue" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-brand-yellow/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Risk Tolerance</h3>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    How comfortable are you with investment risk?
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Higher risk can mean higher returns, but also more ups and downs
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => setFormData({ ...formData, risk_tolerance: 'conservative' })}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        formData.risk_tolerance === 'conservative'
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 mb-1">Conservative</p>
                          <p className="text-sm text-gray-600">Minimize risk, steady growth (~5% annual return)</p>
                        </div>
                        {formData.risk_tolerance === 'conservative' && (
                          <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, risk_tolerance: 'moderate' })}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        formData.risk_tolerance === 'moderate'
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 mb-1">Moderate</p>
                          <p className="text-sm text-gray-600">Balanced approach (~7-8% annual return)</p>
                        </div>
                        {formData.risk_tolerance === 'moderate' && (
                          <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, risk_tolerance: 'aggressive' })}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        formData.risk_tolerance === 'aggressive'
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 mb-1">Aggressive</p>
                          <p className="text-sm text-gray-600">Maximum growth potential (~10%+ annual return)</p>
                        </div>
                        {formData.risk_tolerance === 'aggressive' && (
                          <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-brand-green/10 rounded-xl">
                    <Heart className="w-5 h-5 text-brand-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">ESG Considerations</h3>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    Do you want to invest in companies aligned with your values?
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    ESG investing focuses on Environmental, Social, and Governance factors
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setFormData({ ...formData, esg_important: true })}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        formData.esg_important
                          ? 'border-brand-green bg-brand-green/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium">Yes, it's important</span>
                        {formData.esg_important && <CheckCircle className="w-5 h-5 text-brand-green" />}
                      </div>
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, esg_important: false, esg_causes_support: [], esg_causes_avoid: [] })}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        !formData.esg_important
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium">Not a priority</span>
                        {!formData.esg_important && <CheckCircle className="w-5 h-5 text-brand-blue" />}
                      </div>
                    </button>
                  </div>
                </div>

                {formData.esg_important && (
                  <>
                    <div>
                      <label className="block text-gray-700 font-medium mb-3">
                        What causes do you want to support? (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {ESG_CAUSES.map((cause) => (
                          <button
                            key={cause}
                            onClick={() => toggleESGCause(cause, 'support')}
                            className={`p-3 rounded-xl border-2 transition-all text-sm ${
                              formData.esg_causes_support.includes(cause)
                                ? 'border-brand-green bg-brand-green/5 font-medium'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {cause}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-3">
                        Are there industries you want to avoid?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Fossil Fuels', 'Tobacco', 'Weapons', 'Gambling', 'Alcohol', 'Fast Fashion'].map((cause) => (
                          <button
                            key={cause}
                            onClick={() => toggleESGCause(cause, 'avoid')}
                            className={`p-3 rounded-xl border-2 transition-all text-sm ${
                              formData.esg_causes_avoid.includes(cause)
                                ? 'border-red-400 bg-red-50 font-medium'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {cause}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-brand-blue/10 rounded-xl">
                    <Globe className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Investment Focus</h3>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    Where do you want to invest?
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => setFormData({ ...formData, investment_focus: 'domestic' })}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        formData.investment_focus === 'domestic'
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 mb-1">Domestic (U.S. only)</p>
                          <p className="text-sm text-gray-600">Focus on U.S. companies you know and understand</p>
                        </div>
                        {formData.investment_focus === 'domestic' && (
                          <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, investment_focus: 'international' })}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        formData.investment_focus === 'international'
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 mb-1">International</p>
                          <p className="text-sm text-gray-600">Access global markets and emerging economies</p>
                        </div>
                        {formData.investment_focus === 'international' && (
                          <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, investment_focus: 'balanced' })}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        formData.investment_focus === 'balanced'
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 mb-1">Balanced (Mix of both)</p>
                          <p className="text-sm text-gray-600">Diversify across domestic and international markets</p>
                        </div>
                        {formData.investment_focus === 'balanced' && (
                          <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-gray-300 transition-colors"
                >
                  Back
                </button>
              )}

              {step < 5 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue/90 transition-colors"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={savePlan}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Generating Plan...' : 'Generate My Plan'}
                  <Sparkles className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-brand-blue via-brand-green to-brand-yellow rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Your Personalized Investment Strategy</h2>
            </div>
            <p className="text-white/90 text-lg">{strategy.name}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Strategy Overview</h3>
            <p className="text-gray-700 leading-relaxed mb-6">{strategy.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-brand-blue/5 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                <p className="text-xl font-bold text-brand-blue capitalize">{formData.risk_tolerance}</p>
              </div>
              <div className="bg-brand-green/5 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Expected Return</p>
                <p className="text-xl font-bold text-brand-green">{strategy.expectedReturn}% per year</p>
              </div>
              <div className="bg-brand-yellow/5 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Investment Focus</p>
                <p className="text-xl font-bold text-brand-yellow capitalize">{formData.investment_focus}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-4">Recommended Asset Allocation</h4>
              <div className="space-y-3">
                {strategy.allocation.map((asset) => (
                  <div key={asset.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{asset.category}</span>
                      <span className="text-brand-blue font-bold">{asset.percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-blue to-brand-green"
                        style={{ width: `${asset.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Growth Projection</h3>

            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Projected Value (5 Years)</p>
                  <p className="text-3xl font-bold text-brand-blue">
                    ${calculateProjectedValue(60, formData.monthly_investment, strategy.expectedReturn).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your goal: ${formData.goal_5_years.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Projected Value (10 Years)</p>
                  <p className="text-3xl font-bold text-brand-green">
                    ${calculateProjectedValue(120, formData.monthly_investment, strategy.expectedReturn).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your goal: ${formData.goal_10_years.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-brand-yellow/10 to-brand-cream/30 rounded-xl p-6 border border-brand-yellow/30">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-brand-yellow flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 mb-2">Visual Growth Chart</p>
                  <div className="space-y-4">
                    {[1, 3, 5, 7, 10].map((year) => {
                      const value = calculateProjectedValue(year * 12, formData.monthly_investment, strategy.expectedReturn);
                      const maxValue = calculateProjectedValue(120, formData.monthly_investment, strategy.expectedReturn);
                      const percentage = (value / maxValue) * 100;

                      return (
                        <div key={year} className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-600 w-16">Year {year}</span>
                          <div className="flex-1 h-8 bg-gray-200 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-yellow to-brand-green flex items-center justify-end pr-3 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            >
                              <span className="text-xs font-bold text-white">${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why This Strategy Works For You</h3>
            <div className="space-y-4">
              {strategy.reasoning.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-6 py-3 border-2 border-brand-blue text-brand-blue rounded-xl font-medium hover:bg-brand-blue/5 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
