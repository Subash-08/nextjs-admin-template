import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Manage your portfolio content',
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </div>
            </main>
        </div>
    );
}
