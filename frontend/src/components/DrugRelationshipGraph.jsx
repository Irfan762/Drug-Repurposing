import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Pill, Target, Dna, Activity } from 'lucide-react';

const DrugNode = ({ data }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'drug': return Pill;
      case 'target': return Target;
      case 'pathway': return Dna;
      case 'indication': return Activity;
      default: return Pill;
    }
  };

  const Icon = getIcon();
  
  const getColors = () => {
    switch (data.type) {
      case 'drug': return 'border-blue-400 bg-blue-900/30 text-blue-300';
      case 'target': return 'border-purple-400 bg-purple-900/30 text-purple-300';
      case 'pathway': return 'border-green-400 bg-green-900/30 text-green-300';
      case 'indication': return 'border-orange-400 bg-orange-900/30 text-orange-300';
      default: return 'border-slate-400 bg-slate-900/30 text-slate-300';
    }
  };

  return (
    <div className={`
      px-3 py-2 rounded-lg border-2 min-w-[120px] text-center transition-all duration-300
      ${getColors()} shadow-lg backdrop-blur-sm hover:scale-105
    `}>
      <div className="flex items-center justify-center gap-2 mb-1">
        <Icon className="w-4 h-4" />
        <span className="font-bold text-xs">{data.label}</span>
      </div>
      {data.score && (
        <div className="text-xs opacity-75">
          Score: {Math.round(data.score * 100)}%
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  drugNode: DrugNode,
};

export function DrugRelationshipGraph({ candidates = [] }) {
  const { nodes, edges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    
    if (candidates.length === 0) {
      // Demo data when no candidates
      const demoNodes = [
        { id: 'query', type: 'input', position: { x: 400, y: 50 }, 
          data: { label: 'Alzheimer\'s Disease' }, 
          style: { background: '#6366f1', color: 'white', borderRadius: '8px' }
        },
        { id: 'drug1', type: 'drugNode', position: { x: 200, y: 200 }, 
          data: { label: 'Metformin', type: 'drug', score: 0.89 }
        },
        { id: 'drug2', type: 'drugNode', position: { x: 400, y: 200 }, 
          data: { label: 'Donepezil', type: 'drug', score: 0.85 }
        },
        { id: 'drug3', type: 'drugNode', position: { x: 600, y: 200 }, 
          data: { label: 'Pioglitazone', type: 'drug', score: 0.82 }
        },
        { id: 'target1', type: 'drugNode', position: { x: 150, y: 350 }, 
          data: { label: 'AMPK', type: 'target' }
        },
        { id: 'target2', type: 'drugNode', position: { x: 350, y: 350 }, 
          data: { label: 'AChE', type: 'target' }
        },
        { id: 'target3', type: 'drugNode', position: { x: 550, y: 350 }, 
          data: { label: 'PPARγ', type: 'target' }
        },
        { id: 'pathway1', type: 'drugNode', position: { x: 250, y: 500 }, 
          data: { label: 'Glucose Metabolism', type: 'pathway' }
        },
        { id: 'pathway2', type: 'drugNode', position: { x: 450, y: 500 }, 
          data: { label: 'Neuroinflammation', type: 'pathway' }
        },
      ];

      const demoEdges = [
        { id: 'query-drug1', source: 'query', target: 'drug1', animated: true },
        { id: 'query-drug2', source: 'query', target: 'drug2', animated: true },
        { id: 'query-drug3', source: 'query', target: 'drug3', animated: true },
        { id: 'drug1-target1', source: 'drug1', target: 'target1' },
        { id: 'drug2-target2', source: 'drug2', target: 'target2' },
        { id: 'drug3-target3', source: 'drug3', target: 'target3' },
        { id: 'target1-pathway1', source: 'target1', target: 'pathway1' },
        { id: 'target2-pathway2', source: 'target2', target: 'pathway2' },
        { id: 'target3-pathway1', source: 'target3', target: 'pathway1' },
        { id: 'target3-pathway2', source: 'target3', target: 'pathway2' },
      ];

      return { nodes: demoNodes, edges: demoEdges };
    }

    // Build graph from actual candidates
    let nodeId = 0;
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    // Add center query node
    nodes.push({
      id: 'center',
      type: 'input',
      position: { x: centerX, y: centerY },
      data: { label: 'Drug Query' },
      style: { background: '#6366f1', color: 'white', borderRadius: '8px' }
    });

    // Add drug nodes in a circle
    candidates.slice(0, 8).forEach((candidate, index) => {
      const angle = (index * 2 * Math.PI) / Math.min(candidates.length, 8);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const drugId = `drug-${nodeId++}`;
      nodes.push({
        id: drugId,
        type: 'drugNode',
        position: { x, y },
        data: {
          label: candidate.drug,
          type: 'drug',
          score: candidate.score
        }
      });

      // Connect to center
      edges.push({
        id: `center-${drugId}`,
        source: 'center',
        target: drugId,
        animated: true,
        style: { stroke: '#8b5cf6' }
      });

      // Add target nodes for this drug
      if (candidate.sources && candidate.sources.length > 0) {
        candidate.sources.slice(0, 2).forEach((source, srcIndex) => {
          const targetId = `target-${drugId}-${srcIndex}`;
          const targetAngle = angle + (srcIndex - 0.5) * 0.3;
          const targetRadius = radius + 100;
          const targetX = centerX + targetRadius * Math.cos(targetAngle);
          const targetY = centerY + targetRadius * Math.sin(targetAngle);

          nodes.push({
            id: targetId,
            type: 'drugNode',
            position: { x: targetX, y: targetY },
            data: {
              label: source.docId.split(':')[0],
              type: 'target'
            }
          });

          edges.push({
            id: `${drugId}-${targetId}`,
            source: drugId,
            target: targetId,
            style: { stroke: '#10b981' }
          });
        });
      }
    });

    return { nodes, edges };
  }, [candidates]);

  const [flowNodes, , onNodesChange] = useNodesState(nodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(edges);

  return (
    <div className="w-full h-[600px] bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls className="bg-slate-800 border-slate-600" />
        <MiniMap 
          className="bg-slate-800 border-slate-600"
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'drug': return '#3b82f6';
              case 'target': return '#8b5cf6';
              case 'pathway': return '#10b981';
              case 'indication': return '#f59e0b';
              default: return '#64748b';
            }
          }}
        />
        <Background variant="dots" gap={12} size={1} color="#475569" />
      </ReactFlow>
    </div>
  );
}