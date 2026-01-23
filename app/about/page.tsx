"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Shield, Terminal, Zap, Users, Code, Cpu, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="space-y-16 py-10 max-w-5xl mx-auto px-6">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center space-y-6"
            >
                <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 backdrop-blur-xl">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                    v1.0.0 Public Beta
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-white lg:text-7xl">
                    Crafting the <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-400 to-emerald-400">
                        Future of DevTools
                    </span>
                </h1>
                <p className="max-w-2xl text-lg text-zinc-400 leading-relaxed">
                    A next-generation developer utility belt designed for speed, security, and modern workflows.
                    Running entirely on the client-side for maximum privacy.
                </p>
            </motion.div>

            {/* Core Values */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="grid gap-6 md:grid-cols-3"
            >
                <Card className="border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                            <Zap className="h-6 w-6 text-blue-400" />
                        </div>
                        <CardTitle className="text-xl">Lightning Fast</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400 leading-relaxed">
                        Engineered for zero-latency. No server round-trips for sensitive data processing. Your JWTs, keys, and code never leave your browser.
                    </CardContent>
                </Card>

                <Card className="border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-purple-400" />
                        </div>
                        <CardTitle className="text-xl">Security First</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400 leading-relaxed">
                        Built-in security auditing, attack simulation, and compliance mapping. Move from "building" to "building securely" seamlessly.
                    </CardContent>
                </Card>

                <Card className="border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Terminal className="h-6 w-6 text-emerald-400" />
                        </div>
                        <CardTitle className="text-xl">Developer DX</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400 leading-relaxed">
                        Typography-centric design, keyboard-first navigation, and a clutter-free interface that respects your focus state.
                    </CardContent>
                </Card>
            </motion.div>

            {/* Meet the Team Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-8"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-zinc-200 to-zinc-500 inline-block">
                        Meet the Creators
                    </h2>
                    <p className="text-zinc-500 mt-2">The minds behind the architecture.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
                    {/* Team Member 1 */}
                    <Card className="border-zinc-800 bg-zinc-900/50 overflow-hidden group">
                        <div className="h-24 bg-linear-to-r from-blue-600 to-blue-900 group-hover:h-32 transition-all duration-300 relative">
                            <div className="absolute -bottom-10 left-6 border-4 border-zinc-900 rounded-xl overflow-hidden">
                                <div className="h-20 w-20 bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white">
                                    HR
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-12 mt-2">
                            <h3 className="text-xl font-bold text-white">Hadi Ramdhani</h3>
                            <p className="text-blue-400 font-medium text-sm mb-4">Lead Software Engineer</p>
                            <p className="text-zinc-400 text-sm mb-4">
                                Fullstack architect specializing in React performance and security tools. Obsessed with pixel-perfect UI and clean architecture.
                            </p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="text-xs bg-zinc-800"><Code className="w-3 h-3 mr-1" /> Engineering</Badge>
                                <Badge variant="secondary" className="text-xs bg-zinc-800"><Cpu className="w-3 h-3 mr-1" /> Architecture</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Member 2 (Placeholder or generic "Contributors") */}
                    <Card className="border-zinc-800 bg-zinc-900/50 overflow-hidden group opacity-80 hover:opacity-100 transition-opacity">
                        <div className="h-24 bg-linear-to-r from-purple-600 to-pink-900 mt-0 group-hover:h-32 transition-all duration-300 relative">
                            <div className="absolute -bottom-10 left-6 border-4 border-zinc-900 rounded-xl overflow-hidden">
                                <div className="h-20 w-20 bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white">
                                    AA
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-12 mt-2">
                            <h3 className="text-xl font-bold text-white">Akmal Alhafiz</h3>
                            <p className="text-purple-400 font-medium text-sm mb-4">DevOps & Research</p>
                            <p className="text-zinc-400 text-sm mb-4">
                                Advanced agentic coding assistant providing architectural patterns, security algorithms, and code generation.
                            </p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="text-xs bg-zinc-800"><Bot className="w-3 h-3 mr-1" /> DevOps</Badge>
                                <Badge variant="secondary" className="text-xs bg-zinc-800"><Zap className="w-3 h-3 mr-1" /> Quality Assurance</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Community / Open Source */}
                    <Card className="border-zinc-800 bg-zinc-900/50 overflow-hidden group opacity-80 hover:opacity-100 transition-opacity">
                        <div className="h-24 bg-gradient-to-r from-emerald-600 to-teal-900 group-hover:h-32 transition-all duration-300 relative">
                            <div className="absolute -bottom-10 left-6 border-4 border-zinc-900 rounded-xl overflow-hidden">
                                <div className="h-20 w-20 bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white">
                                    OS
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-12 mt-2">
                            <h3 className="text-xl font-bold text-white">Open Source</h3>
                            <p className="text-emerald-400 font-medium text-sm mb-4">Values & Community</p>
                            <p className="text-zinc-400 text-sm mb-4">
                                Driven by the community. We believe in transparent, verifiable, and freely available developer tools for everyone.
                            </p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="text-xs bg-zinc-800"><Globe className="w-3 h-3 mr-1" /> Global</Badge>
                                <Badge variant="secondary" className="text-xs bg-zinc-800"><Users className="w-3 h-3 mr-1" /> Community</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>

            {/* Tech Stack */}
            <div className="space-y-8 pt-10 border-t border-zinc-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">Technology Stack</h2>
                        <p className="text-zinc-500 text-sm">Powered by the latest reliable web technologies.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="https://github.com/0xHadiRamdhani/devtools" target="_blank">
                            <Button variant="outline" className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:text-white">
                                <Github className="mr-2 h-4 w-4" /> View Source
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {[
                        "Next.js 15", "React 19", "TailwindCSS v4",
                        "Framer Motion", "Lucide Icons", "Radix UI",
                        "React Flow", "Zustand", "TypeScript 5",
                        "Shadcn UI", "Recharts", "Vercel"
                    ].map((tech) => (
                        <div key={tech} className="flex items-center justify-center p-3 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400 text-xs font-mono hover:border-zinc-700 hover:bg-zinc-900 transition-colors">
                            {tech}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Icon for AI
function Bot(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
        </svg>
    )
}
