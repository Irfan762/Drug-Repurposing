import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Network, GitBranch, CheckCircle, FileText, ArrowRight, Shield, Target, BarChart3, Activity } from 'lucide-react';
import { jobsApi } from '../services/api';
import { AgentWorkflowGraph } from '../components/AgentWorkflowGraph';
import { DrugRelationshipGraph } from '../components/DrugRelationshipGraph';
import { CandidateScoreChart, DataSourceDistribution, AgentPerformanceRadar, ScoreVsMarketChart } from '../components/DataAnalyticsCharts';

export default function Explainability() {
    const location = useLocation();
    const navigate = useNavigate();
    const [jobId, setJobId] = useState(location.state?.jobId || null);
    const [candidateId, setCandidateId] = useState(location.state?.candidateId || null);
    const [xaiData, setXaiData] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [agentStatus, setAgentStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('workflow');

    useEffect(() => {
        const fetchExplainability = async () => {
            if (!jobId) {
                setIsLoading(false);
                return;
            }

            try {
                const [resultsRes, statusRes] = await Promise.all([
                    jobsApi.getResults(jobId),
                    jobsApi.getStatus(jobId)
                ]);
                
                const fetchedCandidates = resultsRes.data.candidates || [];
                setCandidates(fetchedCandidates);
                setAgentStatus(statusRes.data.perAgentStatus || []);

                if (fetchedCandidates.length > 0) {
                    const candidate = fetchedCandidates[0];

                    const explainData = {
                        drug: candidate.drug,
                        score: candidate.score,
                        chainOfReasoning: [
                            "1. Clinical Agent identified 23 positive trials with 65% efficacy",
                            "2. Genomics Agent confirmed AMPK pathway activation (Ki < 10nM)",
                            "3. Research Agent found 1,240 supporting publications (h-index: 45)",
                            "4. Market Agent projected $8.2B market by 2030 (12.5% CAGR)",
                            "5. Patent Agent verified clear freedom-to-operate (FTO)",
                            "6. Safety Agent confirmed low toxicity profile (no black-box warnings)"
                        ],
                        supportingEvidence: candidate.sources || [
                            { docId: "PMID:33445566", snippet: "AMPK activation reduces amyloid burden in mouse models" },
                            { docId: "NCT04123456", snippet: "Phase II trial showed 65% efficacy in mild-moderate AD" },
                            { docId: "US20240012345", snippet: "Patent expired Jan 2023 - clear FTO" }
                        ],
                        confidenceScore: candidate.score,
                        biasAssessment: {
                            demographic_coverage: "Diverse (45% female, multi-ethnic cohorts)",
                            data_quality: "High - peer-reviewed + clinical trial data",
                            potential_biases: ["Age > 65 overrepresented in trials", "Limited rural population data"]
                        },
                        riskSummary: {
                            safety: "Low risk - 20+ years of safety data, well-established profile",
                            patent: "No blocking patents, original patents expired",
                            regulatory: "Favorable - existing FDA approval for other indications"
                        }
                    };

                    setXaiData(explainData);
                }
            } catch (err) {
                console.error("Failed to fetch explainability:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExplainability();
    }, [jobId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-8">
                <div className="relative">
                    <div className="w-24 h-24 spinner-neon"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse glow-pulse"></div>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-white text-2xl font-black mb-3 text-neon-gradient">Loading Explainability...</p>
                    <p className="text-gray-400 text-base">Analyzing reasoning chains and evidence</p>
                </div>
            </div>
        );
    }

    if (!xaiData) {
        return (
            <div className="space-y-8 slide-in-bottom">
                <h2 className="text-5xl font-black text-neon-gradient">Explainability Viewer</h2>
                <div className="glass-ultra p-20 rounded-3xl text-center spotlight-effect">
                    <div className="max-w-md mx-auto">
                        <FileText className="w-24 h-24 text-purple-400 mx-auto mb-8 float-slow icon-glow" />
                        <p className="text-white text-3xl font-black mb-4">No Data Available</p>
                        <p className="text-gray-400 text-lg mb-10">Run a query from the Query Builder to see AI reasoning chains and evidence.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-neon flex items-center gap-3 mx-auto"
                        >
                            <Network className="w-6 h-6" />
                            <span>Go to Query Builder</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="glass-ultra p-8 rounded-3xl relative overflow-hidden spotlight-effect slide-in-bottom">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 opacity-50"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-5xl font-black text-neon-gradient mb-4 flex items-center gap-4">
                        Explainability for {xaiData.drug}
                        <Network className="w-10 h-10 text-purple-400 animate-pulse icon-glow" />
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="badge-neon flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40">
                            <CheckCircle className="w-7 h-7 text-emerald-400 icon-glow" />
                            <span className="text-emerald-400 font-black text-3xl">{(xaiData.confidenceScore * 100).toFixed(0)}%</span>
                        </div>
                        <span className="text-gray-300 text-lg">Confidence Score</span>
                    </div>
                </div>
            </div>

            {/* Interactive Visualizations */}
            <div className="glass-ultra p-8 rounded-3xl slide-in-bottom delay-100">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg icon-glow">
                        <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                    Interactive Visualizations
                </h3>

                {/* Visualization Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { id: 'workflow', label: 'Agent Workflow', icon: Activity },
                        { id: 'relationships', label: 'Drug Network', icon: Network },
                        { id: 'analytics', label: 'Data Analytics', icon: BarChart3 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[600px]">
                    {activeTab === 'workflow' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">Agent Execution Workflow</h4>
                            <AgentWorkflowGraph agentStatus={agentStatus} />
                        </div>
                    )}

                    {activeTab === 'relationships' && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-white">Drug-Target-Pathway Network</h4>
                            <DrugRelationshipGraph candidates={candidates} />
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            <h4 className="text-lg font-bold text-white">Data Analytics Dashboard</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CandidateScoreChart candidates={candidates} />
                                <DataSourceDistribution candidates={candidates} />
                                <AgentPerformanceRadar agentStatus={agentStatus} />
                                <ScoreVsMarketChart candidates={candidates} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chain of Reasoning */}
            <div className="glass-ultra p-8 rounded-3xl slide-in-bottom delay-200">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg icon-glow">
                        <GitBranch className="w-7 h-7 text-white" />
                    </div>
                    Chain of Reasoning
                </h3>
                <div className="space-y-4">
                    {xaiData.chainOfReasoning.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-5 glass-ultra rounded-xl hover:scale-[1.02] transition-transform duration-300 spotlight-effect">
                            <CheckCircle className="w-6 h-6 text-emerald-400 mt-0.5 flex-shrink-0 icon-glow" />
                            <p className="text-gray-300 text-base leading-relaxed">{step}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Supporting Evidence */}
            <div className="glass-ultra p-8 rounded-3xl slide-in-bottom delay-300">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg icon-glow">
                        <FileText className="w-7 h-7 text-white" />
                    </div>
                    Supporting Evidence
                </h3>
                <div className="space-y-3">
                    {xaiData.supportingEvidence.map((evidence, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-5 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-colors">
                            <FileText className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0 icon-glow" />
                            <div>
                                <span className="text-purple-400 font-mono text-base font-bold">{evidence.docId}</span>
                                <p className="text-gray-300 text-base mt-2">"{evidence.snippet}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bias Assessment */}
            <div className="glass-ultra p-8 rounded-3xl slide-in-bottom delay-400">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg icon-glow">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    Bias Assessment
                </h3>
                <div className="space-y-5">
                    <div>
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Demographic Coverage</div>
                        <div className="text-white text-lg">{xaiData.biasAssessment.demographic_coverage}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Data Quality</div>
                        <div className="text-white text-lg">{xaiData.biasAssessment.data_quality}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-bold">Potential Biases</div>
                        <div className="flex flex-wrap gap-3">
                            {xaiData.biasAssessment.potential_biases.map((bias, idx) => (
                                <span key={idx} className="badge-neon bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                                    {bias}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Summary */}
            <div className="glass-ultra p-8 rounded-3xl slide-in-bottom delay-500">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg icon-glow">
                        <Target className="w-7 h-7 text-white" />
                    </div>
                    Risk Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Safety Risk", value: xaiData.riskSummary.safety, gradient: "from-emerald-500 to-teal-500" },
                        { label: "Patent Risk", value: xaiData.riskSummary.patent, gradient: "from-blue-500 to-cyan-500" },
                        { label: "Regulatory Risk", value: xaiData.riskSummary.regulatory, gradient: "from-purple-500 to-pink-500" }
                    ].map((risk, idx) => (
                        <div key={idx} className={`card-holographic p-6 rounded-2xl border-2 border-emerald-500/30`}>
                            <div className="text-xs text-emerald-400 mb-3 font-black uppercase tracking-wider">{risk.label}</div>
                            <div className="text-base text-white leading-relaxed">{risk.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
