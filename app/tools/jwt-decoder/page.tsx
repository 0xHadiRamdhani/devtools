"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function JwtDecoder() {
    const [token, setToken] = useState("");
    const [header, setHeader] = useState("");
    const [payload, setPayload] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token.trim()) {
            setHeader("");
            setPayload("");
            setError(null);
            return;
        }

        try {
            const decodedHeader = jwtDecode(token, { header: true });
            const decodedPayload = jwtDecode(token);

            setHeader(JSON.stringify(decodedHeader, null, 2));
            setPayload(JSON.stringify(decodedPayload, null, 2));
            setError(null);
        } catch (err) {
            // Only show error if token has substantial length to avoid flashing on paste
            if (token.length > 10) {
                setError("Invalid JWT Token");
            }
            setHeader("");
            setPayload("");
        }
    }, [token]);

    const handleClear = () => {
        setToken("");
        setHeader("");
        setPayload("");
        setError(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">JWT Decoder</h1>
                <p className="text-zinc-400">
                    Decode JSON Web Tokens to view their header and payload.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:h-[calc(100vh-250px)]">
                {/* Input Column */}
                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/30 lg:col-span-1">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-zinc-200">Encoded Token</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            disabled={!token}
                            className="h-8 w-8 p-0"
                        >
                            <Trash2 className="h-4 w-4 text-zinc-400 hover:text-red-400" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[200px]">
                        <Textarea
                            className={`h-full font-mono text-xs resize-none bg-zinc-950/50 break-all p-4 leading-relaxed ${error ? "border-red-500/50 focus-visible:ring-red-500/50" : "border-zinc-800"
                                }`}
                            placeholder="Paste JWT here (eyJ...)"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Output Columns */}
                <div className="flex flex-col gap-6 lg:col-span-2 h-full">
                    {/* Header */}
                    <Card className="flex-1 border-zinc-800 bg-zinc-900/30 overflow-hidden flex flex-col">
                        <CardHeader className="pb-2 py-3 bg-zinc-900/50 border-b border-zinc-800">
                            <CardTitle className="text-xs font-mono uppercase tracking-wider text-rose-400">Header</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative group">
                            <Textarea
                                readOnly
                                className="h-full w-full bg-transparent border-0 resize-none font-mono text-sm text-rose-300 p-4 focus-visible:ring-0"
                                value={header}
                                placeholder="{}"
                            />
                        </CardContent>
                    </Card>

                    {/* Payload */}
                    <Card className="flex-[2] border-zinc-800 bg-zinc-900/30 overflow-hidden flex flex-col">
                        <CardHeader className="pb-2 py-3 bg-zinc-900/50 border-b border-zinc-800">
                            <CardTitle className="text-xs font-mono uppercase tracking-wider text-violet-400">Payload</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative group">
                            <Textarea
                                readOnly
                                className="h-full w-full bg-transparent border-0 resize-none font-mono text-sm text-violet-300 p-4 focus-visible:ring-0"
                                value={payload}
                                placeholder="{}"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
