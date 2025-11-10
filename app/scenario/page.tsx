'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

const ScenarioSelection: React.FC = () => {
  const router = useRouter();

  const scenarios = [
    {
      id: 'student',
      title: 'Student Performance Analyzer',
      description: 'Analyze student academic performance using attendance, homework, quiz scores, and participation metrics.',
      icon: GraduationCap,
      color: 'from-blue-500 via-purple-500 to-pink-500',
      glowColor: 'shadow-blue-500/50',
      bgGradient: 'from-blue-500/10 to-purple-500/10',
      metrics: ['Attendance Rate', 'Quiz Scores', 'Study Hours', 'Parent Involvement']
    },
    {
      id: 'cardiologist',
      title: 'Cardiac Health Decision Tree',
      description: 'Evaluate cardiac risk factors and determine appropriate medical interventions based on patient symptoms and vitals.',
      icon: Heart,
      color: 'from-red-500 via-orange-500 to-amber-500',
      glowColor: 'shadow-red-500/50',
      bgGradient: 'from-red-500/10 to-orange-500/10',
      metrics: ['Chest Pain Severity', 'ECG Results', 'Blood Pressure', 'Cholesterol Levels']
    }
  ];

  const handleSelect = (scenarioId: string) => {
    router.push(`/visualize/${scenarioId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 text-xs font-medium">Choose Your Scenario</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Select a Decision Tree
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Explore how decision trees work through real-world scenarios. Each scenario demonstrates different decision-making processes.
          </p>
        </div>

        {/* Scenario Cards */}
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl w-full">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <div
                key={scenario.id}
                onClick={() => handleSelect(scenario.id)}
                className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-slate-600"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${scenario.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative p-5 space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${scenario.color} ${scenario.glowColor} shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                      {scenario.title}
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {scenario.description}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Metrics</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {scenario.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-300 text-xs">
                          <div className="w-1 h-1 rounded-full bg-cyan-400" />
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button */}
                  <div className={`flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300 pt-2`}>
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${scenario.color} text-sm`}>
                      Explore Scenario
                    </span>
                    <ArrowRight className={`w-4 h-4 text-cyan-400 group-hover:translate-x-2 transition-transform duration-300`} />
                  </div>
                </div>

                {/* Decorative corner element */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${scenario.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
              </div>
            );
          })}
        </div>

        {/* Back to Home */}
        <button
          onClick={() => router.push('/')}
          className="mt-10 px-5 py-2.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-all duration-300 hover:scale-105"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default ScenarioSelection;
