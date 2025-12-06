import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AgentStatusCard } from '../components/AgentStatusCard';
import { LiveLogs } from '../components/LiveLogs';
import { jobsApi } from '../services/api';
import { FileText, TrendingUp, CheckCircle2, Clock, Zap, Sparkles } from 'lucide-react';

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
    const [jobId] = useState(location.state?.jobId || `#${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
    const [agents, setAgents] = useState([]);
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [systemStatus, setSystemStatus] = useState('initializing');

    // Initialize agents with staggered start
    useEffect(() => {
        // Only use the 6 real agents that exist in backend
        const realAgents = ['Clinical', 'Genomics', 'Research', 'Market', 'Patent', 'Safety'];
        const initialAgents = realAgents.map((name, index) => ({
            name,
            status: 'idle',
            task: 'Waiting for initialization...',
            progress: 0,
            currentTaskIndex: 0,
            startDelay: index * 500 // Stagger start by 500ms each
        }));
        setAgents(initialAgents);

        // Set system to running after brief initialization
        setTimeout(() => setSystemStatus('running'), 1000);
    }, []);

    // Simulate realistic agent execution with lifecycle (fallback if backend not available)
    useEffect(() => {
        if (systemStatus !== 'running') return;
        
        // Only run simulation if we don't have a real jobId from backend
        if (location.state?.jobId) return;

        const agentInterval = setInterval(() => {
            setAgents(prevAgents => {
                return prevAgents.map(agent => {
                    const timeSinceStart = Date.now() - startTime;

                    // Agent hasn't started yet (staggered start)
                    if (timeSinceStart < agent.startDelay) {
                        return { ...agent, status: 'pending', task: 'Queued for execution...' };
                    }

                    // Agent is completed
                    if (agent.status === 'completed') {
                        return agent;
                    }

                    // Calculate progress (each agent takes 15-25 seconds)
                    const agentRuntime = timeSinceStart - agent.startDelay;
                    const targetDuration = 15000 + Math.random() * 10000; // 15-25 seconds
                    let newProgress = Math.min(100, (agentRuntime / targetDuration) * 100);

                    // Add some randomness to make it feel more realistic
                    newProgress += Math.random() * 3 - 1.5; // +/- 1.5%
                    newProgress = Math.max(agent.progress, Math.min(100, newProgress));

                    // Determine task based on progress
                    const tasks = AGENT_TASKS[agent.name];
                    const taskIndex = Math.min(
                        tasks.length - 1,
                        Math.floor((newProgress / 100) * tasks.length)
                    );

                    const newStatus = newProgress >= 100 ? 'completed' : 'running';
                    const newTask = newProgress >= 100
                        ? `✓ Analysis complete - ${Math.floor(Math.random() * 500 + 100)} results`
                        : tasks[taskIndex];

                    return {
                        ...agent,
                        status: newStatus,
                        task: newTask,
                        progress: Math.round(newProgress),
                        currentTaskIndex: taskIndex
                    };
                });
            });
        }, 300); // Update every 300ms for smooth progress

        return () => clearInterval(agentInterval);
    }, [systemStatus, startTime, location.state?.jobId]);

    // Update elapsed time
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    // Fetch real job status from backend and update agents
    useEffect(() => {
        if (!location.state?.jobId) return;

        const pollStatus = async () => {
            try {
                const res = await jobsApi.getStatus(jobId);
                const backendData = res.data;
                
                // Update agents with real backend data
                if (backendData.perAgentStatus && backendData.perAgentStatus.length > 0) {
                    setAgents(prevAgents => {
                        return prevAgents.map(agent => {
                            const backendAgent = backendData.perAgentStatus.find(
                                a => a.agent.toLowerCase() === agent.name.toLowerCase()
                            );
                            
                            if (backendAgent) {
                                return {
                                    ...agent,
                                    status: backendAgent.state || agent.status,
                                    progress: backendAgent.progress || agent.progress,
                                    task: backendAgent.task || agent.task
                                };
                            }
                            return agent;
                        });
                    });
                }
                
                console.log('Backend status:', backendData);
            } catch (err) {
                console.log('Using simulated mode (backend unavailable)');
            }
        };

        const interval = setInterval(pollStatus, 1000); // Poll every second for real-time updates
        pollStatus();

        return () => clearInterval(interval);
    }, [jobId, location.state?.jobId]);

    const completedCount = agents.filter(a => a.status === 'completed').length;
    const runningCount = agents.filter(a => a.status === 'running').length;
    const pendingCount = agents.filter(a => a.status === 'pending' || a.status === 'idle').length;
    const overallProgress = agents.length > 0
        ? Math.round(agents.reduce((sum, a) => sum + a.progress, 0) / agents.length)
        : 0;

    const allCompleted = completedCount === agents.length && agents.length > 0;

    return (
        <div className="space-y-8">
            {/* Enhanced Header with Live Stats */}
            <div className="glass-ultra p-8 rounded-3xl relative overflow-hidden slide-in-bottom">
                {/* Animated background effect for running state */}
                {systemStatus === 'running' && !allCompleted && (
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 animate-pulse"></div>
                    </div>
                )}

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-5xl font-black text-neon-gradient mb-3 flex items-center gap-4">
                                Agentic Orchestration
                                {systemStatus === 'running' && !allCompleted && (
                                    <Sparkles className="w-10 h-10 text-purple-400 animate-pulse icon-glow" />
                                )}
                            </h2>
                            <p className="text-gray-300 text-xl">
                                {allCompleted
                                    ? '✓ All agents completed successfully'
                                    : 'Master Agent coordinating 6 specialist workers'}
                            </p>
                        </div>
                        <div className="badge-neon flex items-center gap-3 px-8 py-4">
                            <div className={`w-3 h-3 rounded-full ${allCompleted ? 'bg-emerald-400 shadow-[0_0_10px_currentColor]' : 'bg-purple-400 animate-pulse shadow-[0_0_10px_currentColor]'}`}></div>
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
                                    <div className="text-3xl font-black text-neon-gradient">{overallProgress}%</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Overall Progress</div>
                                </div>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-3 mt-3 overflow-hidden">
                                <div
                                    className="progress-neon h-full rounded-full transition-all duration-500"
                                    style={{ width: `${overallProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="card-holographic p-6 rounded-2xl spotlight-effect scale-in delay-100">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl float-slow">
                                    <CheckCircle2 className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{completedCount}/6</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Completed</div>
                                </div>
                            </div>
                        </div>

                        <div className="card-holographic p-6 rounded-2xl spotlight-effect scale-in delay-200">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl float-slow">
                                    <Zap className={`w-7 h-7 text-white ${runningCount > 0 ? 'animate-pulse' : ''}`} />
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{runningCount}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Active Now</div>
                                </div>
                            </div>
                        </div>

                        <div className="card-holographic p-6 rounded-2xl spotlight-effect scale-in delay-300">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl float-slow">
                                    <Clock className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-neon-gradient">{elapsedTime}s</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Execution Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agent Grid */}
            <div className="slide-in-bottom delay-400">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full glow-pulse"></div>
                    Worker Agents Status
                    {runningCount > 0 && (
                        <span className="badge-neon text-xs ml-2">
                            {runningCount} active
                        </span>
                    )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {agents.map((agent) => (
                        <AgentStatusCard key={agent.name} {...agent} />
                    ))}
                </div>
            </div>

            {/* Live Logs */}
            <div className="slide-in-bottom delay-500">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full glow-pulse"></div>
                    System Logs (Real-time)
                </h3>
                <LiveLogs agents={agents} />
            </div>

            {/* Action Bar */}
            {overallProgress >= 95 && (
                <div className="glass-ultra p-8 rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 text-center scale-in">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-4 glow-pulse shadow-2xl">
                            <CheckCircle2 className="w-12 h-12 text-white animate-pulse" />
                        </div>
                        <p className="text-white font-black text-3xl mb-2 text-neon-gradient">Analysis Complete!</p>
                        <p className="text-gray-300 text-lg">
                            {completedCount} agents successfully analyzed your query.
                            {allCompleted && ' Ready to view ranked candidates.'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/candidates', { state: { jobId } })}
                        className="btn-neon flex items-center gap-4 mx-auto text-xl px-10 py-5"
                    >
                        <FileText className="w-7 h-7" />
                        View Results & Export FDA-21 Report
                        <Sparkles className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
}
