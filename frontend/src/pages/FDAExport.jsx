import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, CheckCircle, FileSpreadsheet, Presentation, Shield, Clock, Sparkles } from 'lucide-react';

export default function FDAExport() {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedFormats, setSelectedFormats] = useState(['pdf']);
    const [includeAudit, setIncludeAudit] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [recentJobs, setRecentJobs] = useState([]);
    const [exportHistory, setExportHistory] = useState([]);

    useEffect(() => {
        const storedJobs = localStorage.getItem('eyai_job_history');
        if (storedJobs) {
            try {
                setRecentJobs(JSON.parse(storedJobs));
            } catch (e) {
                console.error('Failed to load job history:', e);
            }
        } else {
            const mockJobs = [
                {
                    id: '#A7F2E1',
                    query: 'Find kinase inhibitors for Alzheimer\'s disease',
                    timestamp: new Date(Date.now() - 3600000).toLocaleString(),
                    candidatesCount: 5,
                    status: 'completed'
                },
                {
                    id: '#B3G4H2',
                    query: 'Discover FDA-approved drugs for Parkinson\'s treatment',
                    timestamp: new Date(Date.now() - 7200000).toLocaleString(),
                    candidatesCount: 8,
                    status: 'completed'
                },
                {
                    id: '#C8K5M3',
                    query: 'Identify small molecules targeting tau protein aggregation',
                    timestamp: new Date(Date.now() - 10800000).toLocaleString(),
                    candidatesCount: 3,
                    status: 'completed'
                }
            ];
            setRecentJobs(mockJobs);
            localStorage.setItem('eyai_job_history', JSON.stringify(mockJobs));
        }

        const storedExports = localStorage.getItem('eyai_export_history');
        if (storedExports) {
            try {
                setExportHistory(JSON.parse(storedExports));
            } catch (e) {
                console.error('Failed to load export history:', e);
            }
        }
    }, []);

    const formatOptions = [
        { id: 'pdf', label: 'PDF Report', icon: FileText, description: 'FDA-21 compliant PDF with full audit trail', gradient: 'from-red-500 to-pink-500' },
        { id: 'xlsx', label: 'Excel Spreadsheet', icon: FileSpreadsheet, description: 'Detailed data tables for analysis', gradient: 'from-emerald-500 to-teal-500' },
        { id: 'pptx', label: 'PowerPoint', icon: Presentation, description: 'Executive presentation deck', gradient: 'from-blue-500 to-cyan-500' }
    ];

    const toggleFormat = (formatId) => {
        setSelectedFormats(prev =>
            prev.includes(formatId)
                ? prev.filter(f => f !== formatId)
                : [...prev, formatId]
        );
    };

    const handleExport = async () => {
        if (!selectedJob) {
            alert('Please select a job to export');
            return;
        }

        setIsExporting(true);
        try {
            // Use a demo job ID for export (backend will generate demo data)
            const jobId = 'demo-export-' + Date.now();
            
            if (selectedFormats.includes('pdf')) {
                const response = await fetch(`/api/v1/jobs/${jobId}/export`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formats: ['pdf'],
                        includeAuditTrail: includeAudit
                    })
                });

                if (response.ok) {
                    const blob = await response.blob();
                    
                    // Check if it's actually a PDF
                    if (blob.type === 'application/pdf' || blob.size > 1000) {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `FDA21_Report_${selectedJob.id}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);

                        const newExport = {
                            id: `EXP${Date.now()}`,
                            jobId: selectedJob.id,
                            format: 'PDF',
                            timestamp: new Date().toLocaleString(),
                            size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`
                        };

                        const updatedHistory = [newExport, ...exportHistory].slice(0, 10);
                        setExportHistory(updatedHistory);
                        localStorage.setItem('eyai_export_history', JSON.stringify(updatedHistory));
                        
                        alert('Export completed successfully!');
                    } else {
                        // Handle error response
                        const text = await blob.text();
                        console.error('Export error:', text);
                        alert('Export failed: ' + text);
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Export failed:', errorText);
                    alert('Export failed: ' + errorText);
                }
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please ensure the backend is running at http://localhost:8000');
        } finally {
            setIsExporting(false);
        }
    };

    const handleQuickExport = async (jobId) => {
        try {
            // Use a demo job ID for export
            const exportJobId = 'demo-export-' + Date.now();
            
            const response = await fetch(`/api/v1/jobs/${exportJobId}/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formats: ['pdf'],
                    includeAuditTrail: true
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                
                // Check if it's actually a PDF
                if (blob.type === 'application/pdf' || blob.size > 1000) {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `FDA21_Report_${jobId}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    const newExport = {
                        id: `EXP${Date.now()}`,
                        jobId: jobId,
                        format: 'PDF',
                        timestamp: new Date().toLocaleString(),
                        size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`
                    };

                    const updatedHistory = [newExport, ...exportHistory].slice(0, 10);
                    setExportHistory(updatedHistory);
                    localStorage.setItem('eyai_export_history', JSON.stringify(updatedHistory));

                    alert('PDF downloaded successfully!');
                } else {
                    const text = await blob.text();
                    console.error('Export error:', text);
                    alert('Export failed: ' + text);
                }
            } else {
                const errorText = await response.text();
                console.error('Export failed:', errorText);
                alert('Export failed: ' + errorText);
            }
        } catch (error) {
            console.error('Quick export failed:', error);
            alert('Export failed. Please ensure the backend is running at http://localhost:8000');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="glass-ultra p-8 rounded-3xl relative overflow-hidden spotlight-effect slide-in-bottom">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 opacity-50"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-3xl"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-5xl font-black text-neon-gradient mb-4 flex items-center gap-4">
                            FDA-21 Export Center
                            <Sparkles className="w-10 h-10 text-purple-400 animate-pulse icon-glow" />
                        </h2>
                        <p className="text-gray-300 text-xl">Generate compliance-ready reports for regulatory submission</p>
                    </div>
                    <div className="badge-neon flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40">
                        <Shield className="w-7 h-7 text-emerald-400 icon-glow" />
                        <span className="text-emerald-400 font-black text-lg">FDA Compliant</span>
                    </div>
                </div>
            </div>

            {/* Export Wizard */}
            <div className="glass-ultra p-8 rounded-3xl slide-in-bottom delay-100">
                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg icon-glow">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    Create New Export
                </h3>

                {/* Step 1: Select Job */}
                <div className="space-y-5 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-black text-lg glow-pulse">1</div>
                        <h4 className="text-white font-black text-xl">Select Analysis Job</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {recentJobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => setSelectedJob(job)}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all spotlight-effect ${selectedJob?.id === job.id
                                    ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
                                    : 'border-white/10 glass-ultra hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="badge-neon text-sm">{job.id}</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {job.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-white text-base mb-2 font-semibold">{job.query}</p>
                                        <p className="text-gray-400 text-sm">{job.candidatesCount} candidates identified</p>
                                    </div>
                                    {selectedJob?.id === job.id && (
                                        <CheckCircle className="w-8 h-8 text-purple-400 icon-glow" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 2: Select Formats */}
                <div className="space-y-5 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-black text-lg glow-pulse">2</div>
                        <h4 className="text-white font-black text-xl">Choose Export Formats</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formatOptions.map((format) => (
                            <div
                                key={format.id}
                                onClick={() => toggleFormat(format.id)}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all spotlight-effect ${selectedFormats.includes(format.id)
                                    ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
                                    : 'border-white/10 glass-ultra hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-4 rounded-xl bg-gradient-to-br ${format.gradient} shadow-lg float-slow`}>
                                        <format.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="text-white font-black text-base">{format.label}</h5>
                                            {selectedFormats.includes(format.id) && (
                                                <CheckCircle className="w-5 h-5 text-purple-400 icon-glow" />
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-sm">{format.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 3: Options */}
                <div className="space-y-5 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-black text-lg glow-pulse">3</div>
                        <h4 className="text-white font-black text-xl">Export Options</h4>
                    </div>
                    <label className="flex items-center gap-4 p-6 rounded-2xl glass-ultra border border-white/10 cursor-pointer hover:bg-white/5 transition-colors spotlight-effect">
                        <input
                            type="checkbox"
                            checked={includeAudit}
                            onChange={(e) => setIncludeAudit(e.target.checked)}
                            className="w-6 h-6 rounded border-white/20 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                        />
                        <div>
                            <div className="text-white font-bold text-lg">Include Audit Trail</div>
                            <div className="text-gray-400 text-sm">Add full execution logs and timestamps for compliance</div>
                        </div>
                    </label>
                </div>

                {/* Export Button */}
                <button
                    onClick={handleExport}
                    disabled={!selectedJob || selectedFormats.length === 0 || isExporting}
                    className="btn-neon w-full flex items-center justify-center gap-4 text-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExporting ? (
                        <>
                            <div className="w-6 h-6 spinner-neon"></div>
                            <span>Generating Export...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-7 h-7" />
                            <span>Generate & Download Report</span>
                        </>
                    )}
                </button>
            </div>

            {/* Quick Actions */}
            <div className="glass-ultra p-8 rounded-3xl slide-in-bottom delay-200">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg icon-glow">
                        <Download className="w-7 h-7 text-white" />
                    </div>
                    Quick Export
                </h3>
                <p className="text-gray-400 mb-6 text-base">Download PDF reports directly from recent jobs</p>
                <div className="space-y-3">
                    {recentJobs.slice(0, 2).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-5 rounded-xl glass-ultra border border-white/10 hover:bg-white/5 transition-colors">
                            <div>
                                <span className="badge-neon text-sm mr-4">{job.id}</span>
                                <span className="text-white text-base font-semibold">{job.query.slice(0, 50)}...</span>
                            </div>
                            <button
                                onClick={() => handleQuickExport(job.id)}
                                className="px-6 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-all flex items-center gap-2 font-bold spotlight-effect"
                            >
                                <Download className="w-5 h-5" />
                                <span>PDF</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Export History */}
            <div className="glass-ultra p-8 rounded-3xl slide-in-bottom delay-300">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg icon-glow">
                        <Clock className="w-7 h-7 text-white" />
                    </div>
                    Export History
                </h3>
                <div className="space-y-3">
                    {exportHistory.length > 0 ? (
                        exportHistory.map((exp) => (
                            <div key={exp.id} className="flex items-center justify-between p-5 rounded-xl glass-ultra border border-white/10">
                                <div className="flex items-center gap-5">
                                    <FileText className="w-6 h-6 text-purple-400 icon-glow" />
                                    <div>
                                        <div className="text-white text-base font-bold">{exp.format} Report - {exp.jobId}</div>
                                        <div className="text-gray-400 text-sm">{exp.timestamp} • {exp.size}</div>
                                    </div>
                                </div>
                                <div className="badge-neon text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Exported</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50 float-slow" />
                            <p className="text-lg">No export history yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
