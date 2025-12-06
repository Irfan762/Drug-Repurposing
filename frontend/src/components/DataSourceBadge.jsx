import { Database, FileText, FlaskConical, Scale } from 'lucide-react';

const sourceIcons = {
    'CSV: drugs_database.csv': Database,
    'CSV: research_papers.csv': FileText,
    'CSV: clinical_trials.csv': FlaskConical,
    'CSV: patents.csv': Scale,
};

const sourceColors = {
    'CSV: drugs_database.csv': 'from-blue-500 to-cyan-500',
    'CSV: research_papers.csv': 'from-purple-500 to-pink-500',
    'CSV: clinical_trials.csv': 'from-emerald-500 to-teal-500',
    'CSV: patents.csv': 'from-orange-500 to-red-500',
};

export function DataSourceBadge({ source }) {
    const Icon = sourceIcons[source] || Database;
    const colorClass = sourceColors[source] || 'from-gray-500 to-gray-600';

    return (
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl glass-ultra border border-white/10 hover:border-white/30 transition-all group cursor-pointer hover:scale-105 spotlight-effect relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
            <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colorClass} shadow-lg group-hover:scale-110 transition-transform relative z-10 float-slow`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-bold uppercase tracking-wider relative z-10">
                {source.replace('CSV: ', '')}
            </span>
        </div>
    );
}
