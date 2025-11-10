import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, ChevronRight, Heart, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

// ==================== TYPES ====================
export interface CardiologistTreeNode {
  id: number;
  x: number;
  y: number;
  label: string;
  level: number;
  parent: number | null;
  decision?: string;
  isLeaf?: boolean;
  outcome?: 'emergency' | 'treatment' | 'lifestyle' | 'counseling';
}

export interface CardiologistAnimationStep {
  nodeId: number;
  description: string;
  visibleNodes: number[];
  visibleEdges: { from: number; to: number }[];
}

export interface CardiologistPatientData {
  chestPain: 'Severe/Radiating' | 'Mild/Occasional';
  ecg: 'Abnormal' | 'Normal';
  bloodPressure: number;
  cholesterol: number;
}

// ==================== TREE VISUALIZATION COMPONENT ====================
export const CardiologistTreeVisualization: React.FC<{
  nodes: CardiologistTreeNode[];
  currentStep: number;
  animationSequence: CardiologistAnimationStep[];
}> = ({ nodes, currentStep, animationSequence }) => {
  const currentAnimation = animationSequence[currentStep] || animationSequence[animationSequence.length - 1];

  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number): string => {
    const controlPointOffset = Math.abs(x2 - x1) * 0.3;
    return `M ${x1} ${y1} C ${x1} ${y1 + controlPointOffset}, ${x2} ${y2 - controlPointOffset}, ${x2} ${y2}`;
  };

  const getNodeStyle = (node: CardiologistTreeNode): string | null => {
    const activeNode = currentAnimation.nodeId;
    const isVisible = currentAnimation.visibleNodes.includes(node.id);
    
    if (!isVisible) return null;
    if (activeNode === node.id) return 'active';
    
    const previousSteps = animationSequence.slice(0, currentStep);
    if (previousSteps.some(s => s.nodeId === node.id)) {
      if (node.outcome === 'emergency') return 'emergency';
      if (node.outcome === 'treatment') return 'treatment';
      if (node.outcome === 'lifestyle') return 'lifestyle';
      if (node.outcome === 'counseling') return 'counseling';
      return 'completed';
    }
    
    return 'default';
  };

  const getNodeColors = (style: string) => {
    switch (style) {
      case 'active':
        return { bg: 'from-cyan-400 via-blue-500 to-purple-600', border: '#06b6d4', glow: 'shadow-cyan-400/60' };
      case 'emergency':
        return { bg: 'from-red-500 via-red-600 to-rose-700', border: '#ef4444', glow: 'shadow-red-500/40' };
      case 'treatment':
        return { bg: 'from-orange-400 via-orange-500 to-amber-600', border: '#fb923c', glow: 'shadow-orange-400/40' };
      case 'lifestyle':
        return { bg: 'from-blue-400 via-blue-500 to-cyan-600', border: '#3b82f6', glow: 'shadow-blue-400/40' };
      case 'counseling':
        return { bg: 'from-green-400 via-emerald-500 to-teal-600', border: '#10b981', glow: 'shadow-green-400/40' };
      case 'completed':
        return { bg: 'from-purple-400 via-violet-500 to-indigo-600', border: '#a78bfa', glow: 'shadow-purple-400/40' };
      default:
        return { bg: 'from-slate-600 via-slate-700 to-slate-800', border: '#64748b', glow: 'shadow-slate-500/20' };
    }
  };

  const isEdgeVisible = (fromId: number, toId: number): boolean => {
    return currentAnimation.visibleEdges.some(e => e.from === fromId && e.to === toId);
  };

  const isEdgeActive = (fromId: number, toId: number): boolean => {
    if (currentStep === 0) return false;
    const prevAnimation = animationSequence[currentStep - 1];
    return !prevAnimation.visibleEdges.some(e => e.from === fromId && e.to === toId) &&
           currentAnimation.visibleEdges.some(e => e.from === fromId && e.to === toId);
  };

  const getGradientColors = (bg: string) => {
    if (bg.includes('cyan')) return { start: '#22d3ee', end: '#8b5cf6' };
    if (bg.includes('red')) return { start: '#ef4444', end: '#be123c' };
    if (bg.includes('orange')) return { start: '#fb923c', end: '#f59e0b' };
    if (bg.includes('blue')) return { start: '#3b82f6', end: '#06b6d4' };
    if (bg.includes('green')) return { start: '#10b981', end: '#14b8a6' };
    if (bg.includes('purple')) return { start: '#a78bfa', end: '#4f46e5' };
    return { start: '#64748b', end: '#334155' };
  };

  return (
    <div className="relative w-full h-[650px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50">
      <svg className="w-full h-full" viewBox="0 0 1000 650">
        <defs>
          <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {nodes.map(node => {
          if (node.parent !== null) {
            const parentNode = nodes.find(n => n.id === node.parent);
            if (!parentNode) return null;
            
            const visible = isEdgeVisible(node.parent, node.id);
            const active = isEdgeActive(node.parent, node.id);
            
            if (!visible) return null;

            const path = getCurvedPath(parentNode.x, parentNode.y + 40, node.x, node.y - 40);
            const midX = (parentNode.x + node.x) / 2;
            const midY = (parentNode.y + node.y) / 2;

            return (
              <g key={`edge-${node.id}`}>
                {active && (
                  <path
                    d={path}
                    fill="none"
                    stroke="url(#activeGradient)"
                    strokeWidth="6"
                    opacity="0.3"
                    filter="url(#strongGlow)"
                    className="animate-pulse"
                  />
                )}
                <path
                  d={path}
                  fill="none"
                  stroke={active ? "url(#activeGradient)" : "#475569"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={active ? 1 : 0.6}
                  filter={active ? "url(#glow)" : "none"}
                  className="transition-all duration-700"
                  style={{
                    strokeDasharray: active ? "1000" : "none",
                    strokeDashoffset: active ? "1000" : "0",
                    animation: active ? "dash 1s ease-in-out forwards" : "none"
                  }}
                />
                <circle cx={node.x} cy={node.y - 40} r="5" fill={active ? "#06b6d4" : "#475569"} filter={active ? "url(#glow)" : "none"} />
                <g transform={`translate(${midX}, ${midY - 20})`}>
                  <rect x="-45" y="-14" width="90" height="28" rx="14" fill="#0f172a" stroke={active ? "#06b6d4" : "#475569"} strokeWidth="1.5" opacity="0.95" />
                  <text x="0" y="5" fill={active ? "#06b6d4" : "#94a3b8"} fontSize="11" fontWeight="600" textAnchor="middle" className="transition-all duration-300">
                    {node.decision}
                  </text>
                </g>
              </g>
            );
          }
          return null;
        })}

        {nodes.map((node) => {
          const style = getNodeStyle(node);
          if (!style) return null;

          const colors = getNodeColors(style);
          const isActive = style === 'active';
          const isLeafNode = node.isLeaf;
          const gradientColors = getGradientColors(colors.bg);
          
          return (
            <g key={node.id} className="transition-all duration-500" style={{ animation: isActive ? 'float 2s ease-in-out infinite' : 'none' }}>
              {isActive && (
                <>
                  <rect x={node.x - 75} y={node.y - 35} width="150" height="70" rx="12" fill="url(#activeGradient)" opacity="0.1" filter="url(#strongGlow)" className="animate-ping" style={{ animationDuration: '2s' }} />
                  <rect x={node.x - 70} y={node.y - 32} width="140" height="64" rx="10" fill="none" stroke="url(#activeGradient)" strokeWidth="2" opacity="0.4" className="animate-pulse" />
                </>
              )}
              
              {/* Node Background Shadow */}
              <rect x={node.x - 62} y={node.y - 28} width="124" height="56" rx="10" className="fill-slate-900 transition-all duration-500" />
              
              {/* Node Main */}
              <rect x={node.x - 60} y={node.y - 30} width="120" height="60" rx="10" fill={`url(#node-gradient-${node.id})`} filter={isActive ? "url(#glow)" : "none"} />
              <rect x={node.x - 60} y={node.y - 30} width="120" height="60" rx="10" fill="none" stroke={colors.border} strokeWidth={isActive ? "3" : "2"} opacity={isActive ? 1 : 0.6} />
              
              <defs>
                <linearGradient id={`node-gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gradientColors.start} />
                  <stop offset="100%" stopColor={gradientColors.end} />
                </linearGradient>
              </defs>

              <text x={node.x} y={node.y} fill="white" fontSize="12" fontWeight="700" textAnchor="middle" className="drop-shadow-lg">
                {node.label.split('\n').map((line, i) => (
                  <tspan key={i} x={node.x} dy={i === 0 ? -5 : 16}>{line}</tspan>
                ))}
              </text>

              {isLeafNode && style !== 'default' && (
                <text x={node.x} y={node.y + 55} fill={colors.border} fontSize="24" textAnchor="middle">
                  {node.outcome === 'emergency' ? '🚨' : node.outcome === 'treatment' ? '💊' : node.outcome === 'lifestyle' ? '🏃' : '🥗'}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <style jsx>{`
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

// ==================== DECISION TREE CONTROLLER ====================
export class CardiologistDecisionTreeController {
  private nodes: CardiologistTreeNode[] = [
    { id: 0, x: 500, y: 80, label: 'Chest Pain', level: 0, parent: null },
    
    // Left branch - Severe/Radiating
    { id: 1, x: 300, y: 180, label: 'ECG', level: 1, parent: 0, decision: 'Severe/Radiating' },
    { id: 2, x: 180, y: 280, label: 'Immediate\nHospitalization', level: 2, parent: 1, decision: 'Abnormal', isLeaf: true, outcome: 'emergency' },
    { id: 3, x: 420, y: 280, label: 'BP', level: 2, parent: 1, decision: 'Normal' },
    { id: 4, x: 350, y: 400, label: 'Cholesterol', level: 3, parent: 3, decision: '≥ 140/90' },
    { id: 5, x: 260, y: 520, label: 'Prescribe Statins\n+ Monitoring', level: 4, parent: 4, decision: '≥ 240', isLeaf: true, outcome: 'treatment' },
    { id: 6, x: 440, y: 520, label: 'Lifestyle\nModification', level: 4, parent: 4, decision: '< 240', isLeaf: true, outcome: 'lifestyle' },
    { id: 7, x: 560, y: 400, label: 'Lifestyle\nChanges', level: 3, parent: 3, decision: '< 140/90', isLeaf: true, outcome: 'lifestyle' },
    
    // Right branch - Mild/Occasional
    { id: 8, x: 700, y: 180, label: 'ECG', level: 1, parent: 0, decision: 'Mild/Occasional' },
    { id: 9, x: 600, y: 280, label: 'BP', level: 2, parent: 8, decision: 'Abnormal' },
    { id: 10, x: 540, y: 400, label: 'Lifestyle\nChanges', level: 3, parent: 9, decision: '≥ 140/90', isLeaf: true, outcome: 'lifestyle' },
    { id: 11, x: 660, y: 400, label: 'Diet + Exercise\nCounseling', level: 3, parent: 9, decision: '< 140/90', isLeaf: true, outcome: 'counseling' },
    { id: 12, x: 800, y: 280, label: 'Diet + Exercise\nCounseling', level: 2, parent: 8, decision: 'Normal', isLeaf: true, outcome: 'counseling' },
  ];

  getNodes(): CardiologistTreeNode[] {
    return this.nodes;
  }

  executeDecisionTree(data: CardiologistPatientData): CardiologistAnimationStep[] {
    const sequence: CardiologistAnimationStep[] = [];
    let currentNodeId = 0;
    const path: number[] = [0];
    const edges: { from: number; to: number }[] = [];

    sequence.push({
      nodeId: 0,
      description: 'Analyzing patient: Evaluating chest pain severity...',
      visibleNodes: [0],
      visibleEdges: []
    });

    if (data.chestPain === 'Severe/Radiating') {
      currentNodeId = 1;
      path.push(1);
      edges.push({ from: 0, to: 1 });
      sequence.push({
        nodeId: 0,
        description: `Chest pain is severe/radiating → Proceeding with immediate ECG`,
        visibleNodes: [...path],
        visibleEdges: [...edges]
      });
      sequence.push({
        nodeId: 1,
        description: 'Performing ECG analysis...',
        visibleNodes: [...path],
        visibleEdges: [...edges]
      });

      if (data.ecg === 'Abnormal') {
        currentNodeId = 2;
        path.push(2);
        edges.push({ from: 1, to: 2 });
        sequence.push({
          nodeId: 1,
          description: `ECG shows abnormalities → Emergency protocol`,
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
        sequence.push({
          nodeId: 2,
          description: 'URGENT: Immediate hospitalization + emergency care required 🚨',
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
      } else {
        currentNodeId = 3;
        path.push(3);
        edges.push({ from: 1, to: 3 });
        sequence.push({
          nodeId: 1,
          description: `ECG is normal → Checking blood pressure`,
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
        sequence.push({
          nodeId: 3,
          description: 'Measuring blood pressure...',
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });

        if (data.bloodPressure >= 140) {
          currentNodeId = 4;
          path.push(4);
          edges.push({ from: 3, to: 4 });
          sequence.push({
            nodeId: 3,
            description: `BP is ${data.bloodPressure}/90 (≥ 140/90) → Checking cholesterol`,
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
          sequence.push({
            nodeId: 4,
            description: 'Analyzing cholesterol levels...',
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });

          if (data.cholesterol >= 240) {
            currentNodeId = 5;
            path.push(5);
            edges.push({ from: 4, to: 5 });
            sequence.push({
              nodeId: 4,
              description: `Cholesterol is ${data.cholesterol} mg/dL (≥ 240) → Medical intervention required`,
              visibleNodes: [...path],
              visibleEdges: [...edges]
            });
            sequence.push({
              nodeId: 5,
              description: 'Treatment: Prescribe statins + cardiac monitoring 💊',
              visibleNodes: [...path],
              visibleEdges: [...edges]
            });
          } else {
            currentNodeId = 6;
            path.push(6);
            edges.push({ from: 4, to: 6 });
            sequence.push({
              nodeId: 4,
              description: `Cholesterol is ${data.cholesterol} mg/dL (< 240) → Lifestyle changes recommended`,
              visibleNodes: [...path],
              visibleEdges: [...edges]
            });
            sequence.push({
              nodeId: 6,
              description: 'Recommendation: Lifestyle modification + diet plan 🏃',
              visibleNodes: [...path],
              visibleEdges: [...edges]
            });
          }
        } else {
          currentNodeId = 7;
          path.push(7);
          edges.push({ from: 3, to: 7 });
          sequence.push({
            nodeId: 3,
            description: `BP is ${data.bloodPressure}/90 (< 140/90) → Lifestyle management`,
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
          sequence.push({
            nodeId: 7,
            description: 'Recommendation: Lifestyle changes for prevention 🏃',
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
        }
      }
    } else {
      currentNodeId = 8;
      path.push(8);
      edges.push({ from: 0, to: 8 });
      sequence.push({
        nodeId: 0,
        description: `Chest pain is mild/occasional → Standard ECG screening`,
        visibleNodes: [...path],
        visibleEdges: [...edges]
      });
      sequence.push({
        nodeId: 8,
        description: 'Performing ECG analysis...',
        visibleNodes: [...path],
        visibleEdges: [...edges]
      });

      if (data.ecg === 'Abnormal') {
        currentNodeId = 9;
        path.push(9);
        edges.push({ from: 8, to: 9 });
        sequence.push({
          nodeId: 8,
          description: `ECG shows abnormalities → Checking blood pressure`,
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
        sequence.push({
          nodeId: 9,
          description: 'Measuring blood pressure...',
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });

        if (data.bloodPressure >= 140) {
          currentNodeId = 10;
          path.push(10);
          edges.push({ from: 9, to: 10 });
          sequence.push({
            nodeId: 9,
            description: `BP is ${data.bloodPressure}/90 (≥ 140/90) → Lifestyle intervention`,
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
          sequence.push({
            nodeId: 10,
            description: 'Recommendation: Lifestyle changes required 🏃',
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
        } else {
          currentNodeId = 11;
          path.push(11);
          edges.push({ from: 9, to: 11 });
          sequence.push({
            nodeId: 9,
            description: `BP is ${data.bloodPressure}/90 (< 140/90) → Preventive care`,
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
          sequence.push({
            nodeId: 11,
            description: 'Recommendation: Diet + exercise counseling 🥗',
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
        }
      } else {
        currentNodeId = 12;
        path.push(12);
        edges.push({ from: 8, to: 12 });
        sequence.push({
          nodeId: 8,
          description: `ECG is normal → Preventive counseling`,
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
        sequence.push({
          nodeId: 12,
          description: 'Recommendation: Diet + exercise counseling 🥗',
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
      }
    }

    return sequence;
  }
}

