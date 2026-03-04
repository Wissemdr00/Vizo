import Link from "next/link";
import { ArrowRight, Database, FileSpreadsheet, Table2 } from "lucide-react";

const connectors = [
  { name: "PostgreSQL", icon: Database },
  { name: "MySQL", icon: Database },
  { name: "CSV / Excel", icon: FileSpreadsheet },
  { name: "BigQuery", icon: Table2 },
  { name: "Snowflake", icon: Database },
];

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
      <div className="text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
          </span>
          <span className="text-xs font-medium text-violet-100/90 tracking-wide font-[family-name:var(--font-manrope)]">
            Now supporting 15+ data connectors
          </span>
          <ArrowRight className="w-3 h-3 text-violet-400" />
        </div>

        {/* Headline */}
        <h1
          className="text-6xl md:text-8xl font-semibold tracking-tighter font-[family-name:var(--font-manrope)] leading-[1.1] mb-8 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            Your Data Analyst
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            Powered by{" "}
            <span className="text-[#8B5CF6] inline-block relative">
              AI
              <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#8B5CF6] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          Connect any data source, ask questions in plain English, and get instant charts, SQL, and Python code — no data science degree required.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link href="/sign-up" className="shiny-cta group">
            <span className="relative z-10 flex items-center gap-2 text-white font-medium">
              Start for Free <ArrowRight className="transition-transform group-hover:translate-x-1 w-4 h-4" />
            </span>
          </Link>

          <Link
            href="#features"
            className="group px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            See How It Works
          </Link>
        </div>
      </div>

      {/* Logo Strip */}
      <div className="w-full mt-32 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-10 opacity-60 hover:opacity-100 transition-opacity">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase shrink-0">Integrated with:</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center w-full">
            {connectors.map(({ name, icon: Icon }) => (
              <div key={name} className="flex items-center gap-2 font-[family-name:var(--font-manrope)] font-semibold text-white/80">
                <Icon className="w-5 h-5 text-violet-400/60" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
