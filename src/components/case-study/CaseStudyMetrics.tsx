import { IProject } from '@/models/Project';

export default function CaseStudyMetrics({ metrics }: { metrics: IProject['metrics'] }) {
    if (!metrics || metrics.length === 0) return null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {metrics.map((metric, index) => (
                <div
                    key={index}
                    className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors duration-300"
                >
                    <div className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-3 tracking-tight">
                        {metric.value}
                    </div>
                    {metric.unit && (
                        <div className="text-xs text-blue-300 font-bold uppercase tracking-widest mb-2 opacity-80">
                            {metric.unit}
                        </div>
                    )}
                    <div className="text-base text-gray-300 font-medium leading-relaxed">
                        {metric.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
