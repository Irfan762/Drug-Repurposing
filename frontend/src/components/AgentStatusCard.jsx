import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export function AgentStatusCard({ name, status, task, progress }) {
    const isRunning = status === 'running';
    const isError = status === 'error';
    const isPending = status === 'pending';
    const isCompleted = status === 'completed';
    
    // Ensure completed agents show 100% progress
    const displayProgress = isCompleted ? 100 : (progress || 0);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-holographic p-6 rounded-2xl relative overflow-hidden group"
        >
            {isRunning && (
                <div className="absolute top-3 right-3">
                    <span className="flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500 shadow-[0_0_10px_currentColor]"></span>
                    </span>
                </div>
            )}

            {isPending && (
                <div className="absolute top-3 right-3">
                    <span className="flex h-4 w-4">
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 animate-pulse shadow-[0_0_10px_currentColor]"></span>
                    </span>
                </div>
            )}

            <div className="flex items-start justify-between mb-5">
                <h3 className="font-black text-xl text-white">{name}</h3>
                {status === 'running' && <Activity className="w-6 h-6 text-purple-400 animate-pulse icon-glow" />}
                {status === 'idle' && <Clock className="w-6 h-6 text-gray-400" />}
                {status === 'pending' && <Clock className="w-6 h-6 text-yellow-400 animate-pulse icon-glow" />}
                {isCompleted && <CheckCircle className="w-6 h-6 text-emerald-400 icon-glow" />}
                {status === 'error' && <AlertCircle className="w-6 h-6 text-red-500 icon-glow" />}
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-2 text-sm">
                    <span className="text-gray-400 font-semibold">Current Task</span>
                    <span className={clsx("font-bold text-xs leading-relaxed",
                        isError ? "text-red-400" :
                            isPending ? "text-yellow-400" :
                                isCompleted ? "text-emerald-400" :
                                "text-white")}>
                        {task}
                    </span>
                </div>

                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                        className={clsx("h-full rounded-full transition-all duration-500",
                            isError ? "bg-gradient-to-r from-red-500 to-red-600" :
                                isPending ? "bg-gradient-to-r from-yellow-500/50 to-yellow-600/50" :
                                    isCompleted ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                                        "progress-neon"
                        )}
                        style={{ width: `${displayProgress}%` }}
                        role="progressbar"
                        aria-valuenow={displayProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </div>

                <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-semibold">{displayProgress}% complete</span>
                    {isRunning && <span className="text-purple-400 font-bold animate-pulse">Processing...</span>}
                    {isPending && <span className="text-yellow-400 font-bold">Queued</span>}
                    {isCompleted && <span className="text-emerald-400 font-bold">✓ Done</span>}
                </div>
            </div>
        </motion.div>
    );
}
