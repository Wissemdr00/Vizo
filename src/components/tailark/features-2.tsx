import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Database, MessageSquare, BarChart3, Code2, Plug, Share2 } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section id="features" className="py-16 md:py-32">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Everything you need to analyze data</h2>
                    <p className="mt-4 text-muted-foreground">Connect your data, ask questions, get instant insights — no SQL or Python knowledge required.</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 md:max-w-none md:grid-cols-3 dark:[--color-muted:var(--color-zinc-900)]">
                    <Card className="group border-0 shadow-none">
                        <CardHeader className="pb-3">
                            <CardDecorator><Plug className="size-6" aria-hidden /></CardDecorator>
                            <h3 className="mt-6 font-medium">15+ Data Connectors</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Connect CSV, Excel, PostgreSQL, MySQL, MongoDB, Google Sheets, Airtable, BigQuery, Snowflake, REST APIs, and more.</p>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-none">
                        <CardHeader className="pb-3">
                            <CardDecorator><MessageSquare className="size-6" aria-hidden /></CardDecorator>
                            <h3 className="mt-6 font-medium">Chat with Your Data</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Ask questions in plain English. Vizo&apos;s AI understands your data schema and generates accurate answers instantly.</p>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-none">
                        <CardHeader className="pb-3">
                            <CardDecorator><BarChart3 className="size-6" aria-hidden /></CardDecorator>
                            <h3 className="mt-6 font-medium">Auto-Generated Charts</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Vizo automatically picks the best chart type for your data — bar, line, scatter, pie, heatmap, and more.</p>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-none">
                        <CardHeader className="pb-3">
                            <CardDecorator><Code2 className="size-6" aria-hidden /></CardDecorator>
                            <h3 className="mt-6 font-medium">SQL & Python Generation</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Every answer comes with the SQL query or Python code that generated it. Edit and re-run with one click.</p>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-none">
                        <CardHeader className="pb-3">
                            <CardDecorator><Database className="size-6" aria-hidden /></CardDecorator>
                            <h3 className="mt-6 font-medium">Workspaces & Projects</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Organize your data sources and analyses into workspaces. Keep projects clean and context always available.</p>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-none">
                        <CardHeader className="pb-3">
                            <CardDecorator><Share2 className="size-6" aria-hidden /></CardDecorator>
                            <h3 className="mt-6 font-medium">Share & Collaborate</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Share analysis links with teammates or stakeholders. Export charts and reports in one click.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)
