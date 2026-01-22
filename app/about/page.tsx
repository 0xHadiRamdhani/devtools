"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Shield, Terminal, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="space-y-12 py-10 max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
                    About <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">DevTools</span>
                </h1>
                <p className="max-w-2xl text-lg text-zinc-400">
                    The ultimate swiss-army knife for modern developers and security enthusiasts.
                    Built for speed, privacy, and education.
                </p>
            </div>

            {/* Mission Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-zinc-800 bg-zinc-900/30">
                    <CardHeader>
                        <Zap className="h-8 w-8 text-blue-400 mb-2" />
                        <CardTitle>Fast & Local</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400 text-sm leading-relaxed">
                        Most tools run entirely client-side. Your data (JWTs, JSON, code) stays in your browser.
                        Zero latency, zero data leaks.
                    </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/30">
                    <CardHeader>
                        <Shield className="h-8 w-8 text-purple-400 mb-2" />
                        <CardTitle>Security First</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400 text-sm leading-relaxed">
                        Includes advanced features like Auth Flow Analysis and Attack Simulation to help you build safer applications.
                    </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/30">
                    <CardHeader>
                        <Terminal className="h-8 w-8 text-emerald-400 mb-2" />
                        <CardTitle>Developer DX</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400 text-sm leading-relaxed">
                        Clean, dark-mode first UI designed for focus. Keyboard shortcuts, copy-paste friendly, and minimal distraction.
                    </CardContent>
                </Card>
            </div>

            {/* Stack Info */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">Built With</h2>
                <div className="flex flex-wrap gap-2">
                    {[
                        "Next.js 15", "React 19", "TailwindCSS v4", "Framer Motion", "Lucide Icons", "Shadcn UI", "React Flow"
                    ].map((tech) => (
                        <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                            {tech}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Footer / Contact */}
            <div className="pt-8 border-t border-zinc-800 text-center">
                <p className="text-zinc-500 mb-4">
                    Open Source & Community Driven.<br />
                    Created by <span className="text-zinc-300 font-medium">Software Engineer Hadi Ramdhani</span>.
                </p>
                <Link
                    href="https://github.com/0xHadiRamdhani/devtools"
                    target="_blank"
                    className="inline-flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <Github className="h-5 w-5" />
                    <span>View on GitHub</span>
                </Link>
            </div>
        </div>
    );
}
