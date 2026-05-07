'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Container from './Container';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Works', href: '/works' },
    ];

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm' : 'bg-transparent py-5'
                }`}
        >
            <Container>
                <nav className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold tracking-tighter text-gray-900 z-50">
                        PORTFOLIO<span className="text-blue-600">.</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${isActive(link.href)
                                    ? 'text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Let's Talk
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden z-50 p-2 text-gray-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Mobile Nav */}
                    {/* Mobile Nav Overlay */}
                    <div
                        className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-2xl font-bold ${isActive(link.href) ? 'text-blue-600' : 'text-gray-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-8 py-3 bg-gray-900 text-white text-lg font-medium rounded-full"
                        >
                            Start a Project
                        </Link>
                    </div>
                </nav>
            </Container>
        </header>
    );
}
