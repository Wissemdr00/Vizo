export default function FAQs() {
    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
                    <div className="text-center lg:text-left">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                            Frequently <br className="hidden lg:block" /> Asked <br className="hidden lg:block" />
                            Questions
                        </h2>
                        <p className="text-muted-foreground">Everything you need to know about Vizo.</p>
                    </div>

                    <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
                        <div className="pb-6">
                            <h3 className="font-medium">What data sources does Vizo support?</h3>
                            <p className="text-muted-foreground mt-4">Vizo supports 15+ connectors including CSV, Excel, JSON, PostgreSQL, MySQL, MongoDB, Google Sheets, Airtable, Notion, REST APIs, BigQuery, Snowflake, and Redshift. More connectors are added regularly.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Do I need to know SQL or Python to use Vizo?</h3>
                            <p className="text-muted-foreground mt-4">No. You ask questions in plain English and Vizo generates the SQL or Python code for you. You can also see, edit, and re-run the generated code if you want full control.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Is my data secure?</h3>
                            <p className="text-muted-foreground my-4">Yes. Vizo uses encrypted connections for all data sources. We never store your raw data permanently — only query results needed to display your analysis. Database credentials are encrypted at rest.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">What counts as an AI query?</h3>
                            <p className="text-muted-foreground mt-4">Each message you send in a conversation that triggers an AI analysis counts as one query. Simple follow-up questions in the same context are efficient. Your plan includes a monthly query allowance, with additional credits available for purchase.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Can I share my analyses with my team?</h3>
                            <p className="text-muted-foreground mt-4">Yes. You can generate shareable links for any analysis or chart. Team collaboration features with shared workspaces are available on the Pro and Team plans.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
