"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, FileJson, Trash2, Minimize, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function JsonFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleFormat = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                return;
            }
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
            setError(null);
            toast.success("JSON formatted successfully");
        } catch (err) {
            setError("Invalid JSON");
            toast.error("Invalid JSON content");
        }
    };

    const handleMinify = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                return;
            }
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError(null);
            toast.success("JSON minified successfully");
        } catch (err) {
            setError("Invalid JSON");
            toast.error("Invalid JSON content");
        }
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success("Copied to clipboard");
    };

    const handleClear = () => {
        setInput("");
        setOutput("");
        setError(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">JSON Formatter</h1>
                <p className="text-zinc-400">
                    Format, validate, and minify your JSON data.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:h-[calc(100vh-250px)]">
                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-zinc-200">Input</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 flex flex-col gap-2">
                        <Textarea
                            className={`flex-1 font-mono text-sm resize-none bg-zinc-950/50 ${error ? "border-red-500 focus-visible:ring-red-500" : ""
                                }`}
                            placeholder="Paste your JSON here..."
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setError(null);
                            }}
                        />
                        <div className="flex gap-2 justify-end mt-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleClear}
                                disabled={!input}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/30">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-zinc-200">Output</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleMinify}
                                disabled={!input}
                                title="Minify"
                            >
                                <Minimize className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleFormat}
                                disabled={!input}
                                title="Format"
                            >
                                <Maximize className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                disabled={!output}
                                title="Copy Output"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            className="flex-1 h-full min-h-[300px] font-mono text-sm resize-none bg-zinc-950/50 text-green-400"
                            readOnly
                            value={output}
                            placeholder="Formatted JSON will appear here..."
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
