import { Database, MessageSquare, BarChart3, Code2, Plug, Share2 } from 'lucide-react'

export default function Features() {
    return (
        <section id="features" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 text-center max-w-3xl mx-auto animate-fade-up">
                    <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight font-[family-name:var(--font-manrope)] mb-6">
                        Everything You Need for <br />
                        <span className="text-[#8B5CF6]">Data Intelligence</span>
                    </h2>
                    <p className="text-lg text-zinc-400 font-light">
                        Connect your data, ask questions, get instant insights — no SQL or Python knowledge required.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[700px]">
                    {/* Main Feature Card */}
                    <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden p-8 border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black hover:border-white/20 transition-all rounded-xl">
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="mb-6 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-[#8B5CF6] w-fit">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-semibold text-white font-[family-name:var(--font-manrope)] mb-4 tracking-tight">Chat with Your Data</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">Ask questions in plain English. Vizo&apos;s AI understands your data schema and generates accurate SQL, Python code, and visual charts instantly.</p>
                            <div className="mt-auto flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                <span className="text-xs font-mono text-[#8B5CF6]">EXPLORE FEATURE</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ background: "radial-gradient(circle at top right, #8B5CF6, transparent 70%)" }}></div>
                    </div>

                    {/* Feature 2 */}
                    <div className="lg:col-span-2 group relative overflow-hidden p-8 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-blue-400 w-fit">
                                <Plug className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white font-[family-name:var(--font-manrope)] mb-2">15+ Data Connectors</h3>
                            <p className="text-zinc-400">Connect CSV, Excel, PostgreSQL, MySQL, MongoDB, Google Sheets, BigQuery, Snowflake, REST APIs, and more.</p>
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ background: "radial-gradient(circle at top right, #3b82f6, transparent 70%)" }}></div>
                    </div>

                    {/* Feature 3 */}
                    <div className="group relative overflow-hidden p-8 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl">
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-yellow-400 w-fit">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-manrope)] mb-2">Auto Charts</h3>
                            <p className="text-sm text-zinc-400">AI picks the best chart type — bar, line, scatter, pie, heatmap — based on your data shape.</p>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="group relative overflow-hidden p-8 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl">
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-emerald-400 w-fit">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-manrope)] mb-2">SQL & Python</h3>
                            <p className="text-sm text-zinc-400">Every answer comes with the code that generated it. Edit and re-run with one click.</p>
                        </div>
                    </div>

                    {/* Feature 5 */}
                    <div className="group relative overflow-hidden p-8 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl">
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-pink-400 w-fit">
                                <Database className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-manrope)] mb-2">Workspaces</h3>
                            <p className="text-sm text-zinc-400">Organize data sources and analyses into projects. Keep context always available.</p>
                        </div>
                    </div>

                    {/* Feature 6 */}
                    <div className="group relative overflow-hidden p-8 border border-white/10 bg-black hover:border-white/20 transition-all rounded-xl">
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-orange-400 w-fit">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-manrope)] mb-2">Share & Export</h3>
                            <p className="text-sm text-zinc-400">Share analysis links with teammates. Export charts and reports in one click.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
