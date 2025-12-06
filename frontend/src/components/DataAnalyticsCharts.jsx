import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export function CandidateScoreChart({ candidates = [] }) {
  const data = candidates.slice(0, 10).map((candidate, index) => ({
    name: candidate.drug,
    score: Math.round(candidate.score * 100),
    rank: index + 1,
  }));

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📊 Candidate Confidence Scores
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Bar 
            dataKey="score" 
            fill="url(#colorGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.6}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DataSourceDistribution({ candidates = [] }) {
  const sourceTypes = {};
  
  candidates.forEach(candidate => {
    candidate.sources?.forEach(source => {
      const type = source.docId.includes('PMID') ? 'PubMed' :
                   source.docId.includes('NCT') ? 'Clinical Trials' :
                   source.docId.includes('US') ? 'Patents' :
                   source.docId.includes('DrugBank') ? 'DrugBank' : 'Other';
      sourceTypes[type] = (sourceTypes[type] || 0) + 1;
    });
  });

  const data = Object.entries(sourceTypes).map(([name, value]) => ({ name, value }));

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        🗂️ Evidence Source Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AgentPerformanceRadar({ agentStatus = [] }) {
  const data = agentStatus.map(agent => ({
    agent: agent.agent,
    progress: agent.progress,
    efficiency: Math.random() * 40 + 60, // Mock efficiency score
    accuracy: Math.random() * 20 + 80,   // Mock accuracy score
  }));

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        🎯 Agent Performance Analysis
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="agent" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="Progress"
            dataKey="progress"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.3}
          />
          <Radar
            name="Efficiency"
            dataKey="efficiency"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Radar
            name="Accuracy"
            dataKey="accuracy"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.3}
          />
          <Legend />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScoreVsMarketChart({ candidates = [] }) {
  const data = candidates.map(candidate => ({
    name: candidate.drug,
    score: candidate.score * 100,
    market: candidate.marketEstimate ? 
      parseFloat(candidate.marketEstimate.replace(/[^0-9.]/g, '')) || Math.random() * 10 + 1 :
      Math.random() * 10 + 1,
  }));

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        💰 Confidence Score vs Market Potential
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#374151" />
          <XAxis 
            type="number" 
            dataKey="score" 
            name="Confidence Score"
            stroke="#9ca3af"
            domain={[60, 100]}
          />
          <YAxis 
            type="number" 
            dataKey="market" 
            name="Market Size ($B)"
            stroke="#9ca3af"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value, name) => [
              name === 'score' ? `${value}%` : `$${value}B`,
              name === 'score' ? 'Confidence' : 'Market Size'
            ]}
          />
          <Scatter name="Drugs" data={data} fill="#8b5cf6" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}