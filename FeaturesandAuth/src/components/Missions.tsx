import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Clock, Zap, Award, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'evergreen' | 'beginner';
  points: number;
}

interface UserProgress {
  mission_id: string;
  completed: boolean;
  completed_at: string | null;
  last_completed_date: string | null;
}

export function Missions() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMissionsAndProgress();
    }
  }, [user]);

  const loadMissionsAndProgress = async () => {
    try {
      const [missionsRes, progressRes] = await Promise.all([
        supabase.from('missions').select('*').order('type', { ascending: true }),
        supabase.from('user_mission_progress').select('*').eq('user_id', user!.id)
      ]);

      if (missionsRes.error) throw missionsRes.error;
      if (progressRes.error) throw progressRes.error;

      setMissions(missionsRes.data || []);
      setProgress(progressRes.data || []);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMissionProgress = (missionId: string) => {
    return progress.find(p => p.mission_id === missionId);
  };

  const isMissionCompleted = (mission: Mission) => {
    const missionProgress = getMissionProgress(mission.id);
    if (!missionProgress) return false;

    if (mission.type === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      return missionProgress.last_completed_date === today;
    }

    return missionProgress.completed;
  };

  const completeMission = async (mission: Mission) => {
    if (!user) return;

    try {
      const existingProgress = getMissionProgress(mission.id);
      const today = new Date().toISOString().split('T')[0];

      if (existingProgress) {
        await supabase
          .from('user_mission_progress')
          .update({
            completed: mission.type !== 'daily',
            completed_at: new Date().toISOString(),
            last_completed_date: mission.type === 'daily' ? today : existingProgress.last_completed_date
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('user_mission_progress')
          .insert({
            user_id: user.id,
            mission_id: mission.id,
            completed: mission.type !== 'daily',
            completed_at: new Date().toISOString(),
            last_completed_date: mission.type === 'daily' ? today : null
          });
      }

      await loadMissionsAndProgress();
    } catch (error) {
      console.error('Error completing mission:', error);
    }
  };

  const getMissionsByType = (type: string) => {
    return missions.filter(m => m.type === type);
  };

  const calculateProgress = (type: string) => {
    const typeMissions = getMissionsByType(type);
    if (typeMissions.length === 0) return 0;

    const completed = typeMissions.filter(m => isMissionCompleted(m)).length;
    return Math.round((completed / typeMissions.length) * 100);
  };

  const renderMissionCard = (mission: Mission) => {
    const completed = isMissionCompleted(mission);

    return (
      <div
        key={mission.id}
        className={`bg-white rounded-xl p-6 border-2 transition-all duration-300 ${
          completed
            ? 'border-brand-green bg-brand-green/5'
            : 'border-gray-200 hover:border-brand-blue hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
              completed ? 'bg-brand-green text-white' : 'bg-brand-blue/10 text-brand-blue'
            }`}>
              {completed ? <CheckCircle className="w-6 h-6" /> : <Target className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {mission.title}
              </h3>
              <p className={`text-sm ${completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {mission.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-brand-yellow font-bold">
              <Award className="w-4 h-4" />
              <span>{mission.points}</span>
            </div>
          </div>
        </div>

        {!completed && (
          <button
            onClick={() => completeMission(mission)}
            className="w-full bg-brand-blue text-white py-2 rounded-lg font-medium hover:bg-brand-blue/90 transition-colors"
          >
            Complete Mission
          </button>
        )}

        {completed && (
          <div className="flex items-center justify-center gap-2 text-brand-green font-medium">
            <CheckCircle className="w-5 h-5" />
            <span>Completed!</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading missions...</p>
      </div>
    );
  }

  const dailyMissions = getMissionsByType('daily');
  const evergreenMissions = getMissionsByType('evergreen');
  const beginnerMissions = getMissionsByType('beginner');

  const dailyProgress = calculateProgress('daily');
  const evergreenProgress = calculateProgress('evergreen');
  const beginnerProgress = calculateProgress('beginner');

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 rounded-2xl mb-4">
          <Target className="w-8 h-8 text-brand-blue" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Learning Missions</h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Complete missions to build your investing knowledge and earn points. Track your progress and build confidence step by step.
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-brand-yellow/20 rounded-xl">
              <Calendar className="w-5 h-5 text-brand-yellow" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Daily Missions</h3>
              <p className="text-sm text-gray-600">Complete these every day to build your habit</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Daily Progress</p>
            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-yellow to-brand-green transition-all duration-500"
                style={{ width: `${dailyProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{dailyProgress}% complete</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dailyMissions.map(mission => renderMissionCard(mission))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-brand-blue/20 rounded-xl">
              <Zap className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Evergreen Missions</h3>
              <p className="text-sm text-gray-600">Complete these at your own pace</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-blue to-brand-green transition-all duration-500"
                style={{ width: `${evergreenProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{evergreenProgress}% complete</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evergreenMissions.map(mission => renderMissionCard(mission))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-brand-green/20 rounded-xl">
              <Award className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Beginner Missions</h3>
              <p className="text-sm text-gray-600">Essential first steps for new investors</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-green to-brand-yellow transition-all duration-500"
                style={{ width: `${beginnerProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{beginnerProgress}% complete</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beginnerMissions.map(mission => renderMissionCard(mission))}
        </div>
      </section>
    </div>
  );
}
