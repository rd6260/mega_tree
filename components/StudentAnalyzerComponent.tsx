import React from 'react';

// ==================== TYPES ====================
export interface TreeNode {
  id: number;
  x: number;
  y: number;
  label: string;
  level: number;
  parent: number | null;
  decision?: string;
  isLeaf?: boolean;
  outcome?: 'success' | 'warning' | 'error';
}

export interface AnimationStep {
  nodeId: number;
  description: string;
  visibleNodes: number[];
  visibleEdges: { from: number; to: number }[];
}

export interface StudentData {
  attendanceRate: number;
  homeworkCompletion: number;
  parentInvolvement: 'Low' | 'Medium' | 'High';
  quizScore: number;
  participation: 'Low' | 'Medium' | 'High';
  studyHours: number;
}

interface TreeVisualizationProps {
  nodes: TreeNode[];
  currentStep: number;
  animationSequence: AnimationStep[];
  isAnimating: boolean;
}

// ==================== TREE VISUALIZATION COMPONENT ====================
export const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  nodes,
  currentStep,
  animationSequence,
  isAnimating
}) => {
  const currentAnimation = animationSequence[currentStep] || animationSequence[animationSequence.length - 1];

  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number): string => {
    const controlPointOffset = Math.abs(x2 - x1) * 0.3;
    
    return `M ${x1} ${y1} 
            C ${x1} ${y1 + controlPointOffset}, 
              ${x2} ${y2 - controlPointOffset}, 
              ${x2} ${y2}`;
  };

  const getNodeStyle = (node: TreeNode): string | null => {
    const activeNode = currentAnimation.nodeId;
    const isVisible = currentAnimation.visibleNodes.includes(node.id);
    
    if (!isVisible) return null;
    
    if (activeNode === node.id) {
      return 'active';
    }
    
    const previousSteps = animationSequence.slice(0, currentStep);
    if (previousSteps.some(s => s.nodeId === node.id)) {
      if (node.outcome === 'success') return 'success';
      if (node.outcome === 'warning') return 'warning';
      if (node.outcome === 'error') return 'error';
      return 'completed';
    }
    
    return 'default';
  };

  const getNodeColors = (style: string) => {
    switch (style) {
      case 'active':
        return { bg: 'from-cyan-400 via-blue-500 to-purple-600', border: '#06b6d4', glow: 'shadow-cyan-400/60' };
      case 'success':
        return { bg: 'from-emerald-400 via-green-500 to-teal-600', border: '#34d399', glow: 'shadow-emerald-400/40' };
      case 'warning':
        return { bg: 'from-amber-400 via-orange-500 to-yellow-600', border: '#fbbf24', glow: 'shadow-amber-400/40' };
      case 'error':
        return { bg: 'from-red-400 via-rose-500 to-pink-600', border: '#f87171', glow: 'shadow-red-400/40' };
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
    const currAnimation = currentAnimation;
    
    return !prevAnimation.visibleEdges.some(e => e.from === fromId && e.to === toId) &&
           currAnimation.visibleEdges.some(e => e.from === fromId && e.to === toId);
  };

  const getGradientColors = (bg: string) => {
    if (bg.includes('cyan')) return { start: '#22d3ee', end: '#8b5cf6' };
    if (bg.includes('emerald')) return { start: '#34d399', end: '#059669' };
    if (bg.includes('amber')) return { start: '#fbbf24', end: '#f97316' };
    if (bg.includes('red')) return { start: '#f87171', end: '#be123c' };
    if (bg.includes('purple')) return { start: '#a78bfa', end: '#4f46e5' };
    return { start: '#64748b', end: '#334155' };
  };

  return (
    <div className="relative w-full h-[650px]">
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

        {/* Edges */}
        {nodes.map(node => {
          if (node.parent !== null) {
            const parentNode = nodes.find(n => n.id === node.parent);
            if (!parentNode) return null;
            
            const visible = isEdgeVisible(node.parent, node.id);
            const active = isEdgeActive(node.parent, node.id);
            
            if (!visible) return null;

            const path = getCurvedPath(
              parentNode.x,
              parentNode.y + 40,
              node.x,
              node.y - 40
            );

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
                <circle
                  cx={node.x}
                  cy={node.y - 40}
                  r="5"
                  fill={active ? "#06b6d4" : "#475569"}
                  filter={active ? "url(#glow)" : "none"}
                />
                <g transform={`translate(${midX}, ${midY - 20})`}>
                  <rect
                    x="-35"
                    y="-14"
                    width="70"
                    height="28"
                    rx="14"
                    fill="#0f172a"
                    stroke={active ? "#06b6d4" : "#475569"}
                    strokeWidth="1.5"
                    opacity="0.95"
                  />
                  <text
                    x="0"
                    y="5"
                    fill={active ? "#06b6d4" : "#94a3b8"}
                    fontSize="12"
                    fontWeight="600"
                    textAnchor="middle"
                    className="transition-all duration-300"
                  >
                    {node.decision}
                  </text>
                </g>
              </g>
            );
          }
          return null;
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const style = getNodeStyle(node);
          if (!style) return null;

          const colors = getNodeColors(style);
          const isActive = style === 'active';
          const isLeafNode = node.isLeaf;
          const gradientColors = getGradientColors(colors.bg);
          
          return (
            <g 
              key={node.id}
              className="transition-all duration-500"
              style={{
                animation: isActive ? 'float 2s ease-in-out infinite' : 'none'
              }}
            >
              {isActive && (
                <>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="70"
                    fill="url(#activeGradient)"
                    opacity="0.1"
                    filter="url(#strongGlow)"
                    className="animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="55"
                    fill="none"
                    stroke="url(#activeGradient)"
                    strokeWidth="2"
                    opacity="0.4"
                    className="animate-pulse"
                  />
                </>
              )}
              
              {isLeafNode ? (
                <>
                  <rect
                    x={node.x - 60}
                    y={node.y - 35}
                    width="120"
                    height="70"
                    rx="12"
                    className="fill-slate-900 transition-all duration-500"
                  />
                  <rect
                    x={node.x - 57}
                    y={node.y - 32}
                    width="114"
                    height="64"
                    rx="10"
                    fill={`url(#node-gradient-${node.id})`}
                    filter={isActive ? "url(#glow)" : "none"}
                  />
                  <rect
                    x={node.x - 57}
                    y={node.y - 32}
                    width="114"
                    height="64"
                    rx="10"
                    fill="none"
                    stroke={colors.border}
                    strokeWidth={isActive ? "3" : "2"}
                    opacity={isActive ? 1 : 0.6}
                  />
                </>
              ) : (
                <>
                  <ellipse
                    cx={node.x}
                    cy={node.y}
                    rx="65"
                    ry="35"
                    className="fill-slate-900 transition-all duration-500"
                  />
                  <ellipse
                    cx={node.x}
                    cy={node.y}
                    rx="62"
                    ry="32"
                    fill={`url(#node-gradient-${node.id})`}
                    filter={isActive ? "url(#glow)" : "none"}
                  />
                  <ellipse
                    cx={node.x}
                    cy={node.y}
                    rx="62"
                    ry="32"
                    fill="none"
                    stroke={colors.border}
                    strokeWidth={isActive ? "3" : "2"}
                    opacity={isActive ? 1 : 0.6}
                  />
                </>
              )}
              
              <defs>
                <linearGradient id={`node-gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gradientColors.start} />
                  <stop offset="100%" stopColor={gradientColors.end} />
                </linearGradient>
              </defs>

              <text
                x={node.x}
                y={node.y + 5}
                fill="white"
                fontSize={isLeafNode ? "13" : "14"}
                fontWeight="700"
                textAnchor="middle"
                className="drop-shadow-lg"
              >
                {node.label}
              </text>

              {isLeafNode && style !== 'default' && (
                <text
                  x={node.x}
                  y={node.y + 60}
                  fill={colors.border}
                  fontSize="28"
                  textAnchor="middle"
                >
                  {node.outcome === 'success' ? '⭐' : node.outcome === 'error' ? '⚙️' : '👏'}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

// ==================== DECISION TREE CONTROLLER ====================
export class DecisionTreeController {
  private nodes: TreeNode[] = [
    { id: 0, x: 500, y: 80, label: 'Attendance Rate', level: 0, parent: null },
    
    // Left branch - <70%
    { id: 1, x: 250, y: 200, label: 'Homework', level: 1, parent: 0, decision: '< 70%' },
    { id: 2, x: 120, y: 320, label: 'Low Performance', level: 2, parent: 1, decision: '< 50%', isLeaf: true, outcome: 'error' },
    { id: 3, x: 380, y: 320, label: 'Parent Involvement', level: 2, parent: 1, decision: '≥ 50%' },
    { id: 4, x: 300, y: 450, label: 'Medium Performance', level: 3, parent: 3, decision: 'High', isLeaf: true, outcome: 'warning' },
    { id: 5, x: 460, y: 450, label: 'Low Performance', level: 3, parent: 3, decision: 'Low/Medium', isLeaf: true, outcome: 'error' },
    
    // Right branch - ≥70%
    { id: 6, x: 750, y: 200, label: 'Quiz Score', level: 1, parent: 0, decision: '≥ 70%' },
    { id: 7, x: 880, y: 320, label: 'High Performance', level: 2, parent: 6, decision: '> 75', isLeaf: true, outcome: 'success' },
    { id: 8, x: 620, y: 320, label: 'Participation', level: 2, parent: 6, decision: '≤ 75' },
    { id: 9, x: 730, y: 450, label: 'Medium Performance', level: 3, parent: 8, decision: 'High', isLeaf: true, outcome: 'warning' },
    { id: 10, x: 510, y: 450, label: 'Study Hours', level: 3, parent: 8, decision: 'Low' },
    { id: 11, x: 440, y: 580, label: 'Medium Performance', level: 4, parent: 10, decision: '< 3', isLeaf: true, outcome: 'warning' },
    { id: 12, x: 580, y: 580, label: 'High Performance', level: 4, parent: 10, decision: '≥ 3', isLeaf: true, outcome: 'success' },
  ];

  getNodes(): TreeNode[] {
    return this.nodes;
  }

  executeDecisionTree(data: StudentData): AnimationStep[] {
    const sequence: AnimationStep[] = [];
    let currentNodeId = 0;
    const path: number[] = [0];
    const edges: { from: number; to: number }[] = [];

    // Start
    sequence.push({
      nodeId: 0,
      description: 'Analyzing student: Checking attendance rate...',
      visibleNodes: [0],
      visibleEdges: []
    });

    // Attendance decision
    if (data.attendanceRate < 70) {
      currentNodeId = 1;
      path.push(1);
      edges.push({ from: 0, to: 1 });
      sequence.push({
        nodeId: 0,
        description: `Attendance is ${data.attendanceRate}% (< 70%) → Taking left branch`,
        visibleNodes: [...path],
        visibleEdges: [...edges]
      });
      sequence.push({
        nodeId: 1,
        description: 'Evaluating homework completion...',
        visibleNodes: [...path],
        visibleEdges: [...edges]
      });

      // Homework decision
      if (data.homeworkCompletion < 50) {
        currentNodeId = 2;
        path.push(2);
        edges.push({ from: 1, to: 2 });
        sequence.push({
          nodeId: 1,
          description: `Homework completion is ${data.homeworkCompletion}% (< 50%) → Final assessment`,
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
        sequence.push({
          nodeId: 2,
          description: 'Student classified as: Low Performance ⚙️',
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
      } else {
        currentNodeId = 3;
        path.push(3);
        edges.push({ from: 1, to: 3 });
        sequence.push({
          nodeId: 1,
          description: `Homework completion is ${data.homeworkCompletion}% (≥ 50%) → Checking parent involvement`,
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
        sequence.push({
          nodeId: 3,
          description: 'Analyzing parent involvement level...',
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });

        // Parent involvement decision
        if (data.parentInvolvement === 'High') {
          currentNodeId = 4;
          path.push(4);
          edges.push({ from: 3, to: 4 });
          sequence.push({
            nodeId: 3,
            description: `Parent involvement is High → Final assessment`,
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
          sequence.push({
            nodeId: 4,
            description: 'Student classified as: Medium Performance 👏',
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
        } else {
          currentNodeId = 5;
          path.push(5);
          edges.push({ from: 3, to: 5 });
          sequence.push({
            nodeId: 3,
            description: `Parent involvement is ${data.parentInvolvement} → Final assessment`,
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
          sequence.push({
            nodeId: 5,
            description: 'Student classified as: Low Performance ⚙️',
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
        }
      }
    } else {
      currentNodeId = 6;
      path.push(6);
      edges.push({ from: 0, to: 6 });
      sequence.push({
        nodeId: 0,
        description: `Attendance is ${data.attendanceRate}% (≥ 70%) → Taking right branch`,
        visibleNodes: [...path],
        visibleEdges: [...edges]
      });
      sequence.push({
        nodeId: 6,
        description: 'Evaluating quiz score...',
        visibleNodes: [...path],
        visibleEdges: [...edges]
      });

      // Quiz score decision
      if (data.quizScore > 75) {
        currentNodeId = 7;
        path.push(7);
        edges.push({ from: 6, to: 7 });
        sequence.push({
          nodeId: 6,
          description: `Quiz score is ${data.quizScore} (> 75) → Final assessment`,
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
        sequence.push({
          nodeId: 7,
          description: 'Student classified as: High Performance! ⭐',
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
      } else {
        currentNodeId = 8;
        path.push(8);
        edges.push({ from: 6, to: 8 });
        sequence.push({
          nodeId: 6,
          description: `Quiz score is ${data.quizScore} (≤ 75) → Checking participation`,
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });
        sequence.push({
          nodeId: 8,
          description: 'Analyzing class participation level...',
          visibleNodes: [...path],
          visibleEdges: [...edges]
        });

        // Participation decision
        if (data.participation === 'High') {
          currentNodeId = 9;
          path.push(9);
          edges.push({ from: 8, to: 9 });
          sequence.push({
            nodeId: 8,
            description: `Participation is High → Final assessment`,
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
          sequence.push({
            nodeId: 9,
            description: 'Student classified as: Medium Performance 👏',
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
        } else {
          currentNodeId = 10;
          path.push(10);
          edges.push({ from: 8, to: 10 });
          sequence.push({
            nodeId: 8,
            description: `Participation is ${data.participation} → Checking study hours`,
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });
          sequence.push({
            nodeId: 10,
            description: 'Evaluating weekly study hours...',
            visibleNodes: [...path],
            visibleEdges: [...edges]
          });

          // Study hours decision
          if (data.studyHours < 3) {
            currentNodeId = 11;
            path.push(11);
            edges.push({ from: 10, to: 11 });
            sequence.push({
              nodeId: 10,
              description: `Study hours: ${data.studyHours} hours/week (< 3) → Final assessment`,
              visibleNodes: [...path],
              visibleEdges: [...edges]
            });
            sequence.push({
              nodeId: 11,
              description: 'Student classified as: Medium Performance 👏',
              visibleNodes: [...path],
              visibleEdges: [...edges]
            });
          } else {
            currentNodeId = 12;
            path.push(12);
            edges.push({ from: 10, to: 12 });
            sequence.push({
              nodeId: 10,
              description: `Study hours: ${data.studyHours} hours/week (≥ 3) → Final assessment`,
              visibleNodes: [...path],
              visibleEdges: [...edges]
            });
            sequence.push({
              nodeId: 12,
              description: 'Student classified as: High Performance! ⭐',
              visibleNodes: [...path],
              visibleEdges: [...edges]
            });
          }
        }
      }
    }

    return sequence;
  }
}
