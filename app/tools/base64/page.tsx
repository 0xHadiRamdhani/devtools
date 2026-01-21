"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, Trash2, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Base64Converter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    const handleConvert = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                return;
            }

            if (mode === "encode") {
                setOutput(btoa(input));
                toast.success("Encoded successfully");
            } else {
                setOutput(atob(input));
                toast.success("Decoded successfully");
            }
        } catch (err) {
            toast.error("Invalid input for " + mode);
        }
    };

    const toggleMode = () => {
        setMode(mode === "encode" ? "decode" : "encode");
        setInput(output);
        setOutput("");
        // Logic choice: when swapping, maybe we want to swap input/output? 
        // For now, let's just clear output or swap them if user wants seamless.
        // Let's just switch mode and let user decide, but standard UX is often separate tabs.
        // I'll keep it simple: just switch mode.
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Base64 Converter</h1>
                <p className="text-zinc-400">
                    Encode and decode Base64 strings easily.
                </p>
            </div>

            <div className="flex justify-center mb-4">
                <div className="bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 inline-flex">
                    <Button
                        variant={mode === "encode" ? "secondary" : "ghost"}
                        onClick={() => setMode("encode")}
                        className="w-32"
                    >
                        Encode
                    </Button>
                    <Button
                        variant={mode === "decode" ? "secondary" : "ghost"}
                        onClick={() => setMode("decode")}
                        className="w-32"
                    >
                        Decode
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:h-[calc(100vh-300px)]">
                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-zinc-200">
                            {mode === "encode" ? "Text Input" : "Base64 Input"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 flex flex-col gap-2">
                        <Textarea
                            className="flex-1 font-mono text-sm resize-none bg-zinc-950/50"
                            placeholder={mode === "encode" ? "Text to encode..." : "Base64 to decode..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end mt-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => { setInput(""); setOutput(""); }}
                                disabled={!input}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center lg:hidden">
                    <Button size="icon" variant="ghost" className="rotate-90">
                        <ArrowLeftRight className="h-6 w-6" />
                    </Button>
                </div>

                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/30">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-zinc-200">
                            {mode === "encode" ? "Base64 Output" : "Text Output"}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleConvert}
                                disabled={!input}
                            >
                                <RefreshCw className="mr-2 h-3 w-3" />
                                Convert
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
                            className="flex-1 h-full min-h-[200px] font-mono text-sm resize-none bg-zinc-950/50 text-green-400"
                            readOnly
                            value={output}
                            placeholder="Result..."
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
