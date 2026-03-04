import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CallToAction() {
    return (
        <section className="py-32 px-6 text-center bg-zinc-950/40">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-manrope)] mb-8 tracking-tighter text-white">
                    Ready to <span className="text-[#8B5CF6]">Analyze?</span>
                </h2>
                <p className="text-xl text-zinc-400 mb-12">
                    20 free AI queries. No credit card required. Upload a CSV and get insights in seconds.
                </p>

                <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/sign-up"
                        className="flex-1 bg-[#8B5CF6] hover:bg-violet-700 text-white font-bold rounded-full px-8 py-4 transition-all text-center flex items-center justify-center gap-2"
                    >
                        Get Started for Free
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/#pricing"
                        className="bg-white/5 border border-white/10 text-white font-bold rounded-full px-8 py-4 transition-all hover:bg-white/10 text-center"
                    >
                        View Pricing
                    </Link>
                </div>
            </div>
        </section>
    )
}
