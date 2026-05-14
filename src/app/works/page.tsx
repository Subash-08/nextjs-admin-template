import Container from '@/components/layout/Container';
import PortfolioContainer from '@/components/works/PortfolioContainer';
import { generateSEO } from '@/lib/seo';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

export const metadata = generateSEO({
    title: 'Works',
    description: 'Explore my portfolio of web development projects, SaaS applications, and digital products.',
    keywords: ['portfolio', 'projects', 'case studies', 'web development'],
});

export const revalidate = 3600; // 1 hour

// Fetch categories for the tabs
async function getCategories() {
    try {
        await dbConnect();
        const categories = await Category.find().sort({ name: 1 }).lean();
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export default async function WorksPage() {
    // We still fetch initial projects if needed, or we rely on PortfolioContainer's internal logic.
    // The plan says "Fetch Layout Boxes for All tab" inside the container (or passed as prop).
    // But PortfolioContainer is client-side, so it can fetch on mount.
    // However, for SEO, we might want initial data?
    // The user requirement "Render layout exactly as defined" implies strict order.
    // Client-side fetch is fine for the sophisticated layout logic if we accept a loading state.
    // The previous implementation of `page.tsx` was Server Component.

    const categories = await getCategories();

    return (
        <main className="pt-32 pb-20">
            <Container>
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Selected Works</h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        A curated list of projects I've worked on, ranging from complex SaaS dashboards to high-performance marketing websites.
                    </p>
                </div>


                <PortfolioContainer categories={categories} />
            </Container>
        </main>
    );
}
