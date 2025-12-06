import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Brain, Database, FileText, TrendingUp, Shield, Gavel, Activity } from 'lucide-react';

const iconMap = {
  master: Brain,
  clinical: Activity,
  genomics: Database,
  research: FileText,
  market: TrendingUp,
  safety: Shield,
  patent: Gavel,
};

const AgentNode = ({ data }) => {
  const Icon = iconMap[data.type] || Brain;
  const isCompleted = data.status === 'completed';
  const isRunning = data.status === 'running';
  
  return (
    <div className={`
      px-4 py-3 rounded-xl border-2 min-w-[140px] text-center transition-all duration-300
      ${isCompleted ? 'border-emerald-400 bg-emerald-900/30 shadow-emerald-400/50' : 
        isRunning ? 'border-purple-400 bg-purple-900/30 shadow-purple-400/50 animate-pulse' : 
        'border-slate-600 bg-slate-800/50'}
      shadow-lg backdrop-blur-sm
    `}>
      <div className="flex items-center justify-center gap-2 mb-1">
        <Icon className={`w-5 h-5 ${
          isCompleted ? 'text-emerald-400' : 
          isRunning ? 'text-purple-400' : 
          'text-slate-400'
        }`} />
        <span className="font-bold text-white text-sm">{data.label}</span>
      </div>
      <div className={`text-xs ${
        isCompleted ? 'text-emerald-300' : 
        isRunning ? 'text-purple-300' : 
        'text-slate-400'
      }`}>
        {data.progress}% • {data.status}
      </div>
    </div>
  );
};

const nodeTypes = {
  agentNode: AgentNode,
};

export function AgentWorkflowGraph({ agentStatus = [] }) {
  const initialNodes = useMemo(() => {
    const nodes = [
      {
        id: 'query',
        type: 'input',
        position: { x: 400, y: 50 },
        data: { label: 'User Query' },
        style: {
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          border: '2px solid #a855f7',
          borderRadius: '12px',
          fontWeight: 'bold',
        },
      },
      {
        id: 'master',
        type: 'agentNode',
        position: { x: 400, y: 150 },
        data: { 
          label: 'Master Agent', 
          type: 'master',
          status: 'completed',
          progress: 100
        },
      },
    ];

    // Add agent nodes
    const agentPositions = [
      { x: 150, y: 280 }, // Clinical
      { x: 300, y: 280 }, // Genomics  
      { x: 450, y: 280 }, // Research
      { x: 600, y: 280 }, // Market
      { x: 750, y: 280 }, // Patent
      { x: 900, y: 280 }, // Safety
    ];

    const agentNames = ['clinical', 'genomics', 'research', 'market', 'patent', 'safety'];
    
    agentNames.forEach((agentName, index) => {
      const status = agentStatus.find(a => a.agent.toLowerCase() === agentName);
      nodes.push({
        id: agentName,
        type: 'agentNode',
        position: agentPositions[index],
        data: {
          label: agentName.charAt(0).toUpperCase() + agentName.slice(1),
          type: agentName,
          status: status?.state || 'pending',
          progress: status?.progress || 0,
        },
      });
    });

    // Add aggregation node
    nodes.push({
      id: 'aggregator',
      type: 'agentNode',
      position: { x: 525, y: 400 },
      data: {
        label: 'Result Aggregator',
        type: 'master',
        status: agentStatus.every(a => a.progress >= 100) ? 'completed' : 'pending',
        progress: agentStatus.every(a => a.progress >= 100) ? 100 : 0,
      },
    });

    // Add output node
    nodes.push({
      id: 'output',
      type: 'output',
      position: { x: 525, y: 500 },
      data: { label: 'Ranked Candidates' },
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        border: '2px solid #047857',
        borderRadius: '12px',
        fontWeight: 'bold',
      },
    });

    return nodes;
  }, [agentStatus]);

  const initialEdges = useMemo(() => [
    { id: 'query-master', source: 'query', target: 'master', animated: true },
    { id: 'master-clinical', source: 'master', target: 'clinical', animated: true },
    { id: 'master-genomics', source: 'master', target: 'genomics', animated: true },
    { id: 'master-research', source: 'master', target: 'research', animated: true },
    { id: 'master-market', source: 'master', target: 'market', animated: true },
    { id: 'master-patent', source: 'master', target: 'patent', animated: true },
    { id: 'master-safety', source: 'master', target: 'safety', animated: true },
    { id: 'clinical-aggregator', source: 'clinical', target: 'aggregator' },
    { id: 'genomics-aggregator', source: 'genomics', target: 'aggregator' },
    { id: 'research-aggregator', source: 'research', target: 'aggregator' },
    { id: 'market-aggregator', source: 'market', target: 'aggregator' },
    { id: 'patent-aggregator', source: 'patent', target: 'aggregator' },
    { id: 'safety-aggregator', source: 'safety', target: 'aggregator' },
    { id: 'aggregator-output', source: 'aggregator', target: 'output', animated: true },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-[600px] bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls className="bg-slate-800 border-slate-600" />
        <MiniMap 
          className="bg-slate-800 border-slate-600"
          nodeColor={(node) => {
            if (node.data?.status === 'completed') return '#10b981';
            if (node.data?.status === 'running') return '#8b5cf6';
            return '#64748b';
          }}
        />
        <Background variant="dots" gap={12} size={1} color="#475569" />
      </ReactFlow>
    </div>
  );
}