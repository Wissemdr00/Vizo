export default function StatsSection() {
    return (
        <section className="py-20 px-6 border-y border-white/5">
            <div className="mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-semibold font-[family-name:var(--font-manrope)] text-white tracking-tight lg:text-5xl">Trusted by data teams everywhere</h2>
                    <p className="mt-4 text-zinc-400">From solo analysts to enterprise teams, Vizo helps you go from data to decisions faster.</p>
                </div>

                <div className="grid gap-12 md:grid-cols-3 md:gap-2">
                    <div className="text-center space-y-2">
                        <div className="text-5xl font-bold text-white font-[family-name:var(--font-manrope)]">15+</div>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Data Connectors</p>
                    </div>
                    <div className="text-center space-y-2 md:border-x md:border-white/10">
                        <div className="text-5xl font-bold text-white font-[family-name:var(--font-manrope)]">7</div>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Analysis Templates</p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-5xl font-bold text-white font-[family-name:var(--font-manrope)]">&lt;10s</div>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Time to First Insight</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
