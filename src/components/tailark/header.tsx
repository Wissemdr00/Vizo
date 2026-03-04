'use client'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'
import React from 'react'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '/docs' },
    { name: 'About', href: '#' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)

    return (
        <header className="fixed top-0 left-0 w-full z-50 pt-6 px-4">
            <nav className="max-w-5xl mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#8B5CF6] rounded-sm rotate-45"></div>
                    <span className="text-lg font-bold font-[family-name:var(--font-manrope)] tracking-tight text-white">Vizo</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="hidden md:block text-sm font-medium text-zinc-300 hover:text-white">
                        Log In
                    </Link>
                    <Link
                        href="/sign-up"
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 px-6 py-2 transition-transform active:scale-95"
                    >
                        <span className="absolute inset-0 border border-white/10 rounded-full"></span>
                        <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#8B5CF6_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span className="absolute inset-[1px] rounded-full bg-black"></span>
                        <span className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                            Get Access <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                    </Link>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMenuState(!menuState)}
                        className="md:hidden text-white p-1"
                        aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                    >
                        {menuState ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {menuState && (
                <div className="md:hidden mt-2 max-w-5xl mx-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-3">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="block text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2"
                            onClick={() => setMenuState(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        href="/sign-in"
                        className="block text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2"
                        onClick={() => setMenuState(false)}
                    >
                        Log In
                    </Link>
                </div>
            )}
        </header>
    )
}
