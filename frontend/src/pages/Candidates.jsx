import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, FileText, Download, ExternalLink, Database, Sparkles, Search, Award, Target, BarChart3 } from 'lucide-react';
import { jobsApi } from '../services/api';
import { saveJobToHistory } from '../services/localStorage';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { CandidateScoreChart, DataSourceDistribution } from '../components/DataAnalyticsCharts';

export default function Candidates() {
    const location = useLocation();
    const navigate = useNavigate();
    const [jobId, setJobId] = useState(location.state?.jobId || null);
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        if (!jobId) {
            setIsLoading(false);
            return;
        }

        const fetchResults = async () => {
            try {
                const res = await jobsApi.getResults(jobId);
                const fetchedCandidates = res.data.candidates || [];
                setCandidates(fetchedCandidates);

                if (location.state?.query) {
                    saveJobToHistory({
                        jobId: jobId,
                        query: location.state.query || 'Drug discovery query',
                        candidatesCount: fetchedCandidates.length,
                        status: 'completed'
                    });
                }
            } catch (err) {
                console.error("Failed to fetch results:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [jobId, location.state]);

    const handleExport = async () => {
        if (!jobId) return;

        setIsExporting(true);
        try {
            const response = await fetch(`/api/v1/jobs/${jobId}/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formats: ['pdf'],
                    includeAuditTrail: true
                })
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `FDA21_Report_${jobId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            alert('FDA-21 Report downloaded successfully!');
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to generate export. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

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
                    <p className="text-white text-2xl font-black mb-3 text-neon-gradient">Analyzing Results...</p>
                    <p className="text-gray-400 text-base">Processing candidate data from CSV database</p>
                </div>
            </div>
        );
    }

    if (!jobId || candidates.length === 0) {
        return (
            <div className="space-y-8 slide-in-bottom">
                <h2 className="text-5xl font-black text-neon-gradient">Ranked Candidates</h2>
                <div className="glass-ultra p-20 rounded-3xl text-center spotlight-effect">
                    <div className="max-w-md mx-auto">
                        <FileText className="w-24 h-24 text-purple-400 mx-auto mb-8 float-slow icon-glow" />
                        <p className="text-white text-3xl font-black mb-4">No Results Yet</p>
                        <p className="text-gray-400 text-lg mb-10">Launch a query from the Query Builder to discover drug candidates with AI-powered analysis.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-neon flex items-center gap-3 mx-auto"
                        >
                            <Search className="w-6 h-6" />
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
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-5xl font-black text-neon-gradient mb-4 flex items-center gap-4">
                            Ranked Drug Candidates
                            <Sparkles className="w-10 h-10 text-purple-400 animate-pulse icon-glow" />
                        </h2>
                        <div className="flex items-center gap-6 mt-4">
                            <div className="badge-neon flex items-center gap-2">
                                <Database className="w-5 h-5" />
                                Job ID: <span className="font-mono font-black">{jobId}</span>
                            </div>
                            <span className="text-gray-400 text-xl">•</span>
                            <p className="text-gray-300 text-lg">
                                <span className="text-white font-black text-2xl">{candidates.length}</span> candidates identified
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="btn-premium flex items-center gap-3 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                    >
                        {isExporting ? (
                            <>
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-6 h-6" />
                                <span>Export FDA-21 Report</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Data Sources */}
            <div className="glass-ultra p-6 rounded-2xl slide-in-bottom delay-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg icon-glow">
                        <Database className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Data Sources</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    <DataSourceBadge source="CSV: drugs_database.csv" />
                    <DataSourceBadge source="CSV: research_papers.csv" />
                    <DataSourceBadge source="CSV: clinical_trials.csv" />
                    <DataSourceBadge source="CSV: patents.csv" />
                </div>
            </div>

            {/* Quick Stats */}
            {candidates.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 slide-in-bottom delay-200">
                    {[
                        { value: candidates.length, label: "Total Candidates", gradient: "from-emerald-500 to-teal-500", icon: Target },
                        { value: `${Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length * 100)}%`, label: "Avg Confidence", gradient: "from-blue-500 to-cyan-500", icon: TrendingUp },
                        { value: candidates.reduce((sum, c) => sum + (c.sources?.length || 0), 0), label: "Evidence Sources", gradient: "from-purple-500 to-pink-500", icon: FileText },
                        { value: candidates.filter(c => (c.score * 100) >= 85).length, label: "High Confidence (≥85%)", gradient: "from-orange-500 to-red-500", icon: Award }
                    ].map((stat, idx) => (
                        <div key={idx} className="card-holographic p-6 rounded-2xl spotlight-effect">
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg float-slow`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-4xl font-black text-neon-gradient">{stat.value}</div>
                            </div>
                            <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">{stat.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <CandidateScoreChart candidates={candidates} />
                <DataSourceDistribution candidates={candidates} />
            </div>

            {/* Candidates List */}
            <div className="space-y-6">
                {candidates.map((candidate, idx) => (
                    <div
                        key={candidate.id}
                        className={`glass-ultra p-8 rounded-3xl relative overflow-hidden group spotlight-effect slide-in-bottom delay-${Math.min(idx + 3, 10) * 100}`}
                    >
                        {/* Rank badge */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-bl-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl glow-pulse">
                                        <span className="text-3xl font-black text-white">#{idx + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-white mb-3 flex items-center gap-4">
                                            {candidate.drug}
                                            {idx === 0 && (
                                                <span className="badge-neon text-xs bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-500/50">
                                                    <Award className="w-4 h-4 inline mr-1" />
                                                    TOP MATCH
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-gray-400 text-lg leading-relaxed">{candidate.summary}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <div className="badge-neon flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40">
                                        <TrendingUp className="w-7 h-7 text-emerald-400 icon-glow" />
                                        <span className="text-emerald-400 font-black text-3xl">{(candidate.score * 100).toFixed(0)}%</span>
                                    </div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Confidence Score</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="glass-ultra p-4 rounded-xl border-neon">
                                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Market Estimate</div>
                                    <div className="text-white font-bold text-lg">{candidate.marketEstimate || 'N/A'}</div>
                                </div>
                                <div className="glass-ultra p-4 rounded-xl border-neon">
                                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Patent Status</div>
                                    <div className="text-white font-bold text-lg">{candidate.patentFlags?.join(', ') || 'N/A'}</div>
                                </div>
                                <div className="glass-ultra p-4 rounded-xl border-neon">
                                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Safety Flags</div>
                                    <div className="text-white font-bold text-lg">{candidate.safetyFlags?.join(', ') || 'None'}</div>
                                </div>
                            </div>

                            {candidate.rationale && (
                                <div className="mb-6 p-5 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                    <div className="text-xs text-purple-400 mb-3 font-black uppercase tracking-wider">AI Rationale</div>
                                    <p className="text-gray-300 text-base leading-relaxed">{candidate.rationale}</p>
                                </div>
                            )}

                            {candidate.sources && candidate.sources.length > 0 && (
                                <div>
                                    <div className="text-xs text-gray-400 mb-3 font-black uppercase tracking-wider">Evidence Sources</div>
                                    <div className="space-y-3">
                                        {candidate.sources.map((source, sidx) => (
                                            <div key={sidx} className="flex items-start gap-3 text-sm p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                                <ExternalLink className="w-4 h-4 text-purple-400 mt-0.5 icon-glow flex-shrink-0" />
                                                <div>
                                                    <span className="text-purple-400 font-mono font-bold">{source.docId}</span>
                                                    <span className="text-gray-400"> - {source.snippet}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Export Button - More Visible */}
            <div className="glass-card p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Export?</h3>
                <p className="text-slate-400 mb-6">Download a comprehensive FDA-21 compliant report with all candidate data and analysis</p>
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="btn-premium flex items-center gap-3 text-xl px-12 py-5 mx-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                >
                    {isExporting ? (
                        <>
                            <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Generating PDF Report...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-7 h-7" />
                            <span>Download FDA-21 Report (PDF)</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
