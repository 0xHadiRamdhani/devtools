"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Globe, Search, Clock, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { checkUrl } from "@/app/actions/check-url";

export default function HttpStatusChecker() {
    const [url, setUrl] = useState("");
    const [method, setMethod] = useState("GET");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCheck = async () => {
        if (!url) return;

        // Auto-prepend https:// if missing
        let target = url;
        if (!target.startsWith("http://") && !target.startsWith("https://")) {
            target = "https://" + target;
            setUrl(target);
        }

        setLoading(true);
        setResult(null);

        try {
            const data = await checkUrl(target, method);
            setResult(data);
            if (data.error) {
                toast.error("Failed to reach URL");
            } else {
                toast.success(`Received status ${data.status}`);
            }
        } catch (e) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return "text-green-400 border-green-500/20 bg-green-500/10";
        if (status >= 300 && status < 400) return "text-blue-400 border-blue-500/20 bg-blue-500/10";
        if (status >= 400 && status < 500) return "text-orange-400 border-orange-500/20 bg-orange-500/10";
        if (status >= 500) return "text-red-400 border-red-500/20 bg-red-500/10";
        return "text-zinc-400 border-zinc-500/20 bg-zinc-500/10";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">HTTP Status Checker</h1>
                <p className="text-zinc-400">
                    Check the response code, headers, and performance of a URL.
                </p>
            </div>

            <Card className="border-zinc-800 bg-zinc-900/30">
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <select
                            className="h-10 rounded-md border border-input bg-zinc-950 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ring"
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                        >
                            <option>GET</option>
                            <option>HEAD</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>DELETE</option>
                        </select>
                        <div className="flex-1 flex gap-2">
                            <Input
                                placeholder="example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="bg-zinc-950/50"
                                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                            />
                            <Button onClick={handleCheck} disabled={loading || !url} className="min-w-[100px]">
                                {loading ? "Checking..." : "Check"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <div className="animate-accordion-down space-y-6">
                    {result.error ? (
                        <Card className="border-red-500/20 bg-red-500/5">
                            <CardContent className="p-6 flex items-center gap-3 text-red-400">
                                <AlertCircle className="h-5 w-5" />
                                <span className="font-medium">{result.error}</span>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="grid gap-6 md:grid-cols-3">
                                <Card className={`border bg-opacity-10 backdrop-blur justify-center flex flex-col items-center p-6 ${getStatusColor(result.status)}`}>
                                    <div className="text-4xl font-bold mb-1">{result.status}</div>
                                    <div className="text-sm opacity-80 uppercase tracking-wider">{result.statusText || "OK"}</div>
                                </Card>
                                <Card className="border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center p-6">
                                    <Clock className="h-6 w-6 text-zinc-400 mb-2" />
                                    <div className="text-2xl font-bold text-white">{result.duration}ms</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Time</div>
                                </Card>
                                <Card className="border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center p-6">
                                    <Activity className="h-6 w-6 text-zinc-400 mb-2" />
                                    <div className="text-2xl font-bold text-white">{Object.keys(result.headers).length}</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Headers</div>
                                </Card>
                            </div>

                            <Card className="border-zinc-800 bg-zinc-900/30">
                                <CardHeader className="pb-3 border-b border-zinc-800">
                                    <CardTitle className="text-sm font-medium text-zinc-200">Response Headers</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-zinc-800">
                                        {Object.entries(result.headers).map(([key, value]) => (
                                            <div key={key} className="grid grid-cols-12 p-3 text-sm hover:bg-white/5">
                                                <div className="col-span-4 font-mono text-zinc-400 break-all">{key}</div>
                                                <div className="col-span-8 font-mono text-zinc-200 break-all">{(value as string)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
