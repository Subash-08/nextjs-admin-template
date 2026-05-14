import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import NextTopLoader from 'nextjs-toploader';
import AuthProvider from '@/components/providers/AuthProvider';
import { siteConfig } from '@/config/site';

// Fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: {
        default: siteConfig.seo.defaultTitle,
        template: siteConfig.seo.titleTemplate,
    },
    description: siteConfig.seo.defaultDescription,
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
            <body className="font-sans antialiased text-gray-900 bg-white">
                <AuthProvider>
                    <NextTopLoader color="#2563eb" showSpinner={false} />
                    <Navbar />
                    {children}
                </AuthProvider>
                <footer className="py-8 bg-gray-50 border-t border-gray-200 mt-20">
                    <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </div>
                </footer>
            </body>
        </html>
    );
}
