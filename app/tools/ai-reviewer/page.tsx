"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Check, AlertTriangle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface Finding {
    line?: number;
    severity: 'high' | 'medium' | 'low';
    message: string;
    suggestion: string;
}

export default function AIReviewerPage() {
    const [code, setCode] = useState("");
    const [findings, setFindings] = useState<Finding[] | null>(null);
    const [loading, setLoading] = useState(false);

    const reviewCode = () => {
        setLoading(true);

        // Mock AI analysis logic
        setTimeout(() => {
            const newFindings: Finding[] = [];
            const lines = code.split('\n');

            lines.forEach((line, i) => {
                const lower = line.toLowerCase();

                // Mock heuristic rules
                if (lower.includes('password') && (lower.includes('=') || lower.includes(':')) && (lower.includes('"') || lower.includes("'"))) {
                    newFindings.push({
                        line: i + 1,
                        severity: 'high',
                        message: 'Potential hardcoded password detected.',
                        suggestion: 'Use environment variables or a secrets manager.'
                    });
                }
                if (lower.includes('eval(')) {
                    newFindings.push({
                        line: i + 1,
                        severity: 'high',
                        message: 'Usage of eval() detected. This is a critical security risk.',
                        suggestion: 'Refactor to avoid dynamic code execution.'
                    });
                }
                if (lower.includes('todo')) {
                    newFindings.push({
                        line: i + 1,
                        severity: 'low',
                        message: 'TODO comment found.',
                        suggestion: 'Ensure this technical debt is tracked.'
                    });
                }
            });

            if (code.length > 0 && newFindings.length === 0) {
                // If code exists but no strict findings, add a "Clean" message just so something shows
            }

            setFindings(newFindings);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center space-x-4 mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-300">
                    AI Security Reviewer
                </h1>
                <Badge variant="outline" className="text-purple-400 border-purple-400/30">Beta</Badge>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                <div className="flex flex-col space-y-2">
                    <Card className="flex-1 border-zinc-800 bg-zinc-900/50 flex flex-col">
                        <CardHeader className="py-3 px-4 border-b border-zinc-800">
                            <CardTitle className="text-sm font-normal text-zinc-400">Source Code Input</CardTitle>
                        </CardHeader>
                        <textarea
                            className="flex-1 w-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none text-zinc-300 placeholder:text-zinc-600"
                            placeholder="// Paste your code here for security analysis..."
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <div className="p-4 border-t border-zinc-800">
                            <Button className="w-full bg-purple-600 hover:bg-purple-500" onClick={reviewCode} disabled={loading || !code}>
                                {loading ? <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Bot className="w-4 h-4 mr-2" /> Review Code</>}
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col space-y-4 overflow-y-auto">
                    {findings === null ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 space-y-4">
                            <Bot className="w-16 h-16 opacity-20" />
                            <p>AI is waiting for input...</p>
                        </div>
                    ) : findings.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-green-500 space-y-4">
                            <Check className="w-16 h-16 opacity-50" />
                            <p className="font-medium">No critical issues found!</p>
                            <p className="text-sm text-zinc-500">Note: This is a simulated automated check.</p>
                        </div>
                    ) : (
                        findings.map((finding, idx) => (
                            <Alert key={idx} className={`
                                ${finding.severity === 'high' ? 'bg-red-900/10 border-red-900/50 text-red-200' : ''}
                                ${finding.severity === 'medium' ? 'bg-orange-900/10 border-orange-900/50 text-orange-200' : ''}
                                ${finding.severity === 'low' ? 'bg-blue-900/10 border-blue-900/50 text-blue-200' : ''}
                            `}>
                                {finding.severity === 'high' && <XCircle className="h-4 w-4 stroke-red-400" />}
                                {finding.severity === 'medium' && <AlertTriangle className="h-4 w-4 stroke-orange-400" />}
                                {finding.severity === 'low' && <Sparkles className="h-4 w-4 stroke-blue-400" />}

                                <AlertTitle className="ml-2 font-bold mb-1 flex justify-between">
                                    <span>{finding.message}</span>
                                    {finding.line && <span className="text-xs opacity-70 font-mono">Ln {finding.line}</span>}
                                </AlertTitle>
                                <AlertDescription className="ml-8 text-xs opacity-90">
                                    {finding.suggestion}
                                </AlertDescription>
                            </Alert>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
