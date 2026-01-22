"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldCheck, AlertTriangle, BookOpen, Calculator } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- Data ---

const OWASP_TOP_10 = [
    { id: "A01:2021", title: "Broken Access Control", cwe: ["CWE-22", "CWE-285", "CWE-639"] },
    { id: "A02:2021", title: "Cryptographic Failures", cwe: ["CWE-259", "CWE-327", "CWE-331"] },
    { id: "A03:2021", title: "Injection", cwe: ["CWE-20", "CWE-89", "CWE-79"] },
    { id: "A04:2021", title: "Insecure Design", cwe: ["CWE-209", "CWE-522"] },
    { id: "A05:2021", title: "Security Misconfiguration", cwe: ["CWE-16", "CWE-611"] },
    { id: "A06:2021", title: "Vulnerable and Outdated Components", cwe: ["CWE-1104"] },
    { id: "A07:2021", title: "Identification and Authentication Failures", cwe: ["CWE-287", "CWE-384"] },
    { id: "A08:2021", title: "Software and Data Integrity Failures", cwe: ["CWE-494", "CWE-502"] },
    { id: "A09:2021", title: "Security Logging and Monitoring Failures", cwe: ["CWE-117", "CWE-778"] },
    { id: "A10:2021", title: "Server-Side Request Forgery", cwe: ["CWE-918"] },
];

const ASVS_LEVELS = [
    { id: "V1", name: "Architecture", level: "L1, L2, L3" },
    { id: "V2", name: "Authentication", level: "L1, L2, L3" },
    { id: "V3", name: "Session Management", level: "L1, L2, L3" },
    { id: "V4", name: "Access Control", level: "L1, L2, L3" },
    { id: "V5", name: "Validation", level: "L1, L2, L3" },
];

const RISK_MATRIX = [
    ["Low", "Low", "Medium", "High", "Critical"],
    ["Low", "Medium", "Medium", "High", "Critical"],
    ["Low", "Medium", "High", "High", "Critical"],
    ["Medium", "High", "High", "Critical", "Critical"],
    ["Medium", "High", "Critical", "Critical", "Critical"],
];

const IMPACT_LEVELS = ["Insignificant", "Minor", "Moderate", "Major", "Catastrophic"];
const LIKELIHOOD_LEVELS = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];

export default function ComplianceEnginePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [impact, setImpact] = useState(2); // Moderate
    const [likelihood, setLikelihood] = useState(2); // Possible

    const riskScore = RISK_MATRIX[impact][likelihood];
    const riskColor = riskScore === "Critical" ? "bg-red-500" :
        riskScore === "High" ? "bg-orange-500" :
            riskScore === "Medium" ? "bg-yellow-500" : "bg-blue-500";

    return (
        <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center space-x-4 mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-cyan-400">
                    Compliance Mapping Engine
                </h1>
            </div>

            <Tabs defaultValue="owasp" className="flex-1 flex flex-col min-h-0">
                <TabsList className="bg-zinc-900/50 border border-zinc-800 w-full justify-start space-x-2 p-1">
                    <TabsTrigger value="owasp" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                        <ShieldCheck className="w-4 h-4 mr-2" /> OWASP Top 10
                    </TabsTrigger>
                    <TabsTrigger value="asvs" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                        <BookOpen className="w-4 h-4 mr-2" /> ASVS
                    </TabsTrigger>
                    <TabsTrigger value="cwe" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                        <AlertTriangle className="w-4 h-4 mr-2" /> CWE Mapping
                    </TabsTrigger>
                    <TabsTrigger value="risk" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                        <Calculator className="w-4 h-4 mr-2" /> Risk Matrix
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 mt-4 overflow-hidden">
                    {/* OWASP TAB */}
                    <TabsContent value="owasp" className="h-full flex flex-col space-y-4 m-0 overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {OWASP_TOP_10.map((item) => (
                                <Card key={item.id} className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-sm font-bold text-zinc-200">{item.id}</CardTitle>
                                            <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10 text-[10px]">
                                                {item.cwe.length} Linked CWEs
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-zinc-400 font-medium">{item.title}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {item.cwe.map(c => (
                                                <span key={c} className="bg-zinc-800 px-2 py-1 rounded text-zinc-500">{c}</span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* ASVS TAB */}
                    <TabsContent value="asvs" className="h-full space-y-4 m-0 overflow-y-auto no-scrollbar">
                        <Card className="border-zinc-800 bg-zinc-900/50">
                            <CardHeader>
                                <CardTitle>Application Security Verification Standard (ASVS) 4.0</CardTitle>
                                <CardDescription>Summary of verification categories.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-zinc-800 hover:bg-transparent">
                                            <TableHead className="text-zinc-400">ID</TableHead>
                                            <TableHead className="text-zinc-400">Category Name</TableHead>
                                            <TableHead className="text-zinc-400">Applicable Levels</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ASVS_LEVELS.map((item) => (
                                            <TableRow key={item.id} className="border-zinc-800 hover:bg-white/5">
                                                <TableCell className="font-mono text-zinc-500">{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell className="text-zinc-500">{item.level}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="border-zinc-800 hover:bg-transparent">
                                            <TableCell colSpan={3} className="text-center text-zinc-600 italic py-8">
                                                ... more categories (V6-V14) supported in full version
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CWE TAB */}
                    <TabsContent value="cwe" className="h-full flex flex-col space-y-4 m-0">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Search CWE (e.g. Injection, XSS)..."
                                className="bg-zinc-950 border-zinc-800"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="secondary"><Search className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex-1 border rounded-md border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-500">
                            {searchTerm ?
                                <span>Searching for "{searchTerm}" in Common Weakness Enumeration database...</span>
                                : <span>Enter a search term to find mapped weaknesses.</span>
                            }
                        </div>
                    </TabsContent>

                    {/* RISK MATRIX TAB */}
                    <TabsContent value="risk" className="h-full flex flex-col space-y-6 m-0 overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Controls */}
                            <Card className="border-zinc-800 bg-zinc-900/50">
                                <CardHeader>
                                    <CardTitle>Risk Calculator</CardTitle>
                                    <CardDescription>Determine risk based on Impact and Likelihood</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-zinc-300">Likelihood: <span className="text-zinc-500">{LIKELIHOOD_LEVELS[likelihood]}</span></label>
                                        <input
                                            type="range" min="0" max="4" step="1"
                                            value={likelihood} onChange={(e) => setLikelihood(parseInt(e.target.value))}
                                            className="w-full accent-blue-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-zinc-600 uppercase">
                                            <span>Rare</span>
                                            <span>Certain</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-zinc-300">Impact: <span className="text-zinc-500">{IMPACT_LEVELS[impact]}</span></label>
                                        <input
                                            type="range" min="0" max="4" step="1"
                                            value={impact} onChange={(e) => setImpact(parseInt(e.target.value))}
                                            className="w-full accent-blue-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-zinc-600 uppercase">
                                            <span>Insignificant</span>
                                            <span>Catastrophic</span>
                                        </div>
                                    </div>

                                    <div className={`p-6 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-colors ${riskColor}`}>
                                        {riskScore} Risk
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Matrix Visual */}
                            <div className="relative aspect-square max-h-[400px]">
                                <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                                    {/* Render Grid Cells */}
                                    {Array.from({ length: 5 }).map((_, rIndex) => (
                                        Array.from({ length: 5 }).map((_, cIndex) => {
                                            // Matrix is usually mapped: Rows = Likelihood, Cols = Impact OR vice versa.
                                            // Let's assume Rows (y) = Likelihood (bottom to top?), Cols (x) = Impact (left to right)
                                            // But array is top-down. Let's map strict to our RISK_MATRIX array [impact][likelihood].
                                            // Wait, standard matrix: X = Impact, Y = Likelihood.
                                            // Our RISK_MATRIX[impact][likelihood]

                                            const score = RISK_MATRIX[rIndex][cIndex]; // rIndex = Impact (0-4), cIndex = Likelihood (0-4)
                                            // Actually let's flip visual to standard: Y axis = Likelihood, X axis = Impact.
                                            // Let's assume row 0 is HIGH likelihood ? No usually bottom is low.

                                            // Let's just stick to a simple visual mapping of the array for now.
                                            // We will iterate rows as Impact, Cols as Likelihood

                                            const isActive = impact === rIndex && likelihood === cIndex;

                                            let cellColor = "bg-blue-900/20 text-blue-800";
                                            if (score === "Medium") cellColor = "bg-yellow-900/20 text-yellow-800";
                                            if (score === "High") cellColor = "bg-orange-900/20 text-orange-800";
                                            if (score === "Critical") cellColor = "bg-red-900/20 text-red-800";

                                            return (
                                                <div
                                                    key={`${rIndex}-${cIndex}`}
                                                    className={`
                                                        flex items-center justify-center text-[10px] font-bold rounded
                                                        ${cellColor}
                                                        ${isActive ? 'ring-2 ring-white scale-110 z-10 shadow-xl opacity-100' : 'opacity-60'}
                                                    `}
                                                >
                                                    {score.substring(0, 1)}
                                                </div>
                                            )
                                        })
                                    ))}
                                </div>
                                {/* Labels */}
                                <div className="absolute bottom-[-25px] left-0 right-0 text-center text-xs text-zinc-500">Likelihood →</div>
                                <div className="absolute left-[-25px] top-0 bottom-0 flex items-center justify-center -rotate-90 text-xs text-zinc-500">← Impact</div>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
