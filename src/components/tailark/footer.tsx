import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-black border-t border-zinc-900 pt-20 pb-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 relative z-10">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-5 h-5 bg-[#8B5CF6] rounded-sm rotate-45"></div>
                        <span className="text-2xl font-bold font-[family-name:var(--font-manrope)] tracking-tight text-white">Vizo</span>
                    </div>
                    <p className="text-zinc-500 max-w-xs leading-relaxed">AI-powered data analytics platform. Connect your data, ask questions, get instant insights.</p>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest mb-6">Platform</h4>
                    <ul className="space-y-4 text-zinc-400 text-sm">
                        <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                        <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        <li><Link href="/docs" className="hover:text-white transition-colors">Docs</Link></li>
                        <li><Link href="/sign-up" className="hover:text-white transition-colors">Get Started</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest mb-6">Company</h4>
                    <ul className="space-y-4 text-zinc-400 text-sm">
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>
            </div>

            {/* Huge Footer Text */}
            <div className="flex justify-center items-center py-10 opacity-20 pointer-events-none">
                <h1 className="text-[15vw] leading-none font-bold font-[family-name:var(--font-manrope)] tracking-tighter text-stroke select-none">VIZO</h1>
            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-[10px] uppercase tracking-widest">
                <p>&copy; {new Date().getFullYear()} Vizo. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-zinc-400">Twitter</Link>
                    <Link href="#" className="hover:text-zinc-400">LinkedIn</Link>
                    <Link href="#" className="hover:text-zinc-400">GitHub</Link>
                </div>
            </div>
        </footer>
    )
}
