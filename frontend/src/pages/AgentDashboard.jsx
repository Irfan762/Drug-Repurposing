/**
 * AgentDashboard
 * Real-time monitoring dashboard for AI agent orchestration
 * Displays live status, progress, and logs for all active agents
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AgentStatusCard } from '../components/AgentStatusCard';
import { LiveLogs } from '../components/LiveLogs';
import { useJobStatus } from '../hooks';
import { AGENTS, AGENT_STATUS, UI_CONFIG } from '../constants';
import { formatDuration } from '../utils/formatters';
import { FileText, TrendingUp, CheckCircle2, Clock, Zap, Sparkles, AlertCircle } from 'lucide-react';

// Agent tasks that will cycle through during execution
const AGENT_TASKS = {
    Clinical: [
        'Initializing ClinicalTrials.gov API...',
        'Querying 50,000+ clinical trials...',
        'Analyzing Phase II/III outcomes...',
        'Extracting adverse event data...',
        'Validating efficacy signals...',
        'Compiling trial metadata...'
    ],
    Genomics: [
        'Connecting to AlphaFold2 endpoint...',
        'Loading protein interaction networks...',
        'Analyzing binding affinity predictions...',
        'Validating pathway engagement...',
        'Processing STRING database...',
        'Finalizing target confidence scores...'
    ],
    Research: [
        'Initializing PubMed search engine...',
        'Mining 5,000+ research papers...',
        'Extracting key findings...',
        'Analyzing publication trends...',
        'Computing h-index scores...',
        'Aggregating evidence chains...'
    ],
    Market: [
        'Connecting to market intelligence APIs...',
        'Analyzing competitive landscape...',
        'Calculating market size projections...',
        'Assessing reimbursement outlook...',
        'Evaluating pricing strategies...',
        'Finalizing commercial viability...'
    ],
    Patent: [
        'Querying USPTO database...',
        'Scanning EPO patent registry...',
        'Analyzing prior art landscape...',
        'Checking blocking patents...',
        'Evaluating FTO status...',
        'Compiling IP risk assessment...'
    ],
    Safety: [
        'Accessing FDA AERS database...',
        'Analyzing toxicity profiles...',
        'Reviewing black box warnings...',
        'Processing adverse event reports...',
        'Validating safety margins...',
        'Generating risk summary...'
    ],
    EXIM: [
        'Connecting to trade databases...',
        'Analyzing import/export volumes...',
        'Assessing supply chain risks...',
        'Evaluating tariff impacts...',
        'Reviewing sourcing strategies...',
        'Finalizing logistics analysis...'
    ],
    Internal: [
        'Scanning internal knowledge base...',
        'Analyzing strategy documents...',
        'Extracting field insights...',
        'Reviewing competitive intelligence...',
        'Assessing resource availability...',
        'Compiling organizational alignment...'
    ]
};

export default function AgentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get jobId from route state or generate demo ID
  const jobId = useMemo(() => {
    return location.state?.jobId || `#${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }, [location.state?.jobId]);

  const isRealJob = Boolean(location.state?.jobId);
  
  // State management
  const [agents, setAgents] = useState([]);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [systemStatus, setSystemStatus] = useState('initializing');

  // Use custom hook for real job status (only if we have a real jobId)
  const { 
    status: backendStatus, 
    agents: backendAgents, 
    error: backendError 
  } = useJobStatus(jobId, {
    enabled: isRealJob,
    pollingInterval: UI_CONFIG.POLLING_INTERVAL,
    onComplete: useCallback(() => {
      setSystemStatus('completed');
    }, []),
  });

  // Initialize agents with staggered start
  useEffect(() => {
    const agentNames = [
      AGENTS.CLINICAL,
      AGENTS.GENOMICS,
      AGENTS.RESEARCH,
      AGENTS.MARKET,
      AGENTS.PATENT,
      AGENTS.SAFETY,
    ];

    const initialAgents = agentNames.map((name, index) => ({
      name,
      status: AGENT_STATUS.IDLE,
      task: 'Waiting for initialization...',
      progress: 0,
      currentTaskIndex: 0,
      startDelay: index * 500, // Stagger start by 500ms each
    }));

    setAgents(initialAgents);

    // Set system to running after brief initialization
    const timer = setTimeout(() => setSystemStatus('running'), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate realistic agent execution (fallback if backend not available)
  useEffect(() => {
    if (systemStatus !== 'running' || isRealJob) return;

    const agentInterval = setInterval(() => {
      setAgents((prevAgents) => {
        return prevAgents.map((agent) => {
          const timeSinceStart = Date.now() - startTime;

          // Agent hasn't started yet (staggered start)
          if (timeSinceStart < agent.startDelay) {
            return { 
              ...agent, 
              status: AGENT_STATUS.PENDING, 
              task: 'Queued for execution...' 
            };
          }

          // Agent is completed
          if (agent.status === AGENT_STATUS.COMPLETED) {
            return agent;
          }

          // Calculate progress (each agent takes 15-25 seconds)
          const agentRuntime = timeSinceStart - agent.startDelay;
          const targetDuration = 15000 + Math.random() * 10000;
          let newProgress = Math.min(100, (agentRuntime / targetDuration) * 100);

          // Add some randomness for realism
          newProgress += Math.random() * 3 - 1.5;
          newProgress = Math.max(agent.progress, Math.min(100, newProgress));

          // Determine task based on progress
          const tasks = AGENT_TASKS[agent.name] || [];
          const taskIndex = Math.min(
            tasks.length - 1,
            Math.floor((newProgress / 100) * tasks.length)
          );

          const newStatus = newProgress >= 100 
            ? AGENT_STATUS.COMPLETED 
            : AGENT_STATUS.RUNNING;
          
          const newTask = newProgress >= 100
            ? `✓ Analysis complete - ${Math.floor(Math.random() * 500 + 100)} results`
            : tasks[taskIndex] || 'Processing...';

          return {
            ...agent,
            status: newStatus,
            task: newTask,
            progress: Math.round(newProgress),
            currentTaskIndex: taskIndex,
          };
        });
      });
    }, 300);

    return () => clearInterval(agentInterval);
  }, [systemStatus, startTime, isRealJob]);

  // Update elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Update agents with real backend data
  useEffect(() => {
    if (!isRealJob || !backendAgents || backendAgents.length === 0) return;

    setAgents((prevAgents) => {
      return prevAgents.map((agent) => {
        const backendAgent = backendAgents.find(
          (a) => a.agent.toLowerCase() === agent.name.toLowerCase()
        );

        if (backendAgent) {
          const newStatus = backendAgent.state || agent.status;
          const newProgress = backendAgent.progress ?? agent.progress;
          
          // Ensure completed agents show 100% progress
          const finalProgress = newStatus === AGENT_STATUS.COMPLETED ? 100 : newProgress;
          
          return {
            ...agent,
            status: newStatus,
            progress: finalProgress,
            task: backendAgent.task || agent.task,
          };
        }
        return agent;
      });
    });

    // Update system status based on backend
    if (backendStatus) {
      setSystemStatus(backendStatus);
    }
  }, [backendAgents, backendStatus, isRealJob]);

  // Calculate statistics
  const stats = useMemo(() => {
    const completedCount = agents.filter((a) => a.status === AGENT_STATUS.COMPLETED).length;
    const runningCount = agents.filter((a) => a.status === AGENT_STATUS.RUNNING).length;
    const pendingCount = agents.filter(
      (a) => a.status === AGENT_STATUS.PENDING || a.status === AGENT_STATUS.IDLE
    ).length;
    const errorCount = agents.filter((a) => a.status === AGENT_STATUS.ERROR).length;
    
    const overallProgress = agents.length > 0
      ? Math.round(agents.reduce((sum, a) => sum + a.progress, 0) / agents.length)
      : 0;

    const allCompleted = completedCount === agents.length && agents.length > 0;

    return {
      completedCount,
      runningCount,
      pendingCount,
      errorCount,
      overallProgress,
      allCompleted,
    };
  }, [agents]);

  // Navigation handlers
  const handleViewResults = useCallback(() => {
    navigate('/candidates', { state: { jobId, query: location.state?.query } });
  }, [navigate, jobId, location.state?.query]);

  const handleViewExplainability = useCallback(() => {
    navigate('/explain', { state: { jobId } });
  }, [navigate, jobId]);

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {backendError && (
        <div className="glass-ultra p-6 rounded-2xl border-2 border-red-500/30 bg-red-500/5 slide-in-bottom">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-1">Connection Error</h3>
              <p className="text-gray-300">
                {backendError.message || 'Unable to connect to backend. Running in demo mode.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Header with Live Stats */}
      <div className="glass-ultra p-8 rounded-3xl relative overflow-hidden slide-in-bottom">
        {/* Animated background effect for running state */}
        {systemStatus === 'running' && !stats.allCompleted && (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 animate-pulse"></div>
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-5xl font-black text-neon-gradient mb-3 flex items-center gap-4">
                Agentic Orchestration
                {systemStatus === 'running' && !stats.allCompleted && (
                  <Sparkles className="w-10 h-10 text-purple-400 animate-pulse icon-glow" />
                )}
              </h2>
              <p className="text-gray-300 text-xl">
                {stats.allCompleted
                  ? '✓ All agents completed successfully'
                  : 'Master Agent coordinating 6 specialist workers'}
              </p>
              {!isRealJob && (
                <p className="text-yellow-400 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Demo Mode - Simulated execution
                </p>
              )}
            </div>
            <div className="badge-neon flex items-center gap-3 px-8 py-4">
              <div 
                className={`w-3 h-3 rounded-full ${
                  stats.allCompleted 
                    ? 'bg-emerald-400 shadow-[0_0_10px_currentColor]' 
                    : 'bg-purple-400 animate-pulse shadow-[0_0_10px_currentColor]'
                }`}
              />
              <span className="text-white font-mono text-base font-bold">{jobId}</span>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-holographic p-6 rounded-2xl scale-in">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg icon-glow">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-black text-neon-gradient">
                    {stats.overallProgress}%
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                    Overall Progress
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 mt-3 overflow-hidden">
                <div
                  className="progress-neon h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.overallProgress}%` }}
                  role="progressbar"
                  aria-valuenow={stats.overallProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>

            <div className="card-holographic p-6 rounded-2xl spotlight-effect scale-in delay-100">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl float-slow">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    {stats.completedCount}/6
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                    Completed
                  </div>
                </div>
              </div>
            </div>

            <div className="card-holographic p-6 rounded-2xl spotlight-effect scale-in delay-200">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl float-slow">
                  <Zap className={`w-7 h-7 text-white ${stats.runningCount > 0 ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    {stats.runningCount}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                    Active Now
                  </div>
                </div>
              </div>
            </div>

            <div className="card-holographic p-6 rounded-2xl spotlight-effect scale-in delay-300">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl float-slow">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-4xl font-black text-neon-gradient">
                    {formatDuration(elapsedTime)}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                    Execution Time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="slide-in-bottom delay-400">
        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full glow-pulse" />
          Worker Agents Status
          {stats.runningCount > 0 && (
            <span className="badge-neon text-xs ml-2">
              {stats.runningCount} active
            </span>
          )}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentStatusCard key={agent.name} {...agent} />
          ))}
        </div>
      </div>

      {/* Live Logs */}
      <div className="slide-in-bottom delay-500">
        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full glow-pulse" />
          System Logs (Real-time)
        </h3>
        <LiveLogs agents={agents} />
      </div>

      {/* Action Bar - Show when analysis is complete */}
      {stats.overallProgress >= 95 && (
        <div 
          className="glass-ultra p-8 rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 text-center scale-in"
          role="alert"
          aria-live="polite"
        >
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-4 glow-pulse shadow-2xl">
              <CheckCircle2 className="w-12 h-12 text-white animate-pulse" />
            </div>
            <p className="text-white font-black text-3xl mb-2 text-neon-gradient">
              Analysis Complete!
            </p>
            <p className="text-gray-300 text-lg">
              {stats.completedCount} agents successfully analyzed your query.
              {stats.allCompleted && ' Ready to view ranked candidates.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewResults}
              className="btn-neon flex items-center gap-4 text-xl px-10 py-5"
              aria-label="View results and export FDA-21 report"
            >
              <FileText className="w-7 h-7" />
              View Results & Export FDA-21 Report
              <Sparkles className="w-6 h-6" />
            </button>
            <button
              onClick={handleViewExplainability}
              className="btn-premium flex items-center gap-4 text-xl px-10 py-5"
              aria-label="View interactive visualizations"
            >
              <TrendingUp className="w-7 h-7" />
              Interactive Visualizations
              <CheckCircle2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
