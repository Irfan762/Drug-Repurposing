import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, ChevronRight } from 'lucide-react';

export function OnboardingModal() {
    const { user, completeOnboarding } = useAuth();
    const [step, setStep] = useState(0);

    if (user.hasOnboarded) return null;

    const steps = [
        {
            title: "Welcome to EYAI DrugDisc",
            desc: "Your AI-powered partner in drug repurposing and discovery.",
            content: (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-muted">
                    We use agentic workflows to analyze literature, validate targets, and predict safety profiles.
                </div>
            )
        },
        {
            title: "Setup Your Workspace",
            desc: "Configure your research preferences.",
            content: (
                <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
                        <input type="radio" name="focus" className="text-primary w-4 h-4" defaultChecked />
                        <div>
                            <div className="text-white font-medium">Neurodegenerative Diseases</div>
                            <div className="text-xs text-muted">Focus on Alzheimer's, Parkinson's</div>
                        </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
                        <input type="radio" name="focus" className="text-primary w-4 h-4" />
                        <div>
                            <div className="text-white font-medium">Oncology</div>
                            <div className="text-xs text-muted">Focus on Solid Tumors</div>
                        </div>
                    </label>
                </div>
            )
        },
        {
            title: "Ready to Start",
            desc: "Your agents are standing by.",
            content: (
                <div className="text-center py-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-4">
                        <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-white">System initialization complete.</p>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            completeOnboarding();
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-8">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-2xl font-bold text-white">{steps[step].title}</h2>
                                <span className="text-muted text-sm my-auto">Step {step + 1}/{steps.length}</span>
                            </div>
                            <p className="text-muted">{steps[step].desc}</p>
                        </div>

                        <div className="mb-8 min-h-[150px]">
                            {steps[step].content}
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {step === steps.length - 1 ? 'Launch Dashboard' : 'Continue'}
                            {step < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="h-1 bg-white/5">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
