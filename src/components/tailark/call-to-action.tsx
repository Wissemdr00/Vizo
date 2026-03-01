import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CallToAction() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Start analyzing your data today</h2>
                    <p className="mt-4 text-muted-foreground text-lg">20 free AI queries. No credit card required. Upload a CSV and get insights in seconds.</p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mt-12">
                        <Button size="lg" asChild>
                            <Link href="/sign-up">
                                Get Started for Free
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/#pricing">View Pricing</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
