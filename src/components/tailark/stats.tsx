export default function StatsSection() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
                    <h2 className="text-4xl font-medium lg:text-5xl">Trusted by data teams everywhere</h2>
                    <p>From solo analysts to enterprise teams, Vizo helps you go from data to decisions faster than ever.</p>
                </div>

                <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
                    <div className="space-y-4">
                        <div className="text-5xl font-bold">15+</div>
                        <p>Data Connectors</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-5xl font-bold">7</div>
                        <p>Analysis Templates</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-5xl font-bold">&lt;10s</div>
                        <p>Time to First Insight</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
