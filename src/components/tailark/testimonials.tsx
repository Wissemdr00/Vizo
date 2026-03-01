import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

type Testimonial = {
    name: string
    role: string
    image: string
    quote: string
}

const testimonials: Testimonial[] = [
    {
        name: 'Sarah Chen',
        role: 'Marketing Analyst at GrowthCo',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        quote: 'Vizo replaced three tools for me. I upload our ad campaign CSVs and get instant ROAS breakdowns, spend trends, and optimization suggestions. What used to take half a day now takes 5 minutes.',
    },
    {
        name: 'Michael Torres',
        role: 'Head of Analytics at ShopFlow',
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
        quote: 'The fact that I can just type "show me revenue by product category this quarter" and get a chart with the SQL code underneath is incredible. My team adopted it in a week.',
    },
    {
        name: 'Priya Sharma',
        role: 'Data Analyst at FinEdge',
        image: 'https://randomuser.me/api/portraits/women/7.jpg',
        quote: 'I connected our PostgreSQL database and within minutes had a complete financial overview. The analysis templates detected our data schema automatically. Game changer.',
    },
    {
        name: 'James Wilson',
        role: 'Founder at MetricsDash',
        image: 'https://randomuser.me/api/portraits/men/8.jpg',
        quote: 'As a non-technical founder, I was always dependent on our data team for simple queries. With Vizo, I can explore our customer data myself and make faster decisions.',
    },
    {
        name: 'Elena Kowalski',
        role: 'E-commerce Manager at TrendStore',
        image: 'https://randomuser.me/api/portraits/women/4.jpg',
        quote: 'The proactive analysis blew my mind. I uploaded our sales data and Vizo immediately spotted a seasonal anomaly we had been missing for months. The chart suggestions are always spot-on.',
    },
    {
        name: 'David Park',
        role: 'Operations Lead at LogiServe',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        quote: 'We use Vizo for our daily operations metrics. The Python code generation for statistical analysis saves our team hours every week. The report generation feature ties it all together beautifully.',
    },
    {
        name: 'Amara Osei',
        role: 'Growth Analyst at SaaSpring',
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
        quote: 'Switched from Julius.ai to Vizo and haven\'t looked back. The workspace organization, template matching, and credit system are all thoughtfully designed. Best analytics tool for the price.',
    },
    {
        name: 'Ryan Murphy',
        role: 'VP of Sales at ClosedWon',
        image: 'https://randomuser.me/api/portraits/men/9.jpg',
        quote: 'Our sales team uses Vizo to analyze pipeline data. The Sales KPI template gives us instant dashboards with revenue trends, top performers, and conversion rates. Essential tool for any revenue team.',
    },
    {
        name: 'Lisa Nakamura',
        role: 'Product Manager at DataFirst',
        image: 'https://randomuser.me/api/portraits/women/10.jpg',
        quote: 'Vizo makes it incredibly easy to go from "I have a question about our data" to "here\'s a chart I can share with stakeholders." The shareable reports feature is exactly what we needed.',
    },
    {
        name: 'Carlos Mendez',
        role: 'Freelance Data Consultant',
        image: 'https://randomuser.me/api/portraits/men/11.jpg',
        quote: 'I use Vizo with every client engagement now. Upload their data, run a template analysis, generate a report — all in one session. My clients are amazed at how fast I deliver insights.',
    },
    {
        name: 'Nina Patel',
        role: 'Retention Analyst at SubStack',
        image: 'https://randomuser.me/api/portraits/women/12.jpg',
        quote: 'The churn analysis template is incredibly accurate. It detected our at-risk customer segments and suggested retention strategies we hadn\'t considered. Vizo paid for itself in the first month.',
    },
    {
        name: 'Thomas Bergman',
        role: 'CFO at NordTech',
        image: 'https://randomuser.me/api/portraits/men/13.jpg',
        quote: 'Finally a BI tool that doesn\'t require a 6-month implementation. I connected our accounting database and had a full P&L breakdown in 15 minutes. The financial template is exceptional.',
    },
]

const chunkArray = (array: Testimonial[], chunkSize: number): Testimonial[][] => {
    const result: Testimonial[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize))
    }
    return result
}

const testimonialChunks = chunkArray(testimonials, Math.ceil(testimonials.length / 3))

export default function WallOfLoveSection() {
    return (
        <section>
            <div className="py-16 md:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold">Loved by Data Teams</h2>
                        <p className="mt-6">See what analysts, marketers, and founders are saying about Vizo.</p>
                    </div>
                    <div className="mt-8 grid gap-3 [--color-card:var(--color-muted)] sm:grid-cols-2 md:mt-12 lg:grid-cols-3 dark:[--color-muted:var(--color-zinc-900)]">
                        {testimonialChunks.map((chunk, chunkIndex) => (
                            <div
                                key={chunkIndex}
                                className="space-y-3 *:border-none *:shadow-none">
                                {chunk.map(({ name, role, quote, image }, index) => (
                                    <Card key={index}>
                                        <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                                            <Avatar className="size-9">
                                                <AvatarImage
                                                    alt={name}
                                                    src={image}
                                                    loading="lazy"
                                                    width="120"
                                                    height="120"
                                                />
                                                <AvatarFallback>ST</AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h3 className="font-medium">{name}</h3>

                                                <span className="text-muted-foreground block text-sm tracking-wide">{role}</span>

                                                <blockquote className="mt-3">
                                                    <p className="text-gray-700 dark:text-gray-300">{quote}</p>
                                                </blockquote>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
