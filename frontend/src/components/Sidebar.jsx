import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, FileText, Activity, FileJson, Sparkles } from 'lucide-react';

const navItems = [
    { name: 'Query Builder', path: '/', icon: Search },
    { name: 'Agent Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Ranked Candidates', path: '/candidates', icon: Activity },
    { name: 'Explainability', path: '/explain', icon: FileText },
    { name: 'FDA-21 Export', path: '/export', icon: FileJson },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-64 h-screen bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black gradient-text">
                            EYAI DrugDisc
                        </h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">AI Platform</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                isActive
                                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${
                                isActive 
                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600' 
                                    : 'bg-white/5'
                            }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Stats */}
            <div className="px-4 py-3 border-t border-white/10">
                <div className="glass-card p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400 font-semibold uppercase">System Status</span>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="text-xs text-green-400 font-semibold">Online</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-white/5 rounded-lg p-2">
                            <div className="text-lg font-black gradient-text">7</div>
                            <div className="text-[10px] text-slate-400 uppercase">Agents</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                            <div className="text-lg font-black gradient-text">25</div>
                            <div className="text-[10px] text-slate-400 uppercase">Drugs</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-black text-white">
                            DI
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Dr. Irfan</p>
                        <p className="text-xs text-slate-400 truncate">Lead Researcher</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
