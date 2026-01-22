"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { Copy, Trash2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function JwtDecoder() {
    const [token, setToken] = useState("");
    const [header, setHeader] = useState("");
    const [payload, setPayload] = useState("");
    const [expirationStatus, setExpirationStatus] = useState<"valid" | "expired" | null>(null);
    const [expirationTime, setExpirationTime] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token.trim()) {
            setHeader("");
            setPayload("");
            setExpirationStatus(null);
            setExpirationTime(null);
            setError(null);
            return;
        }

        try {
            const decodedHeader = jwtDecode(token, { header: true });
            const decodedPayload: any = jwtDecode(token);

            setHeader(JSON.stringify(decodedHeader, null, 2));
            setPayload(JSON.stringify(decodedPayload, null, 2));
            setError(null);

            // Check expiration
            if (decodedPayload.exp) {
                const exp = decodedPayload.exp * 1000;
                const isExpired = Date.now() > exp;
                setExpirationStatus(isExpired ? "expired" : "valid");
                setExpirationTime(new Date(exp).toLocaleString());
            } else {
                setExpirationStatus(null);
                setExpirationTime(null);
            }
        } catch (err) {
            // Only show error if token has substantial length to avoid flashing on paste
            if (token.length > 10) {
                setError("Invalid JWT Token");
            }
            setHeader("");
            setPayload("");
            setExpirationStatus(null);
            setExpirationTime(null);
        }
    }, [token]);

    const handleClear = () => {
        setToken("");
        setHeader("");
        setPayload("");
        setError(null);
        setExpirationStatus(null);
        setExpirationTime(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">JWT Decoder</h1>
                <p className="text-zinc-400">
                    Decode JSON Web Tokens to view their header and payload.
                </p>
                {token && !error && (
                    <Alert className="mt-2 border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warning: Client-side decoding</AlertTitle>
                        <AlertDescription>
                            The signature is NOT verified. Do not trust the content of this token for security decisions without backend verification.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:h-[calc(100vh-320px)]">
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
                    <Card className="flex-2 border-zinc-800 bg-zinc-900/30 overflow-hidden flex flex-col">
                        <CardHeader className="pb-2 py-3 bg-zinc-900/50 border-b border-zinc-800 flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-mono uppercase tracking-wider text-violet-400">Payload</CardTitle>
                            {expirationStatus && (
                                <Badge variant="outline" className={`gap-1 ${expirationStatus === "valid" ? "text-green-500 border-green-500/20 bg-green-500/10" : "text-red-500 border-red-500/20 bg-red-500/10"}`}>
                                    {expirationStatus === "valid" ? (
                                        <CheckCircle className="h-3 w-3" />
                                    ) : (
                                        <XCircle className="h-3 w-3" />
                                    )}
                                    {expirationStatus === "valid" ? "Valid" : "Expired"} ({expirationTime})
                                </Badge>
                            )}
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
