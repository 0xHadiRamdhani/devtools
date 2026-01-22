"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, Trash2, ArrowLeftRight, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Algo = "base64" | "base64url" | "hex";

export default function Base64Converter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [algo, setAlgo] = useState<Algo>("base64");

    const toBase64Url = (str: string) => {
        return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    };

    const fromBase64Url = (str: string) => {
        str = str.replace(/-/g, "+").replace(/_/g, "/");
        while (str.length % 4) str += "=";
        return atob(str);
    };

    const toHex = (str: string) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return result;
    };

    const fromHex = (hex: string) => {
        hex = hex.replace(/\s/g, '');
        if (!/^[0-9A-Fa-f]*$/.test(hex)) throw new Error("Invalid Hex");
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    };

    const handleConvert = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                return;
            }

            let result = "";
            if (mode === "encode") {
                if (algo === "base64") result = btoa(input);
                else if (algo === "base64url") result = toBase64Url(input);
                else if (algo === "hex") result = toHex(input);
            } else {
                if (algo === "base64") result = atob(input);
                else if (algo === "base64url") result = fromBase64Url(input);
                else if (algo === "hex") result = fromHex(input);
            }
            setOutput(result);
            toast.success("Converted successfully");
        } catch (err) {
            toast.error("Invalid input for " + algo);
        }
    };

    // Auto-convert on input/mode/algo change (debounced could be better but let's do direct for now or manual)
    // User requested "Clipboard auto-detect" for Base64, but that's in Smart Clipboard.
    // Let's make it manual for now to avoid errors while typing, or useEffect with debounce.
    // Existing code was manual "Convert" button. I'll stick to that but also allow Cmd+Enter?
    // Let's stick to manual to be safe for now, or maybe minimal auto-convert if valid.

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Encoding Lab</h1>
                <p className="text-zinc-400">
                    Encode and decode Base64, Base64URL, and Hex strings.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
                {/* Mode Switcher */}
                <div className="bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 inline-flex self-center">
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

                {/* Algo Switcher */}
                <div className="bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 inline-flex self-center overflow-x-auto max-w-full">
                    <Button
                        variant={algo === "base64" ? "secondary" : "ghost"}
                        onClick={() => setAlgo("base64")}
                        className="px-4"
                    >
                        Base64
                    </Button>
                    <Button
                        variant={algo === "base64url" ? "secondary" : "ghost"}
                        onClick={() => setAlgo("base64url")}
                        className="px-4"
                    >
                        Base64URL
                    </Button>
                    <Button
                        variant={algo === "hex" ? "secondary" : "ghost"}
                        onClick={() => setAlgo("hex")}
                        className="px-4"
                    >
                        Hex
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:h-[calc(100vh-320px)]">
                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-zinc-200">
                            {mode === "encode" ? "Text Input" : `${algo.toUpperCase()} Input`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[200px] flex flex-col gap-2">
                        <Textarea
                            className="flex-1 font-mono text-sm resize-none bg-zinc-950/50"
                            placeholder={mode === "encode" ? "Text to encode..." : `Paste ${algo} here...`}
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
                            {mode === "encode" ? `${algo.toUpperCase()} Output` : "Text Output"}
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
                    <CardContent className="flex-1 min-h-[200px]">
                        <Textarea
                            className="flex-1 h-full font-mono text-sm resize-none bg-zinc-950/50 text-green-400"
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
