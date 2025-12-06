import { useEffect, useRef, useState } from 'react';
import { Terminal, Activity } from 'lucide-react';

const LOG_TEMPLATES = {
    initialization: [
        "[SYSTEM] Initializing Master Agent orchestrator...",
        "[SYSTEM] Connected to knowledge graph DB (Neo4j)",
        "[SYSTEM] Loading agent configurations...",
        "[SYSTEM] Establishing secure communication channels...",
        "[SYSTEM] Agent swarm initialization complete"
    ],
    Clinical: [
        "[CLINICAL] Connecting to ClinicalTrials.gov API...",
        "[CLINICAL] Querying 50,000+ registered trials...",
        "[CLINICAL] Processing Phase II/III outcome data...",
        "[CLINICAL] Extracting efficacy signals from NCT database...",
        "[CLINICAL] Analyzing adverse event patterns...",
        "[CLINICAL] ✓ Identified 23 relevant trials with positive outcomes"
    ],
    Genomics: [
        "[GENOMICS] Initializing AlphaFold2 prediction engine...",
        "[GENOMICS] Loading protein interaction networks from STRING...",
        "[GENOMICS] Calculating binding affinity predictions (Ki < 10nM)...",
        "[GENOMICS] Validating target pathway engagement...",
        "[GENOMICS] Processing 14 protein-protein interactions...",
        "[GENOMICS] ✓ High confidence score: 0.92 (AMPK pathway)"
    ],
    Research: [
        "[RESEARCH] Connecting to PubMed search API...",
        "[RESEARCH] Mining 5,000+ research publications...",
        "[RESEARCH] Extracting key findings and citations...",
        "[RESEARCH] Computing h-index: 45 (high impact evidence)...",
        "[RESEARCH] Analyzing publication trends 2020-2024...",
        "[RESEARCH] ✓ Aggregated 1,240 supporting papers"
    ],
    Market: [
        "[MARKET] Accessing GlobalData market intelligence...",
        "[MARKET] Analyzing competitive landscape...",
        "[MARKET] Calculating TAM: $8.2B by 2030...",
        "[MARKET] Evaluating reimbursement outlook: Favorable...",
        "[MARKET] Processing pricing strategy models...",
        "[MARKET] ✓ Market viability confirmed (CAGR: 12.5%)"
    ],
    Patent: [
        "[PATENT] Querying USPTO patent database...",
        "[PATENT] Scanning EPO registry for blocking patents...",
        "[PATENT] Analyzing prior art landscape...",
        "[PATENT] Checking patent expiration dates...",
        "[PATENT] Evaluating freedom-to-operate status...",
        "[PATENT] ✓ Clear FTO - no blocking patents identified"
    ],
    Safety: [
        "[SAFETY] Accessing FDA AERS database...",
        "[SAFETY] Analyzing toxicity profiles (LD50 data)...",
        "[SAFETY] Reviewing black box warnings: None found...",
        "[SAFETY] Processing 156 adverse event reports...",
        "[SAFETY] Validating safety margins and contraindications...",
        "[SAFETY] ✓ Low risk profile - well-established safety data"
    ],
    EXIM: [
        "[EXIM] Connecting to international trade databases...",
        "[EXIM] Analyzing API import/export volumes...",
        "[EXIM] Top exporters: China (60%), India (25%), EU (15%)...",
        "[EXIM] Assessing supply chain resilience...",
        "[EXIM] Evaluating tariff impacts: 5-8% duty...",
        "[EXIM] ✓ Supply chain status: Stable with diversified sourcing"
    ],
    Internal: [
        "[INTERNAL] Scanning internal knowledge repositories...",
        "[INTERNAL] Analyzing Q3 2024 strategy documents...",
        "[INTERNAL] Extracting field insights from KOL reports...",
        "[INTERNAL] Reviewing competitive intelligence data...",
        "[INTERNAL] Checking R&D resource availability: Q1 2025...",
        "[INTERNAL] ✓ Strategic alignment confirmed - neurology priority"
    ],
    system: [
        "[SYSTEM] Job queue processing: 3 jobs active",
        "[SYSTEM] Memory usage: 2.4GB / 8GB",
        "[SYSTEM] Agent mesh network latency: 45ms",
        "[WARN] Rate limit approaching for PubMed API (90% quota)",
        "[INFO] Caching enabled for repeated queries",
        "[INFO] Vector similarity search performance: 120ms avg",
        "[SUCCESS] Agent synchronization checkpoint reached"
    ]
};

export function LiveLogs({ agents = [] }) {
    const [logs, setLogs] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const bottomRef = useRef(null);
    const logIndexRef = useRef({});

    // Initialize with system startup logs
    useEffect(() => {
        if (!isInitialized) {
            const initLogs = LOG_TEMPLATES.initialization.map((log, i) => ({
                text: log,
                timestamp: new Date(Date.now() - (5 - i) * 1000).toLocaleTimeString(),
                type: 'system'
            }));
            setLogs(initLogs);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    // Generate dynamic logs based on agent activity
    useEffect(() => {
        const interval = setInterval(() => {
            const activeAgents = agents.filter(a => a.status === 'running' || a.status === 'completed');

            if (activeAgents.length > 0) {
                // Pick a random active agent
                const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
                const agentLogs = LOG_TEMPLATES[agent.name] || [];

                if (agentLogs.length > 0) {
                    // Track which log index we're at for this agent
                    if (!logIndexRef.current[agent.name]) {
                        logIndexRef.current[agent.name] = 0;
                    }

                    let logIndex = logIndexRef.current[agent.name];

                    // If completed, show completion log
                    if (agent.status === 'completed' && logIndex < agentLogs.length - 1) {
                        logIndex = agentLogs.length - 1;
                    } else if (agent.status === 'running') {
                        // Progress through logs based on agent progress
                        logIndex = Math.min(
                            agentLogs.length - 2, // Don't show completion until done
                            Math.floor((agent.progress / 100) * (agentLogs.length - 1))
                        );
                    }

                    // Only add new log if we haven't seen it yet
                    if (logIndex > logIndexRef.current[agent.name]) {
                        const newLog = {
                            text: agentLogs[logIndex],
                            timestamp: new Date().toLocaleTimeString(),
                            type: agent.name.toLowerCase()
                        };

                        setLogs(prev => [...prev.slice(-30), newLog]); // Keep last 30
                        logIndexRef.current[agent.name] = logIndex;
                    }
                }
            } else if (agents.length > 0 && agents.every(a => a.status === 'idle' || a.status === 'pending')) {
                // Add occasional system logs when agents are idle/pending
                const systemLogs = LOG_TEMPLATES.system;
                const randomLog = {
                    text: systemLogs[Math.floor(Math.random() * systemLogs.length)],
                    timestamp: new Date().toLocaleTimeString(),
                    type: 'system'
                };
                setLogs(prev => [...prev.slice(-30), randomLog]);
            }
        }, 1200); // Generate log every 1.2 seconds

        return () => clearInterval(interval);
    }, [agents]);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getLogColor = (type) => {
        const colors = {
            system: 'text-blue-400/80',
            clinical: 'text-green-400/80',
            genomics: 'text-purple-400/80',
            research: 'text-cyan-400/80',
            market: 'text-yellow-400/80',
            patent: 'text-orange-400/80',
            safety: 'text-red-400/80',
            exim: 'text-pink-400/80',
            internal: 'text-indigo-400/80'
        };
        return colors[type] || 'text-green-400/80';
    };

    return (
        <div className="glass-ultra rounded-2xl overflow-hidden flex flex-col h-[450px] relative border-neon">
            {/* Animated terminal indicator */}
            <div className="absolute top-4 right-4 z-10">
                <Activity className="w-5 h-5 text-emerald-400 animate-pulse icon-glow" />
            </div>

            <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center gap-3">
                <Terminal className="w-5 h-5 text-emerald-400 icon-glow" />
                <span className="text-base font-bold text-emerald-400">Agent Orchestration Logs</span>
                <span className="badge-neon text-xs ml-auto">
                    {logs.length} entries
                </span>
            </div>

            <div className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-2 bg-gradient-to-br from-[#0a0118] to-[#0f0520]">
                {logs.map((log, i) => (
                    <div
                        key={i}
                        className={`${getLogColor(log.type)} border-l-2 border-transparent hover:border-purple-500/50 pl-3 py-1 hover:bg-white/5 transition-all duration-200 rounded-r leading-relaxed`}
                    >
                        <span className="opacity-60 mr-3 text-xs">[{log.timestamp}]</span>
                        {log.text}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
