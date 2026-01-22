"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Clipboard, ArrowRight, History, Trash2, FileJson, Lock, Link as LinkIcon, FileCode, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type ClipType = "JSON" | "JWT" | "URL" | "Base64" | "Text" | "Hex";

interface ClipboardItem {
    id: string;
    content: string;
    type: ClipType;
    timestamp: number;
}

export default function SmartClipboard() {
    const [currentClip, setCurrentClip] = useState<string>("");
    const [detectedType, setDetectedType] = useState<ClipType>("Text");
    const [history, setHistory] = useState<ClipboardItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("clipboard-history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load history", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("clipboard-history", JSON.stringify(history));
    }, [history]);

    const detectType = (content: string): ClipType => {
        if (!content.trim()) return "Text";

        // JSON Check
        try {
            JSON.parse(content);
            if (content.trim().startsWith("{") || content.trim().startsWith("[")) return "JSON";
        } catch { }

        // JWT Check
        if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(content)) {
            return "JWT";
        }

        // URL Check
        try {
            new URL(content);
            return "URL";
        } catch { }

        // Hex Check (len > 4, only hex chars)
        if (content.length > 4 && /^[0-9A-Fa-f]+$/.test(content)) {
            return "Hex";
        }

        // Base64 Check (heuristic: no spaces, length multiple of 4 or ends with =)
        // This is a weak check, many things look like base64. Let's start with strict regex or just "Text" fallback.
        if (content.length > 10 && /^[A-Za-z0-9+/]+={0,2}$/.test(content)) {
            try {
                if (btoa(atob(content)) === content) return "Base64";
            } catch { }
        }

        return "Text";
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (!text) {
                toast.error("Clipboard is empty");
                return;
            }
            processContent(text);
            toast.success("Read from clipboard");
        } catch (err) {
            toast.error("Failed to read clipboard. Please allow permission.");
        }
    };

    const processContent = (text: string) => {
        const type = detectType(text);
        setCurrentClip(text);
        setDetectedType(type);

        const newItem: ClipboardItem = {
            id: crypto.randomUUID(),
            content: text,
            type,
            timestamp: Date.now(),
        };

        setHistory(prev => {
            const filtered = prev.filter(p => p.content !== text);
            return [newItem, ...filtered].slice(0, 10);
        });
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("clipboard-history");
        toast.success("History cleared");
    };

    const getTypeColor = (type: ClipType) => {
        switch (type) {
            case "JSON": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "JWT": return "bg-violet-500/10 text-violet-500 border-violet-500/20";
            case "URL": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Base64": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
            case "Hex": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
        }
    };

    const getTypeIcon = (type: ClipType) => {
        switch (type) {
            case "JSON": return <FileJson className="w-4 h-4" />;
            case "JWT": return <Lock className="w-4 h-4" />;
            case "URL": return <LinkIcon className="w-4 h-4" />;
            case "Base64": return <FileCode className="w-4 h-4" />;
            default: return <Type className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Smart Clipboard</h1>
                <p className="text-zinc-400">
                    Auto-detect and route your clipboard content to the right tool.
                </p>
            </div>

            <Card className="border-dashed border-2 border-zinc-700 bg-zinc-900/10">
                <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="bg-zinc-800 p-4 rounded-full">
                        <Clipboard className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-lg font-medium text-white">Paste from Clipboard</h3>
                        <p className="text-sm text-zinc-400">Click the button below to analyze your clipboard content</p>
                    </div>
                    <Button onClick={handlePaste} size="lg" className="mt-2">
                        Read Clipboard
                    </Button>
                </CardContent>
            </Card>

            {currentClip && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-zinc-800 bg-zinc-900/30">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-zinc-200">Content</CardTitle>
                            <Badge variant="outline" className={`${getTypeColor(detectedType)} gap-1`}>
                                {getTypeIcon(detectedType)}
                                {detectedType}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                readOnly
                                value={currentClip}
                                className="min-h-[200px] bg-zinc-950/50 font-mono text-sm resize-none"
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-800 bg-zinc-900/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-zinc-200">Recommended Tools</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {detectedType === "JSON" && (
                                <Link href="/tools/json-formatter" className="block">
                                    <Button variant="outline" className="w-full justify-between h-12">
                                        <span className="flex items-center gap-2">
                                            <FileJson className="w-4 h-4 text-orange-500" />
                                            Open in JSON Formatter
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-zinc-500" />
                                    </Button>
                                </Link>
                            )}
                            {detectedType === "JWT" && (
                                <Link href="/tools/jwt-decoder" className="block">
                                    <Button variant="outline" className="w-full justify-between h-12">
                                        <span className="flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-violet-500" />
                                            Open in JWT Decoder
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-zinc-500" />
                                    </Button>
                                </Link>
                            )}
                            {(detectedType === "Base64" || detectedType === "Text") && (
                                <Link href="/tools/base64" className="block">
                                    <Button variant="outline" className="w-full justify-between h-12">
                                        <span className="flex items-center gap-2">
                                            <FileCode className="w-4 h-4 text-pink-500" />
                                            Open in Base64 Converter
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-zinc-500" />
                                    </Button>
                                </Link>
                            )}
                            <Link href="/tools/regex-tester" className="block">
                                <Button variant="outline" className="w-full justify-between h-12">
                                    <span className="flex items-center gap-2">
                                        <Type className="w-4 h-4 text-blue-500" />
                                        Test with Regex
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-zinc-500" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            )}

            {history.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-zinc-400" />
                            Recent Clips
                        </h2>
                        <Button variant="ghost" size="sm" onClick={clearHistory}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear History
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {history.map((item) => (
                            <Card
                                key={item.id}
                                className="border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                                onClick={() => { setCurrentClip(item.content); setDetectedType(item.type); }}
                            >
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className={`${getTypeColor(item.type)} text-[10px]`}>
                                            {item.type}
                                        </Badge>
                                        <span className="text-xs text-zinc-500">
                                            {new Date(item.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-mono text-zinc-300 line-clamp-3 break-all">
                                        {item.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
