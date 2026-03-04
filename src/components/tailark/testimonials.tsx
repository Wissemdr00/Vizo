import { Star } from 'lucide-react'

export default function WallOfLoveSection() {
    return (
        <div className="w-full bg-[#8B5CF6] py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center gap-1 text-black mb-6">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-current" />
                    ))}
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-black font-[family-name:var(--font-manrope)] leading-tight mb-8">
                    &ldquo;Vizo replaced three tools for me. I upload our CSVs and get instant breakdowns, trends, and optimization suggestions. What used to take half a day now takes 5 minutes.&rdquo;
                </h3>
                <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-full overflow-hidden flex items-center justify-center">
                        <span className="text-white font-bold text-lg">SC</span>
                    </div>
                    <div className="text-left">
                        <div className="text-black font-bold text-lg">Sarah Chen</div>
                        <div className="text-black/70 font-medium">Marketing Analyst at GrowthCo</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
