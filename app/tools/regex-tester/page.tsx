"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CaseSensitive, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegexTester() {
    const [regex, setRegex] = useState("");
    const [flags, setFlags] = useState("gm");
    const [testString, setTestString] = useState("");

    const matches = useMemo(() => {
        if (!regex || !testString) return [];
        try {
            const re = new RegExp(regex, flags);
            const results = [];
            let match;

            // Prevent infinite loops with empty matches
            if (regex === "") return [];

            // Global match loop
            if (flags.includes('g')) {
                let count = 0;
                while ((match = re.exec(testString)) !== null) {
                    if (count++ > 1000) break; // Safety break
                    results.push({
                        index: match.index,
                        value: match[0],
                        groups: match.slice(1)
                    });
                    if (match.index === re.lastIndex) {
                        re.lastIndex++;
                    }
                }
            } else {
                match = re.exec(testString);
                if (match) {
                    results.push({
                        index: match.index,
                        value: match[0],
                        groups: match.slice(1)
                    });
                }
            }
            return results;
        } catch (e) {
            return [];
        }
    }, [regex, flags, testString]);

    const isValidRegex = useMemo(() => {
        try {
            new RegExp(regex, flags);
            return true;
        } catch {
            return false;
        }
    }, [regex, flags]);

    const toggleFlag = (flag: string) => {
        setFlags(prev =>
            prev.includes(flag)
                ? prev.replace(flag, '')
                : prev + flag
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Regex Tester</h1>
                <p className="text-zinc-400">
                    Test regular expressions against strings in real-time.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:h-[calc(100vh-250px)]">
                <div className="flex flex-col gap-6">
                    <Card className="border-zinc-800 bg-zinc-900/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-zinc-200">Regular Expression</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-2.5 text-zinc-500 font-mono text-lg">/</span>
                                    <Input
                                        className={`pl-6 pr-6 font-mono text-sm bg-zinc-950/50 ${!isValidRegex && regex ? "border-red-500 text-red-500" : ""
                                            }`}
                                        value={regex}
                                        onChange={(e) => setRegex(e.target.value)}
                                        placeholder="pattern"
                                    />
                                    <span className="absolute right-3 top-2.5 text-zinc-500 font-mono text-lg">/</span>
                                </div>
                                <Input
                                    className="w-20 font-mono text-sm bg-zinc-900/50 text-zinc-400 text-center"
                                    value={flags}
                                    onChange={(e) => setFlags(e.target.value)}
                                    placeholder="flags"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {['g', 'i', 'm', 's', 'u', 'y'].map(flag => (
                                    <Button
                                        key={flag}
                                        variant={flags.includes(flag) ? "secondary" : "outline"}
                                        size="sm"
                                        onClick={() => toggleFlag(flag)}
                                        className={flags.includes(flag) ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : ""}
                                    >
                                        {flag}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1 flex flex-col border-zinc-800 bg-zinc-900/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-zinc-200">Test String</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0">
                            <Textarea
                                className="h-full min-h-[200px] font-mono text-sm resize-none bg-zinc-950/50"
                                value={testString}
                                onChange={(e) => setTestString(e.target.value)}
                                placeholder="Insert test string here..."
                            />
                        </CardContent>
                    </Card>
                </div>

                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/30">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-zinc-200">Matches ({matches.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 overflow-y-auto">
                        {matches.length > 0 ? (
                            <div className="space-y-4">
                                {matches.map((m, i) => (
                                    <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-sm font-mono">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-zinc-500 text-xs">Match {i + 1}</span>
                                            <span className="text-zinc-500 text-xs">Index: {m.index}</span>
                                        </div>
                                        <div className="text-green-400 break-all bg-green-500/10 p-2 rounded mb-2">
                                            {m.value}
                                        </div>
                                        {m.groups.length > 0 && (
                                            <div className="pl-4 border-l-2 border-zinc-800 space-y-1">
                                                {m.groups.map((g, gi) => (
                                                    <div key={gi} className="flex gap-2 text-xs">
                                                        <span className="text-zinc-500">Group {gi + 1}:</span>
                                                        <span className="text-blue-300 break-all">{g}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
                                {regex ? "No matches found" : "Enter a regex pattern to see matches"}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
