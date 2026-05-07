import { IProject } from '@/models/Project';
import ResponsiveImage from '@/components/shared/ResponsiveImage';
import { Quote } from 'lucide-react';

export default function CaseStudyTestimonial({ testimonial }: { testimonial: IProject['testimonial'] }) {
    if (!testimonial || !testimonial.quote) return null;

    return (
        <div className="relative rounded-[2.5rem] p-10 md:p-20 overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <svg className="absolute -top-10 -left-10 w-96 h-96 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.55228 16 10 15.5523 10 15V9C10 8.44772 9.55228 8 9 8H5C4.44772 8 4 8.44772 4 9V18C4 19.6569 5.34315 21 7 21H14.017ZM21.017 21L21.017 18C21.017 16.8954 20.1216 16 19.017 16H16C16.5523 16 17 15.5523 17 15V9C17 8.44772 16.5523 8 16 8H12C11.4477 8 11 8.44772 11 9V18C11 19.6569 12.3431 21 14 21H21.017Z" />
                </svg>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <Quote className="mx-auto text-blue-400 mb-10 w-16 h-16" />

                <blockquote className="text-3xl md:text-5xl font-serif italic font-medium leading-tight mb-12 tracking-wide text-blue-50">
                    &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex flex-col items-center justify-center space-y-4">
                    {testimonial.image && testimonial.image.url && (
                        <div className="w-16 h-16 rounded-full overflow-hidden relative border-2 border-blue-400/50 shadow-lg ring-4 ring-blue-900/50">
                            <ResponsiveImage src={testimonial.image.url} alt={testimonial.author || 'Client'} fill className="object-cover" />
                        </div>
                    )}
                    <div className="text-center">
                        <div className="text-xl font-bold text-white mb-1">{testimonial.author}</div>
                        {testimonial.role && <div className="text-sm text-blue-300 font-medium uppercase tracking-widest">{testimonial.role}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
