import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Zap, TrendingUp, Shield, Brain } from 'lucide-react';
import { jobsApi } from '../services/api';

export default function QueryBuilder() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            // Debug: Log the API URL being used
            console.log("API Base URL:", import.meta.env.VITE_API_URL);
            console.log("Full API URL:", import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : '/api/v1');
            
            const response = await jobsApi.create({
                prompt: query,
                databases: ["clinical", "patents", "genomic"],
                options: {
                    maxCandidates: 10,
                    runAgents: ["clinical", "genomics", "safety", "patent"]
                }
            });

            navigate('/dashboard', {
                state: {
                    jobId: response.data.jobId,
                    query: query
                }
            });
        } catch (error) {
            console.error("Failed to launch job:", error);
            console.error("Error details:", error.response?.data || error.message);
            console.error("Request URL:", error.config?.url);
            alert(`Failed to launch agents. Error: ${error.response?.data?.detail || error.message || 'Backend connection failed'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isLoading) handleSearch();
    }

    const exampleQueries = [
        { icon: Brain, text: "Find kinase inhibitors for Alzheimer's disease", category: "Neuroscience" },
        { icon: Shield, text: "Discover FDA-approved drugs with neuroprotective effects", category: "Safety" },
        { icon: TrendingUp, text: "Identify antibiotics for resistant bacterial infections", category: "Infectious Disease" },
        { icon: Brain, text: "Find PPARγ agonists for neurodegenerative diseases", category: "Metabolic" },
    ];

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/50">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-6xl font-black gradient-text">
                        Drug Repurposing Engine
                    </h1>
                </div>

                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Accelerate drug discovery by <span className="text-indigo-400 font-semibold">60-80%</span> using
                    <span className="text-purple-400 font-semibold"> 7 specialized AI agents</span> analyzing
                    billions of interactions in parallel.
                </p>
                
                {/* Debug info - remove after testing */}
                <div className="text-xs text-slate-500 mt-4">
                    API URL: {import.meta.env.VITE_API_URL || 'Not set (using relative URLs)'}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-6 mt-8">
                    {[
                        { value: "25+", label: "FDA Drugs" },
                        { value: "7", label: "AI Agents" },
                        { value: "10×", label: "Faster" },
                        { value: "92%", label: "Accuracy" }
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-card px-6 py-4">
                            <div className="text-3xl font-black gradient-text">{stat.value}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="max-w-4xl mx-auto">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-4">
                        <Search className="w-6 h-6 text-slate-400 ml-2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g., 'Find kinase inhibitors for Alzheimer's with verified safety profiles'"
                            className="flex-1 bg-transparent border-none text-lg text-white placeholder-slate-500 focus:ring-0 focus:outline-none px-2 py-3"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isLoading || !query.trim()}
                            className="btn-premium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Launching...</span>
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    <span>Launch Agents</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    <span className="text-sm text-slate-400 font-semibold">Quick Filters:</span>
                    {['FDA Approved', 'Phase 3', 'Small Molecule', 'Oral', 'Brain Penetrant'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => setQuery(prev => prev + (prev ? ' ' : '') + tag)}
                            className="badge hover:bg-white/20 transition-all"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Examples */}
            <div className="max-w-4xl mx-auto space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Example Queries
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exampleQueries.map((example, idx) => (
                        <button
                            key={idx}
                            onClick={() => setQuery(example.text)}
                            className="glass-card text-left p-6 hover:scale-105 transition-transform"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                                    <example.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                                        {example.category}
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {example.text}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        icon: Brain,
                        title: "7 AI Agents",
                        description: "Clinical, Genomics, Research, Market, IP, Safety & Master agents working in parallel"
                    },
                    {
                        icon: Shield,
                        title: "FDA-Aligned",
                        description: "Complete audit trails and compliance-ready reports for regulatory submission"
                    },
                    {
                        icon: TrendingUp,
                        title: "Full Explainability",
                        description: "Chain-of-reasoning, bias assessment, and evidence for every recommendation"
                    }
                ].map((feature, idx) => (
                    <div key={idx} className="glass-card p-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 w-fit mb-4">
                            <feature.icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
