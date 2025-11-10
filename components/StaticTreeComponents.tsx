import React from 'react';
import { TreeNode } from './StudentAnalyzerComponent';
import { CardiologistTreeNode } from './CardiologistTree';

// ==================== STATIC STUDENT TREE VISUALIZATION ====================
export const StaticStudentTreeVisualization: React.FC = () => {
  // Repositioned nodes with better spacing to prevent overlapping
  const nodes: TreeNode[] = [
    { id: 0, x: 500, y: 60, label: 'Attendance\nRate', level: 0, parent: null },
    
    // Left branch
    { id: 1, x: 250, y: 160, label: 'Homework', level: 1, parent: 0, decision: '< 70%' },
    { id: 2, x: 120, y: 260, label: 'Low\nPerformance', level: 2, parent: 1, decision: '< 50%', isLeaf: true, outcome: 'error' },
    { id: 3, x: 380, y: 260, label: 'Parent\nInvolvement', level: 2, parent: 1, decision: '≥ 50%' },
    { id: 4, x: 280, y: 380, label: 'Medium\nPerformance', level: 3, parent: 3, decision: 'High', isLeaf: true, outcome: 'warning' },
    { id: 5, x: 450, y: 380, label: 'Low\nPerformance', level: 3, parent: 3, decision: 'Low/Medium', isLeaf: true, outcome: 'error' },
    
    // Right branch
    { id: 6, x: 750, y: 160, label: 'Quiz Score', level: 1, parent: 0, decision: '≥ 70%' },
    { id: 7, x: 880, y: 260, label: 'High\nPerformance', level: 2, parent: 6, decision: '> 75', isLeaf: true, outcome: 'success' },
    { id: 8, x: 620, y: 260, label: 'Participation', level: 2, parent: 6, decision: '≤ 75' },
    { id: 9, x: 720, y: 380, label: 'Medium\nPerformance', level: 3, parent: 8, decision: 'High', isLeaf: true, outcome: 'warning' },
    { id: 10, x: 550, y: 380, label: 'Study Hours', level: 3, parent: 8, decision: 'Low' },
    { id: 11, x: 480, y: 500, label: 'Medium\nPerformance', level: 4, parent: 10, decision: '< 3', isLeaf: true, outcome: 'warning' },
    { id: 12, x: 620, y: 500, label: 'High\nPerformance', level: 4, parent: 10, decision: '≥ 3', isLeaf: true, outcome: 'success' },
  ];

  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number): string => {
    const controlPointOffset = Math.abs(x2 - x1) * 0.25;
    return `M ${x1} ${y1} C ${x1} ${y1 + controlPointOffset}, ${x2} ${y2 - controlPointOffset}, ${x2} ${y2}`;
  };

  const getNodeColors = (outcome?: 'success' | 'warning' | 'error') => {
    switch (outcome) {
      case 'success':
        return { start: '#34d399', end: '#059669', border: '#10b981' };
      case 'warning':
        return { start: '#fbbf24', end: '#f97316', border: '#fb923c' };
      case 'error':
        return { start: '#f87171', end: '#be123c', border: '#ef4444' };
      default:
        return { start: '#3b82f6', end: '#6366f1', border: '#60a5fa' };
    }
  };

  return (
    <div className="relative w-full bg-slate-900/50 rounded-xl overflow-x-auto border border-slate-700/50 p-4">
      <svg className="w-full h-[580px]" viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="static-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Draw edges first */}
        {nodes.map(node => {
          if (node.parent !== null) {
            const parentNode = nodes.find(n => n.id === node.parent);
            if (!parentNode) return null;
            
            const path = getCurvedPath(parentNode.x, parentNode.y + 25, node.x, node.y - 25);
            const midX = (parentNode.x + node.x) / 2;
            const midY = (parentNode.y + node.y) / 2;

            return (
              <g key={`edge-${node.id}`}>
                <path
                  d={path}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <circle cx={node.x} cy={node.y - 25} r="3" fill="#64748b" />
                
                {/* Decision label */}
                <g transform={`translate(${midX}, ${midY - 15})`}>
                  <rect 
                    x="-32" 
                    y="-10" 
                    width="64" 
                    height="20" 
                    rx="10" 
                    fill="#1e293b" 
                    stroke="#475569" 
                    strokeWidth="1" 
                    opacity="0.95" 
                  />
                  <text 
                    x="0" 
                    y="4" 
                    fill="#94a3b8" 
                    fontSize="10" 
                    fontWeight="600" 
                    textAnchor="middle"
                  >
                    {node.decision}
                  </text>
                </g>
              </g>
            );
          }
          return null;
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const colors = getNodeColors(node.outcome);
          const isLeafNode = node.isLeaf;
          
          return (
            <g key={node.id}>
              {/* Node background shadow */}
              <rect 
                x={node.x - 47} 
                y={node.y - 23} 
                width="94" 
                height="46" 
                rx="8" 
                fill="#0f172a" 
              />
              
              {/* Node main */}
              <rect 
                x={node.x - 45} 
                y={node.y - 25} 
                width="90" 
                height="50" 
                rx="8" 
                fill={`url(#node-gradient-static-${node.id})`} 
                filter="url(#static-glow)" 
              />
              <rect 
                x={node.x - 45} 
                y={node.y - 25} 
                width="90" 
                height="50" 
                rx="8" 
                fill="none" 
                stroke={colors.border} 
                strokeWidth="1.5" 
                opacity="0.8" 
              />
              
              <defs>
                <linearGradient id={`node-gradient-static-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.start} />
                  <stop offset="100%" stopColor={colors.end} />
                </linearGradient>
              </defs>

              {/* Node label - handle multiline */}
              {node.label.split('\n').map((line, idx) => (
                <text 
                  key={idx}
                  x={node.x} 
                  y={node.y + (node.label.split('\n').length === 1 ? 4 : -6 + idx * 12)} 
                  fill="white" 
                  fontSize="11" 
                  fontWeight="700" 
                  textAnchor="middle"
                >
                  {line}
                </text>
              ))}

              {/* Outcome icon for leaf nodes */}
              {isLeafNode && (
                <text x={node.x} y={node.y + 42} fontSize="16" textAnchor="middle">
                  {node.outcome === 'success' ? '⭐' : node.outcome === 'error' ? '⚙️' : '👏'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ==================== STATIC CARDIOLOGIST TREE VISUALIZATION ====================
export const StaticCardiologistTreeVisualization: React.FC = () => {
  // Repositioned nodes with better spacing to prevent overlapping
const nodes: CardiologistTreeNode[] = [
  { id: 0, x: 500, y: 60, label: 'Chest Pain', level: 0, parent: null },
  
  // Left branch - increased spacing to prevent overlap
  { id: 1, x: 230, y: 160, label: 'ECG', level: 1, parent: 0, decision: 'Severe/Radiating' },
  { id: 2, x: 90, y: 260, label: 'Immediate\nHospitalization', level: 2, parent: 1, decision: 'Abnormal', isLeaf: true, outcome: 'emergency' },
  { id: 3, x: 370, y: 260, label: 'BP', level: 2, parent: 1, decision: 'Normal' },
  { id: 4, x: 240, y: 370, label: 'Cholesterol', level: 3, parent: 3, decision: '≥ 140/90' },
  { id: 5, x: 110, y: 480, label: 'Prescribe Statins\n+ Monitoring', level: 4, parent: 4, decision: '≥ 240', isLeaf: true, outcome: 'treatment' },
  { id: 6, x: 370, y: 480, label: 'Lifestyle\nModification', level: 4, parent: 4, decision: '< 240', isLeaf: true, outcome: 'lifestyle' },
  { id: 7, x: 480, y: 370, label: 'Lifestyle\nChanges', level: 3, parent: 3, decision: '< 140/90', isLeaf: true, outcome: 'lifestyle' },
  
  // Right branch - better horizontal distribution
  { id: 8, x: 840, y: 160, label: 'ECG', level: 1, parent: 0, decision: 'Mild/Occasional' },
  { id: 9, x: 730, y: 260, label: 'BP', level: 2, parent: 8, decision: 'Abnormal' },
  { id: 10, x: 630, y: 370, label: 'Lifestyle\nChanges', level: 3, parent: 9, decision: '≥ 140/90', isLeaf: true, outcome: 'lifestyle' },
  { id: 11, x: 800, y: 370, label: 'Diet + Exercise\nCounseling', level: 3, parent: 9, decision: '< 140/90', isLeaf: true, outcome: 'counseling' },
  { id: 12, x: 980, y: 260, label: 'Diet + Exercise\nCounseling', level: 2, parent: 8, decision: 'Normal', isLeaf: true, outcome: 'counseling' },
];

  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number): string => {
    const controlPointOffset = Math.abs(x2 - x1) * 0.25;
    return `M ${x1} ${y1} C ${x1} ${y1 + controlPointOffset}, ${x2} ${y2 - controlPointOffset}, ${x2} ${y2}`;
  };

  const getNodeColors = (outcome?: 'emergency' | 'treatment' | 'lifestyle' | 'counseling') => {
    switch (outcome) {
      case 'emergency':
        return { start: '#ef4444', end: '#be123c', border: '#dc2626' };
      case 'treatment':
        return { start: '#fb923c', end: '#f59e0b', border: '#f97316' };
      case 'lifestyle':
        return { start: '#3b82f6', end: '#06b6d4', border: '#0ea5e9' };
      case 'counseling':
        return { start: '#10b981', end: '#14b8a6', border: '#059669' };
      default:
        return { start: '#ef4444', end: '#be123c', border: '#dc2626' };
    }
  };

  return (
    <div className="relative w-full bg-slate-900/50 rounded-xl overflow-x-auto border border-slate-700/50 p-4">
      <svg className="w-full h-[540px]" viewBox="0 0 1000 540" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="static-cardio-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Draw edges first */}
        {nodes.map(node => {
          if (node.parent !== null) {
            const parentNode = nodes.find(n => n.id === node.parent);
            if (!parentNode) return null;
            
            const path = getCurvedPath(parentNode.x, parentNode.y + 30, node.x, node.y - 30);
            const midX = (parentNode.x + node.x) / 2;
            const midY = (parentNode.y + node.y) / 2;

            return (
              <g key={`edge-${node.id}`}>
                <path
                  d={path}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <circle cx={node.x} cy={node.y - 30} r="3" fill="#64748b" />
                
                {/* Decision label */}
                <g transform={`translate(${midX}, ${midY - 15})`}>
                  <rect 
                    x="-42" 
                    y="-10" 
                    width="84" 
                    height="20" 
                    rx="10" 
                    fill="#1e293b" 
                    stroke="#475569" 
                    strokeWidth="1" 
                    opacity="0.95" 
                  />
                  <text 
                    x="0" 
                    y="4" 
                    fill="#94a3b8" 
                    fontSize="10" 
                    fontWeight="600" 
                    textAnchor="middle"
                  >
                    {node.decision}
                  </text>
                </g>
              </g>
            );
          }
          return null;
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const colors = getNodeColors(node.outcome);
          const isLeafNode = node.isLeaf;
          
          return (
            <g key={node.id}>
              {/* Node background shadow */}
              <rect 
                x={node.x - 52} 
                y={node.y - 28} 
                width="104" 
                height="56" 
                rx="10" 
                fill="#0f172a" 
              />
              
              {/* Node main */}
              <rect 
                x={node.x - 50} 
                y={node.y - 30} 
                width="100" 
                height="60" 
                rx="10" 
                fill={`url(#node-gradient-static-cardio-${node.id})`} 
                filter="url(#static-cardio-glow)" 
              />
              <rect 
                x={node.x - 50} 
                y={node.y - 30} 
                width="100" 
                height="60" 
                rx="10" 
                fill="none" 
                stroke={colors.border} 
                strokeWidth="1.5" 
                opacity="0.8" 
              />
              
              <defs>
                <linearGradient id={`node-gradient-static-cardio-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.start} />
                  <stop offset="100%" stopColor={colors.end} />
                </linearGradient>
              </defs>

              {/* Node label - handle multiline */}
              {node.label.split('\n').map((line, idx) => (
                <text 
                  key={idx}
                  x={node.x} 
                  y={node.y + (node.label.split('\n').length === 1 ? 4 : -6 + idx * 12)} 
                  fill="white" 
                  fontSize="11" 
                  fontWeight="700" 
                  textAnchor="middle"
                >
                  {line}
                </text>
              ))}

              {/* Outcome icon for leaf nodes */}
              {isLeafNode && (
                <text x={node.x} y={node.y + 48} fontSize="18" textAnchor="middle">
                  {node.outcome === 'emergency' ? '🚨' : 
                   node.outcome === 'treatment' ? '💊' : 
                   node.outcome === 'lifestyle' ? '🏃' : '🥗'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
