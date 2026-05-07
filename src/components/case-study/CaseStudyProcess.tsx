import { IProject } from '@/models/Project';
import ResponsiveImage from '@/components/shared/ResponsiveImage';

export default function CaseStudyProcess({ steps }: { steps: IProject['processSteps'] }) {
    if (!steps || steps.length === 0) return null;

    return (
        <div className="relative space-y-24 lg:space-y-32">
            {/* Timeline Line (Desktop only - centered) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-100 via-blue-200 to-blue-100 -translate-x-1/2 z-0" />

            {steps.map((step, index) => (
                <div key={index} className={`relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}>

                    {/* Step Number Badge (Center Pivot) */}
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-4 border-blue-100 rounded-full items-center justify-center text-blue-600 font-bold text-lg shadow-sm z-20">
                        {index + 1}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <div className="lg:hidden inline-block px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-full mb-4">
                            STEP {index + 1}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            {step.title}
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed font-light">
                            {step.description}
                        </p>
                    </div>

                    {/* Visual Aid */}
                    <div className="flex-1 w-full">
                        {step.image && step.image.url ? (
                            <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/5 bg-gray-50 transform hover:scale-[1.02] transition-transform duration-500 ${index % 2 === 0 ? 'lg:rotate-2' : 'lg:-rotate-2'
                                }`}>
                                <ResponsiveImage
                                    src={step.image.url}
                                    alt={step.image.alt || step.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="aspect-[4/3] rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                No visual provided
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
