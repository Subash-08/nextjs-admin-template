'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ImageUpload from './ImageUpload';
import { addProject, editProject } from '@/actions/project.actions';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, X, Save, AlertCircle, Calendar, Info, Trash2, Layout, User, Image as ImageIcon, FileText, BarChart, Settings } from 'lucide-react';

// --- Zod Schemas ---
// (Reusing existing schemas - keeping them identical for stability)
const imageSchema = z.object({
    url: z.string().min(1, 'Image URL required'),
    alt: z.string().optional(),
    caption: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    aspectRatio: z.string().optional(),
    fileSize: z.number().optional(),
});

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    shortSummary: z.string().min(1, 'Short summary is required'),
    description: z.string().min(1, 'Description is required'),

    // Client
    clientName: z.string().min(1, 'Client Name is required'),
    clientCompany: z.string().min(1, 'Client Company is required'),
    clientWebsite: z.string().optional(),
    clientIndustry: z.string().optional(),
    clientLogo: imageSchema.optional(),

    // Project Meta
    projectYear: z.string().optional(),
    projectLocation: z.string().optional(),
    projectDuration: z.string().optional(),
    projectUrl: z.string().optional(),

    // Classification
    categoryId: z.string().min(1, 'Category is required'),
    displayCategoryOverride: z.string().optional(),
    subcategoryId: z.string().optional(),
    tags: z.array(z.object({ value: z.string() })).optional(),
    techStack: z.array(z.object({
        name: z.string().min(1, 'Tech Name required'),
        category: z.string().optional()
    })).optional(),

    // Media
    thumbnail: imageSchema,
    coverImage: imageSchema,
    galleryImages: z.array(imageSchema).optional(),
    heroImageOverride: imageSchema.optional(),
    heroImageOverlayOpacity: z.number().min(0).max(1).optional(),
    heroImageOverlayColor: z.string().optional(),

    // Case Study Videos
    videos: z.array(z.object({ value: z.string() })).optional(),

    // Content
    overview: z.string().optional(),
    problemStatement: z.string().optional(),
    objectives: z.string().optional(),
    goals: z.string().optional(),
    targetAudience: z.string().optional(),

    // Structured Content
    processSteps: z.array(z.object({
        title: z.string().min(1, 'Step Title required'),
        description: z.string().min(1, 'Step Description required'),
        image: imageSchema.optional()
    })).optional(),

    challenges: z.array(z.object({ value: z.string() })).optional(),
    solution: z.array(z.object({ value: z.string() })).optional(),

    // Results
    metrics: z.array(z.object({
        label: z.string().min(1, 'Metric Label required'),
        value: z.string().min(1, 'Metric Value required'),
        unit: z.string().optional()
    })).optional(),

    testimonial: z.object({
        quote: z.string().optional(),
        author: z.string().optional(),
        role: z.string().optional(),
        image: imageSchema.optional(),
    }).optional(),

    // System
    featured: z.boolean().optional(),
    showInPortfolio: z.boolean().optional(),
    showInHomepage: z.boolean().optional(),
    displayOrder: z.number().optional(),
    status: z.enum(['draft', 'published', 'archived']),
    publishDate: z.string().optional(),
    unpublishDate: z.string().optional(),
    relatedProjects: z.array(z.string()).optional(),

    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.array(z.object({ value: z.string() })).optional(),
    ogImage: imageSchema.optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
    project?: any;
    categories: any[];
}

// --- Helper Components ---

const ImageMetaInfo = ({ image, requiredRatio }: { image?: any; requiredRatio?: string }) => {
    if (!image || !image.width || !image.height) return null;

    const isRatioCorrect = requiredRatio ? image.aspectRatio === requiredRatio : true;

    return (
        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded border border-gray-100 flex justify-between items-center">
            <div className="flex space-x-3">
                <span><span className="font-semibold text-gray-700">{image.width}×{image.height}</span></span>
                {image.fileSize && <span>{(image.fileSize / 1024).toFixed(1)} KB</span>}
            </div>
            <div className={`flex items-center ${!isRatioCorrect && requiredRatio ? 'text-amber-600 font-medium' : ''}`}>
                <span>{image.aspectRatio}</span>
                {!isRatioCorrect && requiredRatio && (
                    <span className="ml-2 flex items-center text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded"><AlertCircle size={10} className="mr-1" /> Expect {requiredRatio}</span>
                )}
            </div>
        </div>
    );
};

const TabButton = ({ isActive, onClick, label, icon: Icon, hasError }: { isActive: boolean; onClick: () => void; label: string; icon: any; hasError?: boolean }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 outline-none focus:outline-none ${isActive
            ? 'border-blue-600 text-blue-600 bg-blue-50/50'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            } ${hasError ? 'text-rose-500 border-rose-300' : ''}`}
    >
        <Icon size={18} className={isActive ? 'text-blue-600' : (hasError ? 'text-rose-500' : 'text-gray-400')} />
        <span>{label}</span>
        {hasError && <div className="w-2 h-2 rounded-full bg-rose-500 ml-2" />}
    </button>
);

const Section = ({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
        {title && (
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            </div>
        )}
        <div className="p-6 space-y-6">
            {children}
        </div>
    </div>
);

const InputGroup = ({ label, error, children, required, helpText, className = '' }: { label: string; error?: any; children: React.ReactNode, required?: boolean, helpText?: string, className?: string }) => (
    <div className={`space-y-1.5 ${className}`}>
        <div className="flex justify-between items-baseline">
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
        </div>
        {children}
        {helpText && !error && <p className="text-xs text-gray-500">{helpText}</p>}
        {error && <p className="text-xs text-rose-500 flex items-center animate-pulse"><AlertCircle size={12} className="mr-1" /> {error.message}</p>}
    </div>
);

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
    return (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-xl text-white z-50 flex items-center space-x-3 animate-slide-up ${type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
            }`}>
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-4 hover:opacity-80 p-1"><X size={16} /></button>
        </div>
    );
};


export default function ProjectForm({ project, categories }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basics');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const defaultValues: Partial<ProjectFormValues> = project ? {
        ...project,
        tags: project.tags?.map((t: string) => ({ value: t })) || [],
        videos: project.videos?.map((v: string) => ({ value: v })) || [],
        challenges: project.challenges?.map((c: string) => ({ value: c })) || [],
        solution: project.solution?.map((s: string) => ({ value: s })) || [],
        seoKeywords: project.seoKeywords?.map((k: string) => ({ value: k })) || [],
        techStack: project.techStack || [],
        processSteps: project.processSteps || [],
        metrics: project.metrics || [],
        testimonial: project.testimonial || {},
        galleryImages: project.galleryImages || [],
        publishDate: project.publishDate ? new Date(project.publishDate).toISOString().split('T')[0] : '',
        unpublishDate: project.unpublishDate ? new Date(project.unpublishDate).toISOString().split('T')[0] : '',
    } : {
        status: 'draft',
        featured: false,
        showInPortfolio: true,
        showInHomepage: false,
        displayOrder: 0,
        tags: [], videos: [], challenges: [], solution: [], processSteps: [], metrics: [], seoKeywords: [], techStack: [],
        testimonial: {},
        galleryImages: [],
    };

    const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues,
    });

    // Watch title for slug auto-generation
    const titleValue = watch('title');
    useEffect(() => {
        if (!project && titleValue) {
            const slug = titleValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setValue('slug', slug);
        }
    }, [titleValue, setValue, project]);

    // Dynamic Fields
    const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: 'tags' });
    const { fields: techStackFields, append: appendTechStack, remove: removeTechStack } = useFieldArray({ control, name: 'techStack' });
    const { fields: processFields, append: appendProcess, remove: removeProcess } = useFieldArray({ control, name: 'processSteps' });
    const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({ control, name: 'metrics' });
    const { fields: challengeFields, append: appendChallenge, remove: removeChallenge } = useFieldArray({ control, name: 'challenges' });
    const { fields: galleryFields, append: appendGallery, remove: removeGallery, update: updateGallery } = useFieldArray({ control, name: 'galleryImages' });
    const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({ control, name: 'seoKeywords' });

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const onSubmit = async (data: ProjectFormValues) => {
        setLoading(true);
        try {
            const transformedData = {
                ...data,
                tags: data.tags?.map((t: any) => t.value) || [],
                videos: data.videos?.map((v: any) => v.value) || [],
                challenges: data.challenges?.map((c: any) => c.value) || [],
                solution: data.solution?.map((s: any) => s.value) || [],
                seoKeywords: data.seoKeywords?.map((k: any) => k.value) || [],
                publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
                unpublishDate: data.unpublishDate ? new Date(data.unpublishDate) : undefined,
            };

            if (process.env.NODE_ENV === 'development') {
                console.log('[DEBUG] Submitting Project Data:', transformedData);
            }

            if (project) {
                await editProject(project._id, transformedData);
                showToast('Project updated successfully', 'success');
            } else {
                await addProject(transformedData);
                showToast('Project created successfully', 'success');
            }

            router.push('/admin/projects');
            router.refresh();
        } catch (error: any) {
            console.error('[ProjectForm] Submission Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save project';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const onError = (errors: any) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('[DEBUG] Form Errors:', errors);
        }
        showToast('Please correct the errors in the form.', 'error');
    };

    // Helper to check errors in tabs
    const hasErrors = (fields: string[]) => fields.some(field => errors[field as keyof ProjectFormValues]);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit, onError)}>

                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{project ? 'Edit Project' : 'New Project'}</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage content, media, and case study details.</p>
                    </div>
                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-200">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center items-center px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Top Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 sticky top-4 z-30 overflow-hidden">
                    <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
                        <TabButton
                            label="Basics"
                            icon={Layout}
                            isActive={activeTab === 'basics'}
                            onClick={() => setActiveTab('basics')}
                            hasError={hasErrors(['title', 'slug', 'description', 'categoryId'])}
                        />
                        <TabButton
                            label="Client"
                            icon={User}
                            isActive={activeTab === 'client'}
                            onClick={() => setActiveTab('client')}
                            hasError={hasErrors(['clientName', 'projectYear'])}
                        />
                        <TabButton
                            label="Media"
                            icon={ImageIcon}
                            isActive={activeTab === 'content'}
                            onClick={() => setActiveTab('content')}
                            hasError={hasErrors(['thumbnail', 'coverImage'])}
                        />
                        <TabButton
                            label="Case Study"
                            icon={FileText}
                            isActive={activeTab === 'casestudy'}
                            onClick={() => setActiveTab('casestudy')}
                            hasError={hasErrors(['processSteps'])}
                        />
                        <TabButton
                            label="Results"
                            icon={BarChart}
                            isActive={activeTab === 'results'}
                            onClick={() => setActiveTab('results')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Form Content */}
                    <div className="lg:col-span-8 space-y-8">

                        {activeTab === 'basics' && (
                            <>
                                <Section title="Project Identity">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Project Title" error={errors.title} required>
                                            <input {...register('title')} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50 focus:bg-white transition-colors" placeholder="e.g. Modern E-commerce Platform" />
                                        </InputGroup>
                                        <InputGroup label="URL Slug" error={errors.slug} required helpText="Auto-generated from title">
                                            <input {...register('slug')} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50" />
                                        </InputGroup>
                                    </div>
                                    <InputGroup label="Short Summary" error={errors.shortSummary} required helpText="Appears in cards and SEO descriptions (150-160 chars)">
                                        <textarea {...register('shortSummary')} rows={3} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50 focus:bg-white resize-none" placeholder="A brief overview of the project..." />
                                    </InputGroup>
                                </Section>

                                <Section title="Full Description">
                                    <InputGroup label="Project Description" error={errors.description} required helpText="Markdown supported">
                                        <textarea {...register('description')} rows={12} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-4 bg-gray-50 focus:bg-white font-mono text-sm leading-relaxed" placeholder="# Introduction..." />
                                    </InputGroup>
                                </Section>

                                <Section title="Classification">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Category" error={errors.categoryId} required>
                                            <select {...register('categoryId')} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50">
                                                <option value="">Select Category...</option>
                                                {categories.map((cat) => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </InputGroup>
                                        <InputGroup label="Display Override" error={errors.displayCategoryOverride} helpText="Optional frontend label">
                                            <input {...register('displayCategoryOverride')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 bg-gray-50" placeholder="e.g. Corporate Website" />
                                        </InputGroup>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Tech Stack</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {techStackFields.map((field, index) => (
                                                <div key={field.id} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                                                    <input {...register(`techStack.${index}.name` as const)} placeholder="Name" className="flex-1 min-w-0 rounded border-gray-300 shadow-sm text-sm p-1.5" />
                                                    <input {...register(`techStack.${index}.category` as const)} placeholder="Type" className="w-24 rounded border-gray-300 shadow-sm text-sm p-1.5" />
                                                    <button type="button" onClick={() => removeTechStack(index)} className="text-gray-400 hover:text-rose-500 p-1"><X size={16} /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => appendTechStack({ name: '', category: '' })} className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors w-max"><Plus size={16} className="mr-1" /> Add Technology</button>
                                    </div>
                                </Section>
                            </>
                        )}

                        {activeTab === 'client' && (
                            <div className="space-y-8">
                                <Section title="Client Information">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Client Name" error={errors.clientName} required>
                                            <input {...register('clientName')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 bg-gray-50" />
                                        </InputGroup>
                                        <InputGroup label="Company" error={errors.clientCompany} required>
                                            <input {...register('clientCompany')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 bg-gray-50" />
                                        </InputGroup>
                                        <InputGroup label="Website" error={errors.clientWebsite}>
                                            <input {...register('clientWebsite')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 bg-gray-50" placeholder="https://" />
                                        </InputGroup>
                                        <InputGroup label="Industry" error={errors.clientIndustry}>
                                            <input {...register('clientIndustry')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 bg-gray-50" />
                                        </InputGroup>
                                    </div>
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Client Logo</label>
                                        <div className="max-w-xs">
                                            <Controller control={control} name="clientLogo" render={({ field }) => (
                                                <>
                                                    <ImageUpload value={field.value} onChange={field.onChange} />
                                                    <ImageMetaInfo image={field.value} requiredRatio="1:1" />
                                                </>
                                            )} />
                                        </div>
                                    </div>
                                </Section>

                                <Section title="Project Scope & Meta">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Year" error={errors.projectYear}>
                                            <input {...register('projectYear')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 bg-gray-50" />
                                        </InputGroup>
                                        <InputGroup label="Location" error={errors.projectLocation}>
                                            <input {...register('projectLocation')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 bg-gray-50" />
                                        </InputGroup>
                                        <InputGroup label="Duration" error={errors.projectDuration}>
                                            <input {...register('projectDuration')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 bg-gray-50" />
                                        </InputGroup>
                                        <InputGroup label="Live URL" error={errors.projectUrl}>
                                            <input {...register('projectUrl')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 bg-gray-50" />
                                        </InputGroup>
                                    </div>
                                </Section>
                            </div>
                        )}

                        {activeTab === 'content' && (
                            <div className="space-y-8">
                                <Section title="Primary Visuals">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="block text-sm font-bold text-gray-800">Thumbnail <span className="text-rose-500">*</span></label>
                                            <div className="bg-blue-50 border border-blue-100 rounded p-2 mb-2 text-xs text-blue-700 flex items-center"><Info size={14} className="mr-1.5" /> Portrait (4:5) for grid layout.</div>
                                            <Controller control={control} name="thumbnail" render={({ field }) => (
                                                <>
                                                    <ImageUpload value={field.value} onChange={field.onChange} />
                                                    <ImageMetaInfo image={field.value} requiredRatio="4:5" />
                                                </>
                                            )} />
                                            {errors.thumbnail && <p className="text-xs text-rose-500">Required</p>}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-sm font-bold text-gray-800">Cover Image <span className="text-rose-500">*</span></label>
                                            <div className="bg-blue-50 border border-blue-100 rounded p-2 mb-2 text-xs text-blue-700 flex items-center"><Info size={14} className="mr-1.5" /> Landscape (16:9) for hero section.</div>
                                            <Controller control={control} name="coverImage" render={({ field }) => (
                                                <>
                                                    <ImageUpload value={field.value} onChange={field.onChange} />
                                                    <ImageMetaInfo image={field.value} requiredRatio="16:9" />
                                                </>
                                            )} />
                                            {errors.coverImage && <p className="text-xs text-rose-500">Required</p>}
                                        </div>
                                    </div>
                                </Section>

                                <Section title="Project Gallery">
                                    <div className="space-y-6">
                                        {galleryFields.map((field, index) => (
                                            <div key={field.id} className="relative bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-6 items-start hover:border-blue-200 transition-colors">
                                                <div className="w-full md:w-48 flex-shrink-0">
                                                    <ImageUpload value={field} onChange={(val) => {
                                                        const currentValues = getValues(`galleryImages.${index}`);
                                                        updateGallery(index, { ...val, caption: currentValues?.caption, alt: currentValues?.alt });
                                                    }} />
                                                    <ImageMetaInfo image={field} />
                                                </div>
                                                <div className="flex-1 space-y-4 w-full">
                                                    <InputGroup label="Caption">
                                                        <input {...register(`galleryImages.${index}.caption` as const)} className="w-full rounded-lg border-gray-300 shadow-sm text-sm p-2.5" placeholder="Image description..." />
                                                    </InputGroup>
                                                    <InputGroup label="Alt Text">
                                                        <input {...register(`galleryImages.${index}.alt` as const)} className="w-full rounded-lg border-gray-300 shadow-sm text-sm p-2.5" placeholder="For accessibility..." />
                                                    </InputGroup>
                                                </div>
                                                <button type="button" onClick={() => removeGallery(index)} className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-rose-500 p-1.5 rounded-full shadow-md border border-gray-100"><X size={16} /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendGallery({ url: '' })} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/20 font-medium transition-all flex justify-center items-center">
                                            <Plus size={20} className="mr-2" /> Add Gallery Image
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Hero Customization">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Image Override (Optional)</label>
                                            <Controller control={control} name="heroImageOverride" render={({ field }) => (
                                                <>
                                                    <ImageUpload value={field.value} onChange={field.onChange} />
                                                    <ImageMetaInfo image={field.value} requiredRatio="16:9" />
                                                </>
                                            )} />
                                        </div>
                                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                            <InputGroup label="Overlay Opacity">
                                                <div className="flex items-center space-x-4">
                                                    <input type="range" min="0" max="1" step="0.1" {...register('heroImageOverlayOpacity', { valueAsNumber: true })} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                                    <span className="w-12 text-sm text-gray-700 font-mono text-right">{watch('heroImageOverlayOpacity') || 0}</span>
                                                </div>
                                            </InputGroup>
                                            <InputGroup label="Overlay Color">
                                                <div className="flex items-center space-x-3">
                                                    <input type="color" {...register('heroImageOverlayColor')} className="h-10 w-14 rounded cursor-pointer border-0 p-0" />
                                                    <input type="text" {...register('heroImageOverlayColor')} className="flex-1 rounded border-gray-300 shadow-sm text-sm p-2 uppercase" placeholder="#000000" />
                                                </div>
                                            </InputGroup>
                                        </div>
                                    </div>
                                </Section>
                            </div>
                        )}

                        {activeTab === 'casestudy' && (
                            <div className="space-y-8">
                                <Section title="The Challenge">
                                    <div className="space-y-6">
                                        <InputGroup label="Problem Statement" error={errors.problemStatement} required>
                                            <textarea {...register('problemStatement')} rows={4} className="w-full rounded-lg border-gray-300 shadow-sm text-sm p-4 bg-gray-50" placeholder="Articulate the core problem..." />
                                        </InputGroup>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup label="Objectives" error={errors.objectives}>
                                                <textarea {...register('objectives')} rows={5} className="w-full rounded-lg border-gray-300 shadow-sm text-sm p-4 bg-gray-50" />
                                            </InputGroup>
                                            <InputGroup label="Target Audience" error={errors.targetAudience}>
                                                <textarea {...register('targetAudience')} rows={5} className="w-full rounded-lg border-gray-300 shadow-sm text-sm p-4 bg-gray-50" />
                                            </InputGroup>
                                        </div>
                                    </div>
                                </Section>

                                <Section title="Process & Workflow">
                                    <div className="space-y-6">
                                        {processFields.map((field, index) => (
                                            <div key={field.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm relative group">
                                                <div className="absolute top-4 left-4 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">Step {index + 1}</div>
                                                <button type="button" onClick={() => removeProcess(index)} className="absolute top-4 right-4 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>

                                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <InputGroup label="Step Title" required>
                                                            <input {...register(`processSteps.${index}.title` as const)} className="w-full rounded-lg border-gray-300 shadow-sm text-sm p-3 font-medium" />
                                                        </InputGroup>
                                                        <InputGroup label="Description" required>
                                                            <textarea {...register(`processSteps.${index}.description` as const)} rows={4} className="w-full rounded-lg border-gray-300 shadow-sm text-sm p-3 bg-gray-50 resize-none" />
                                                        </InputGroup>
                                                    </div>
                                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Visual Aid</label>
                                                        <Controller control={control} name={`processSteps.${index}.image` as const} render={({ field }) => (
                                                            <>
                                                                <ImageUpload value={field.value} onChange={field.onChange} />
                                                                <ImageMetaInfo image={field.value} />
                                                            </>
                                                        )} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendProcess({ title: '', description: '' })} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 font-medium transition-colors flex justify-center items-center">
                                            <Plus size={20} className="mr-2" /> Add Process Step
                                        </button>
                                    </div>
                                </Section>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="space-y-8">
                                <Section title="Key Outcomes">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {metricFields.map((field, index) => (
                                            <div key={field.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow">
                                                <button type="button" onClick={() => removeMetric(index)} className="absolute top-2 right-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                                <div className="space-y-2 mt-2">
                                                    <InputGroup label="Value">
                                                        <input {...register(`metrics.${index}.value` as const)} className="w-full rounded border-gray-200 shadow-sm text-2xl font-bold p-2 text-center text-blue-600 bg-transparent focus:ring-0 focus:border-blue-500" placeholder="0%" />
                                                    </InputGroup>
                                                    <InputGroup label="Metric Label">
                                                        <input {...register(`metrics.${index}.label` as const)} className="w-full rounded border-gray-200 shadow-sm text-xs font-medium text-gray-500 text-center p-1.5 uppercase tracking-wide" placeholder="CONVERSION RATE" />
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendMetric({ label: '', value: '' })} className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors h-full min-h-[140px]">
                                            <Plus size={28} className="mb-2" /> <span className="text-sm font-semibold">Add Metric</span>
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Testimonial">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-4">
                                            <InputGroup label="Quote" error={errors.testimonial?.quote}>
                                                <textarea {...register('testimonial.quote')} rows={4} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-base p-4 italic text-gray-600 bg-amber-50/30" placeholder="&ldquo;The best solution we have ever used...&rdquo;" />
                                            </InputGroup>
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputGroup label="Author Name" error={errors.testimonial?.author}>
                                                    <input {...register('testimonial.author')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3" />
                                                </InputGroup>
                                                <InputGroup label="Role / Title" error={errors.testimonial?.role}>
                                                    <input {...register('testimonial.role')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3" />
                                                </InputGroup>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Author Photo</label>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <Controller control={control} name="testimonial.image" render={({ field }) => (
                                                    <>
                                                        <ImageUpload value={field.value} onChange={field.onChange} />
                                                        <ImageMetaInfo image={field.value} requiredRatio="1:1" />
                                                    </>
                                                )} />
                                            </div>
                                        </div>
                                    </div>
                                </Section>

                                <Section title="Search & Social">
                                    <div className="space-y-6">
                                        <InputGroup label="SEO Title" error={errors.seoTitle} helpText="Title tag for search engines">
                                            <input {...register('seoTitle')} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3" />
                                        </InputGroup>
                                        <InputGroup label="Meta Description" error={errors.seoDescription} helpText="Description meta tag">
                                            <textarea {...register('seoDescription')} rows={3} className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3" />
                                        </InputGroup>
                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Social Share Image (OG)</label>
                                            <div className="max-w-md">
                                                <Controller control={control} name="ogImage" render={({ field }) => (
                                                    <>
                                                        <ImageUpload value={field.value} onChange={field.onChange} />
                                                        <ImageMetaInfo image={field.value} requiredRatio="1.91:1" />
                                                    </>
                                                )} />
                                            </div>
                                        </div>
                                    </div>
                                </Section>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Settings (Sticky) */}
                    <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
                        <Section title="Publishing" className="bg-white border-blue-100 shadow-md">
                            <div className="space-y-4">
                                <InputGroup label="Status" error={errors.status}>
                                    <select {...register('status')} className={`w-full rounded-lg border-gray-300 shadow-sm p-3 text-sm font-medium ${watch('status') === 'published' ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-700'
                                        }`}>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </InputGroup>

                                <div className="space-y-2 pt-2">
                                    <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <input type="checkbox" {...register('featured')} className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                                            <span className="text-sm font-medium text-gray-700">Featured Project</span>
                                        </div>
                                        <span className="text-xs text-gray-400">Home</span>
                                    </label>
                                    <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <input type="checkbox" {...register('showInPortfolio')} className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                                            <span className="text-sm font-medium text-gray-700">Show in Portfolio</span>
                                        </div>
                                        <span className="text-xs text-gray-400">List</span>
                                    </label>
                                </div>

                                <div className="pt-4 border-t border-gray-100 space-y-4">
                                    <InputGroup label="Publish Date" error={errors.publishDate}>
                                        <input type="date" {...register('publishDate')} className="w-full rounded-lg border-gray-300 shadow-sm p-2.5 text-sm text-gray-600" />
                                    </InputGroup>
                                    <InputGroup label="Unpublish Date" error={errors.unpublishDate}>
                                        <input type="date" {...register('unpublishDate')} className="w-full rounded-lg border-gray-300 shadow-sm p-2.5 text-sm text-gray-600" />
                                    </InputGroup>
                                </div>
                            </div>
                        </Section>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center"><Info size={16} className="mr-2" /> Formatting Tips</h4>
                            <ul className="text-xs text-blue-700 space-y-1.5 list-disc list-inside">
                                <li>Use <strong>Title Case</strong> for all headers.</li>
                                <li>Descriptions support standard Markdown.</li>
                                <li>Images are auto-optimized.</li>
                                <li>Ensure all required fields marked (*) are filled.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </form>
        </div>
    );
}
