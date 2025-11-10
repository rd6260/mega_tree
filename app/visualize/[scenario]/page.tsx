'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Settings,
  Sparkles
} from 'lucide-react';
import { 
  TreeVisualization, 
  DecisionTreeController, 
  StudentData, 
  AnimationStep 
} from '@/components/StudentAnalyzerComponent';
import { 
  CardiologistTreeVisualization,
  CardiologistDecisionTreeController,
  CardiologistPatientData,
  CardiologistAnimationStep
} from '@/components/CardiologistTree';

type ScenarioType = 'student' | 'cardiologist';

interface PresetProfile {
  name: string;
  description: string;
  data: StudentData | CardiologistPatientData;
}

const studentPresets: PresetProfile[] = [
  {
    name: 'Excellent Student',
    description: 'High achiever with great attendance and study habits',
    data: {
      attendanceRate: 95,
      homeworkCompletion: 90,
      parentInvolvement: 'High',
      quizScore: 88,
      participation: 'High',
      studyHours: 6
    }
  },
  {
    name: 'Average Performer',
    description: 'Moderate performance across all metrics',
    data: {
      attendanceRate: 75,
      homeworkCompletion: 65,
      parentInvolvement: 'Medium',
      quizScore: 70,
      participation: 'Medium',
      studyHours: 3
    }
  },
  {
    name: 'Struggling Student',
    description: 'Low attendance and engagement, needs support',
    data: {
      attendanceRate: 55,
      homeworkCompletion: 40,
      parentInvolvement: 'Low',
      quizScore: 45,
      participation: 'Low',
      studyHours: 1
    }
  },
  {
    name: 'Improving Learner',
    description: 'Good attendance but inconsistent homework',
    data: {
      attendanceRate: 85,
      homeworkCompletion: 55,
      parentInvolvement: 'Medium',
      quizScore: 68,
      participation: 'Low',
      studyHours: 2.5
    }
  },
  {
    name: 'High Potential',
    description: 'Strong scores but low study hours',
    data: {
      attendanceRate: 90,
      homeworkCompletion: 80,
      parentInvolvement: 'High',
      quizScore: 82,
      participation: 'High',
      studyHours: 2
    }
  }
];

const cardiologistPresets: PresetProfile[] = [
  {
    name: 'Critical Emergency',
    description: 'Severe chest pain with abnormal ECG',
    data: {
      chestPain: 'Severe/Radiating',
      ecg: 'Abnormal',
      bloodPressure: 160,
      cholesterol: 280
    }
  },
  {
    name: 'High Risk Patient',
    description: 'Severe symptoms with elevated vitals',
    data: {
      chestPain: 'Severe/Radiating',
      ecg: 'Normal',
      bloodPressure: 155,
      cholesterol: 260
    }
  },
  {
    name: 'Moderate Risk',
    description: 'Mild symptoms with some abnormalities',
    data: {
      chestPain: 'Mild/Occasional',
      ecg: 'Abnormal',
      bloodPressure: 145,
      cholesterol: 220
    }
  },
  {
    name: 'Low Risk',
    description: 'Mild symptoms with normal vitals',
    data: {
      chestPain: 'Mild/Occasional',
      ecg: 'Normal',
      bloodPressure: 125,
      cholesterol: 180
    }
  },
  {
    name: 'Preventive Care',
    description: 'Occasional discomfort, healthy vitals',
    data: {
      chestPain: 'Mild/Occasional',
      ecg: 'Normal',
      bloodPressure: 120,
      cholesterol: 190
    }
  }
];

const VisualizationPage = ({ params }: { params: Promise<{ scenario: string }> }) => {
  const resolvedParams = use(params);
  const scenario = resolvedParams.scenario as ScenarioType;
  const router = useRouter();

  const [phase, setPhase] = useState<'intro' | 'fullTree' | 'playground'>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  // Student state
  const [studentController] = useState(() => new DecisionTreeController());
  const [studentData, setStudentData] = useState<StudentData>(studentPresets[0].data as StudentData);
  const [studentSequence, setStudentSequence] = useState<AnimationStep[]>([]);

  // Cardiologist state
  const [cardioController] = useState(() => new CardiologistDecisionTreeController());
  const [cardioData, setCardioData] = useState<CardiologistPatientData>(cardiologistPresets[0].data as CardiologistPatientData);
  const [cardioSequence, setCardioSequence] = useState<CardiologistAnimationStep[]>([]);

  const isStudent = scenario === 'student';
  const presets = isStudent ? studentPresets : cardiologistPresets;
  const scenarioTitle = isStudent ? 'Student Performance Analyzer' : 'Cardiac Health Decision Tree';
  const scenarioDescription = isStudent 
    ? 'This decision tree analyzes student performance based on attendance, homework completion, quiz scores, and other academic metrics to classify students into performance categories.'
    : 'This decision tree evaluates cardiac patients based on chest pain severity, ECG results, blood pressure, and cholesterol levels to determine appropriate medical interventions.';

  // Auto-advance animation
  useEffect(() => {
    const sequence = isStudent ? studentSequence : cardioSequence;
    if (isPlaying && currentStep < sequence.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentStep >= sequence.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, studentSequence, cardioSequence, isStudent]);

  const handleShowFullTree = () => {
    // Show ALL nodes immediately for full tree view
    if (isStudent) {
      const allNodes = studentController.getNodes();
      const fullTreeSequence: AnimationStep[] = [{
        nodeId: 0,
        description: 'Complete decision tree structure showing all possible paths',
        visibleNodes: allNodes.map(n => n.id),
        visibleEdges: allNodes.filter(n => n.parent !== null).map(n => ({ from: n.parent as number, to: n.id }))
      }];
      setStudentSequence(fullTreeSequence);
      setCurrentStep(0);
    } else {
      const allNodes = cardioController.getNodes();
      const fullTreeSequence: CardiologistAnimationStep[] = [{
        nodeId: 0,
        description: 'Complete decision tree structure showing all possible paths',
        visibleNodes: allNodes.map(n => n.id),
        visibleEdges: allNodes.filter(n => n.parent !== null).map(n => ({ from: n.parent as number, to: n.id }))
      }];
      setCardioSequence(fullTreeSequence);
      setCurrentStep(0);
    }
    setPhase('fullTree');
    setIsPlaying(false);
  };

  const handleStartPlayground = () => {
    setPhase('playground');
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleExecute = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    
    // Execute tree with CURRENT data
    if (isStudent) {
      console.log('Executing student tree with data:', studentData);
      const sequence = studentController.executeDecisionTree(studentData);
      console.log('Generated sequence:', sequence);
      setStudentSequence(sequence);
    } else {
      console.log('Executing cardio tree with data:', cardioData);
      const sequence = cardioController.executeDecisionTree(cardioData);
      console.log('Generated sequence:', sequence);
      setCardioSequence(sequence);
    }
    
    // Start animation after a brief delay
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    const preset = presets[index];
    if (isStudent) {
      setStudentData(preset.data as StudentData);
    } else {
      setCardioData(preset.data as CardiologistPatientData);
    }
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleNext = () => {
    const sequence = isStudent ? studentSequence : cardioSequence;
    if (currentStep < sequence.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Intro Phase
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              {scenarioTitle}
            </h1>
            <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {scenarioDescription}
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 space-y-6">
            <div className="flex items-center justify-center gap-2 text-cyan-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-base font-semibold">Let's Get Started</span>
            </div>

            <div className="grid gap-4">
              <button
                onClick={handleShowFullTree}
                className="group relative px-6 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-base rounded-xl shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-center gap-2.5">
                  <Eye className="w-5 h-5" />
                  <span>View Complete Tree Structure</span>
                </div>
              </button>

              <button
                onClick={handleStartPlayground}
                className="px-6 py-4 bg-slate-700/50 hover:bg-slate-700 text-white font-bold text-base rounded-xl border-2 border-slate-600 hover:border-slate-500 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2.5"
              >
                <Settings className="w-5 h-5" />
                <span>Jump to Interactive Playground</span>
              </button>
            </div>

            <button
              onClick={() => router.push('/scenario')}
              className="text-sm text-slate-400 hover:text-white transition-colors duration-300"
            >
              ← Change Scenario
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full Tree Phase
  if (phase === 'fullTree') {
    const sequence = isStudent ? studentSequence : cardioSequence;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">{scenarioTitle}</h1>
            <p className="text-slate-400">Complete decision tree structure</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-8">
            {isStudent ? (
              <TreeVisualization
                nodes={studentController.getNodes()}
                currentStep={currentStep}
                animationSequence={sequence}
              />
            ) : (
              <CardiologistTreeVisualization
                nodes={cardioController.getNodes()}
                currentStep={currentStep}
                animationSequence={sequence}
              />
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setPhase('intro')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-300"
            >
              ← Back
            </button>
            <button
              onClick={handleStartPlayground}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
            >
              Start Interactive Playground →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playground Phase
  const sequence = isStudent ? studentSequence : cardioSequence;
  const currentDescription = sequence[currentStep]?.description || 'Configure parameters and execute analysis';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{scenarioTitle}</h1>
            <p className="text-slate-400 mt-1">Interactive Playground</p>
          </div>
          <button
            onClick={() => router.push('/scenario')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-300 border border-slate-700"
          >
            ← Change Scenario
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Inputs and Presets */}
          <div className="lg:col-span-1 space-y-6">
            {/* Preset Profiles */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Preset Profiles
              </h3>
              <div className="space-y-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                      selectedPreset === idx
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-700/30 hover:bg-slate-700/50 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-semibold text-white text-sm">{preset.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Controls */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Adjust Parameters</h3>
              {isStudent ? (
                <StudentInputs data={studentData} onChange={setStudentData} disabled={isPlaying} />
              ) : (
                <CardiologistInputs data={cardioData} onChange={setCardioData} disabled={isPlaying} />
              )}
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={isPlaying}
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPlaying ? 'Analyzing...' : 'Execute Decision Tree'}
            </button>
          </div>

          {/* Right Panel - Visualization */}
          <div className="lg:col-span-3 space-y-6">
            {/* Status Bar */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">
                  Step {currentStep + 1} of {sequence.length || 1}
                </span>
                <span className="text-sm text-cyan-400 font-semibold">
                  {sequence.length > 0 ? Math.round(((currentStep + 1) / sequence.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${sequence.length > 0 ? ((currentStep + 1) / sequence.length) * 100 : 0}%` }}
                />
              </div>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">{currentDescription}</p>
            </div>

            {/* Tree Visualization */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              {sequence.length > 0 ? (
                isStudent ? (
                  <TreeVisualization
                    nodes={studentController.getNodes()}
                    currentStep={currentStep}
                    animationSequence={sequence}
                  />
                ) : (
                  <CardiologistTreeVisualization
                    nodes={cardioController.getNodes()}
                    currentStep={currentStep}
                    animationSequence={sequence}
                  />
                )
              ) : (
                <div className="h-[650px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-slate-700/30 rounded-full flex items-center justify-center">
                      <Eye className="w-12 h-12 text-slate-600" />
                    </div>
                    <p className="text-slate-500">Click "Execute Decision Tree" to visualize</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            {sequence.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={currentStep >= sequence.length - 1}
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 disabled:cursor-not-allowed"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-lg transition-all disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentStep >= sequence.length - 1}
                      className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-lg transition-all disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Student Input Component
const StudentInputs: React.FC<{
  data: StudentData;
  onChange: (data: StudentData) => void;
  disabled: boolean;
}> = ({ data, onChange, disabled }) => {
  const updateField = (field: keyof StudentData, value: number | string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">Attendance Rate (%)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.attendanceRate}
          onChange={(e) => updateField('attendanceRate', parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="text-right text-cyan-400 font-bold text-sm mt-1">{data.attendanceRate}%</div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">Homework Completion (%)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.homeworkCompletion}
          onChange={(e) => updateField('homeworkCompletion', parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="text-right text-purple-400 font-bold text-sm mt-1">{data.homeworkCompletion}%</div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">Parent Involvement</label>
        <select
          value={data.parentInvolvement}
          onChange={(e) => updateField('parentInvolvement', e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">Quiz Score</label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.quizScore}
          onChange={(e) => updateField('quizScore', parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="text-right text-blue-400 font-bold text-sm mt-1">{data.quizScore}</div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">Participation Level</label>
        <select
          value={data.participation}
          onChange={(e) => updateField('participation', e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">Study Hours/Week</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={data.studyHours}
          onChange={(e) => updateField('studyHours', parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="text-right text-amber-400 font-bold text-sm mt-1">{data.studyHours}h</div>
      </div>
    </div>
  );
};

// Cardiologist Input Component
const CardiologistInputs: React.FC<{
  data: CardiologistPatientData;
  onChange: (data: CardiologistPatientData) => void;
  disabled: boolean;
}> = ({ data, onChange, disabled }) => {
  const updateField = (field: keyof CardiologistPatientData, value: number | string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">Chest Pain Severity</label>
        <select
          value={data.chestPain}
          onChange={(e) => updateField('chestPain', e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
        >
          <option value="Severe/Radiating">Severe/Radiating</option>
          <option value="Mild/Occasional">Mild/Occasional</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">ECG Result</label>
        <select
          value={data.ecg}
          onChange={(e) => updateField('ecg', e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none"
        >
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">Blood Pressure (mmHg)</label>
        <input
          type="range"
          min="100"
          max="200"
          value={data.bloodPressure}
          onChange={(e) => updateField('bloodPressure', parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="text-right text-orange-400 font-bold text-sm mt-1">{data.bloodPressure}/90</div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">Cholesterol (mg/dL)</label>
        <input
          type="range"
          min="150"
          max="350"
          value={data.cholesterol}
          onChange={(e) => updateField('cholesterol', parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="text-right text-amber-400 font-bold text-sm mt-1">{data.cholesterol} mg/dL</div>
      </div>
    </div>
  );
};

export default VisualizationPage;
