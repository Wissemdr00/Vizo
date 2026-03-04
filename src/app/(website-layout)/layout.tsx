import { appConfig } from "@/lib/config";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | " + appConfig.projectName,
    default: appConfig.projectName,
  },
  description: appConfig.description,
  openGraph: {
    title: appConfig.projectName,
    description: appConfig.description,
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`,
        width: 1200,
        height: 630,
        alt: appConfig.projectName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appConfig.projectName,
    description: appConfig.description,
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/images/og.png`],
  },
};

function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-[family-name:var(--font-inter)] relative overflow-x-hidden selection-purple">
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0015] to-black"></div>
        <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_50s_linear_infinite]"></div>
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_80s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)]"></div>
      </div>

      {/* Top Blur */}
      <div className="gradient-blur-top"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default WebsiteLayout;
