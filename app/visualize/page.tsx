'use client';

import React, { useState, useEffect } from 'react';
import { 
  TreeVisualization, 
  DecisionTreeController, 
  StudentData, 
  AnimationStep 
} from '@/components/StudentAnalyzerComponent';

const DecisionTreePage: React.FC = () => {
  const [controller] = useState(() => new DecisionTreeController());
  const [animationSequence, setAnimationSequence] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);

  const [studentData, setStudentData] = useState<StudentData>({
    attendanceRate: 85,
    homeworkCompletion: 80,
    parentInvolvement: 'Medium',
    quizScore: 72,
    participation: 'Low',
    studyHours: 4
  });

  // Auto-advance animation
  useEffect(() => {
    if (isAnimating && currentStep < animationSequence.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (currentStep === animationSequence.length - 1) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, animationSequence.length]);

  const handleExecute = () => {
    const sequence = controller.executeDecisionTree(studentData);
    setAnimationSequence(sequence);
    setCurrentStep(0);
    setIsAnimating(true);
    setHasExecuted(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setHasExecuted(false);
    setAnimationSequence([]);
  };

  const updateStudentData = (field: keyof StudentData, value: number | string) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex gap-8 p-8">
      {/* Input Panel */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 sticky top-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            Student Data Input
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Attendance Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={studentData.attendanceRate}
                onChange={(e) => updateStudentData('attendanceRate', Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                disabled={isAnimating}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Homework Completion (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={studentData.homeworkCompletion}
                onChange={(e) => updateStudentData('homeworkCompletion', Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                disabled={isAnimating}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Parent Involvement
              </label>
              <select
                value={studentData.parentInvolvement}
                onChange={(e) => updateStudentData('parentInvolvement', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                disabled={isAnimating}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Quiz Score
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={studentData.quizScore}
                onChange={(e) => updateStudentData('quizScore', Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                disabled={isAnimating}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Participation Level
              </label>
              <select
                value={studentData.participation}
                onChange={(e) => updateStudentData('participation', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                disabled={isAnimating}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Study Hours (per week)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={studentData.studyHours}
                onChange={(e) => updateStudentData('studyHours', Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                disabled={isAnimating}
              />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleExecute}
              disabled={isAnimating}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isAnimating ? 'Analyzing...' : 'Execute Analysis'}
            </button>
            
            {hasExecuted && (
              <button
                onClick={handleReset}
                className="w-full px-6 py-3 bg-slate-700 text-slate-300 font-bold rounded-xl border-2 border-slate-600 hover:border-slate-500 transition-all duration-300 hover:scale-105"
              >
                ↻ Reset
              </button>
            )}
          </div>

          {hasExecuted && (
            <div className="mt-6 text-center text-slate-400 text-sm">
              Step {currentStep + 1} of {animationSequence.length}
            </div>
          )}
        </div>
      </div>

      {/* Visualization Panel */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8 text-center space-y-4 max-w-3xl">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Student Performance Analyzer
          </h1>
          
          {hasExecuted && animationSequence.length > 0 && (
            <div className="inline-block px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
              <p className="text-slate-300 text-lg font-medium">
                {animationSequence[currentStep]?.description || 'Ready to analyze...'}
              </p>
            </div>
          )}
          
          {!hasExecuted && (
            <div className="inline-block px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
              <p className="text-slate-300 text-lg font-medium">
                Enter student data and click "Execute Analysis" to begin
              </p>
            </div>
          )}
        </div>

        {hasExecuted && animationSequence.length > 0 ? (
          <TreeVisualization
            nodes={controller.getNodes()}
            currentStep={currentStep}
            animationSequence={animationSequence}
            isAnimating={isAnimating}
          />
        ) : (
          <div className="w-full max-w-6xl h-[650px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full flex items-center justify-center border-4 border-slate-700">
                <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-slate-500 text-lg">Decision tree ready for analysis</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionTreePage;
