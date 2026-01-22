"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    FileDiff,
    History,
    Play,
    ShieldAlert,
    Trash2
} from "lucide-react";

// --- Types & Simulations ---

interface ApiSnapshot {
    id: string;
    timestamp: Date;
    endpoint: string;
    status: number;
    data: any;
    hash: string;
}

interface DriftEvent {
    id: string;
    snapshotId: string;
    type: "field_missing" | "type_mismatch" | "permission_leak" | "new_field" | "status_change";
    severity: "critical" | "high" | "medium" | "low";
    message: string;
    details: string;
}

// Mock Data Generators
const generateMockResponse = (version: number) => {
    // Base Response
    const base = {
        id: 101,
        username: "user_active",
        role: "user",
        profile: {
            displayName: "Test User",
            avatar: "htts://...",
            preferences: { theme: "dark", notif: true }
        },
        metadata: {
            createdAt: "2023-01-01",
            lastLogin: "2023-10-10"
        }
    };

    // Version 2: Field Missing & Type Change
    if (version === 2) {
        return {
            ...base,
            profile: {
                displayName: "Test User",
                // avatar missing!
                preferences: { theme: "dark", notif: "true" } // notif type string instead of bool
            }
        };
    }

    // Version 3: Permission Leak!!
    if (version === 3) {
        return {
            ...base,
            role: "admin", // Scary change if unintended
            admin_debug_info: {
                // LEAK!
                db_host: "10.0.0.5",
                secret_key: "***"
            }
        };
    }

    return base;
};

export default function AdvancedDriftDetector() {
    const [endpoint, setEndpoint] = useState("https://api.example.com/v1/user/profile");
    const [snapshots, setSnapshots] = useState<ApiSnapshot[]>([]);
    const [driftEvents, setDriftEvents] = useState<DriftEvent[]>([]);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [simulatedTime, setSimulatedTime] = useState(0);

    // Simulation Runner
    const captureSnapshot = (versionOverride?: number) => {
        const now = new Date();
        // Simulate drift based on 'clicks' or time
        const version = versionOverride ?? ((snapshots.length % 3) + 1);
        const data = generateMockResponse(version);

        const newSnapshot: ApiSnapshot = {
            id: `snap-${Date.now()}`,
            timestamp: now,
            endpoint,
            status: 200,
            data,
            hash: JSON.stringify(data).length.toString() // simple hash
        };

        // Detect Drift against previous
        const prev = snapshots[0]; // Recent is 0
        if (prev) {
            analyzeDrift(prev, newSnapshot);
        }

        setSnapshots(prevSnaps => [newSnapshot, ...prevSnaps]);
    };

    const analyzeDrift = (prev: ApiSnapshot, curr: ApiSnapshot) => {
        const events: DriftEvent[] = [];

        // 1. Check Payload Equality
        if (JSON.stringify(prev.data) === JSON.stringify(curr.data)) return;

        // Flatten objects for simpler comparison (conceptual)
        const flatten = (obj: any, prefix = ''): Record<string, any> => {
            return Object.keys(obj).reduce((acc: any, k) => {
                const pre = prefix.length ? prefix + '.' : '';
                if (typeof obj[k] === 'object' && obj[k] !== null)
                    Object.assign(acc, flatten(obj[k], pre + k));
                else
                    acc[pre + k] = obj[k];
                return acc;
            }, {});
        }

        const flatPrev = flatten(prev.data);
        const flatCurr = flatten(curr.data);

        // Check 1: Missing Fields
        Object.keys(flatPrev).forEach(key => {
            if (!(key in flatCurr)) {
                events.push({
                    id: Math.random().toString(),
                    snapshotId: curr.id,
                    type: "field_missing",
                    severity: "high",
                    message: `Field Removed: ${key}`,
                    details: `Key '${key}' was present in previous snapshot but missing now. Breaking change risk!`
                });
            }
        });

        // Check 2: Type Changes & Permission Leaks (New Fields)
        Object.keys(flatCurr).forEach(key => {
            if (!(key in flatPrev)) {
                // New Field Found
                let severity: DriftEvent['severity'] = "low";
                if (key.includes("admin") || key.includes("secret") || key.includes("debug") || key.includes("password")) {
                    severity = "critical"; // LEAK!
                    events.push({
                        id: Math.random().toString(),
                        snapshotId: curr.id,
                        type: "permission_leak",
                        severity: "critical",
                        message: `Potential Info Leak: ${key}`,
                        details: `Sensitive key '${key}' appeared in response. Verify ACLs immediately!`
                    });
                } else {
                    events.push({
                        id: Math.random().toString(),
                        snapshotId: curr.id,
                        type: "new_field",
                        severity: "medium",
                        message: `New Field Added: ${key}`,
                        details: `Schema expanded with '${key}'. Check if documented.`
                    });
                }
            } else {
                // Field exists in both, check type
                if (typeof flatPrev[key] !== typeof flatCurr[key]) {
                    events.push({
                        id: Math.random().toString(),
                        snapshotId: curr.id,
                        type: "type_mismatch",
                        severity: "high",
                        message: `Type Mutated: ${key}`,
                        details: `Type changed from '${typeof flatPrev[key]}' to '${typeof flatCurr[key]}'. Will break strict clients.`
                    });
                }
            }
        });

        setDriftEvents(prevEvents => [...events, ...prevEvents]);
    };

    const clearHistory = () => {
        setSnapshots([]);
        setDriftEvents([]);
    }

    return (
        <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-amber-200 flex items-center gap-2">
                        <Activity className="text-orange-400" /> Contract Drift Detector
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Continuous monitoring for API breaking changes, type mutations, and data leaks.
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <Button variant="outline" onClick={clearHistory} disabled={snapshots.length === 0} className="border-red-900/30 hover:bg-red-900/10 text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" /> Reset
                    </Button>
                    <Button
                        onClick={() => captureSnapshot()}
                        className="bg-orange-600 hover:bg-orange-500"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Snapshot Now
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Left: Configuration & Status */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    <Card className="border-zinc-800 bg-zinc-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-zinc-400">Target Endpoint</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={endpoint}
                                    onChange={(e) => setEndpoint(e.target.value)}
                                    className="bg-black/20 font-mono text-xs border-zinc-700"
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-zinc-800">
                                <div className="space-y-1">
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Status</div>
                                    <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Monitoring Active
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Snapshots</div>
                                    <div className="font-mono text-xl text-white">{snapshots.length}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline / Event Feed */}
                    <Card className="flex-1 border-zinc-800 bg-zinc-900/50 flex flex-col min-h-0">
                        <CardHeader className="pb-3 border-b border-zinc-800/50">
                            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center justify-between">
                                <span>Drift Timeline</span>
                                {driftEvents.length > 0 && <Badge variant="destructive">{driftEvents.length} Issues</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                            {driftEvents.length === 0 ? (
                                <div className="p-8 text-center text-zinc-600 text-sm flex flex-col items-center">
                                    <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                                    No drift detected yet.
                                    <span className="text-xs opacity-50 mt-1">Take snapshots to detect changes.</span>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-800">
                                    {driftEvents.map((event) => (
                                        <div key={event.id} className="p-3 hover:bg-white/5 transition border-l-2 bg-gradient-to-r from-transparent to-transparent hover:to-white/5" style={{
                                            borderLeftColor:
                                                event.severity === 'critical' ? '#ef4444' :
                                                    event.severity === 'high' ? '#f97316' :
                                                        event.severity === 'medium' ? '#eab308' : '#3b82f6'
                                        }}>
                                            <div className="flex justify-between items-start mb-1">
                                                <Badge variant="outline" className={`h-5 text-[10px] px-1.5 uppercase ${event.severity === 'critical' ? 'text-red-400 border-red-900 bg-red-900/20' :
                                                        event.severity === 'high' ? 'text-orange-400 border-orange-900 bg-orange-900/20' :
                                                            event.severity === 'medium' ? 'text-yellow-400 border-yellow-900 bg-yellow-900/20' : 'text-blue-400 border-blue-900 bg-blue-900/20'
                                                    }`}>
                                                    {event.type.replace('_', ' ')}
                                                </Badge>
                                                <span className="text-[10px] text-zinc-600 font-mono">
                                                    {snapshots.find(s => s.id === event.snapshotId)?.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="text-sm font-medium text-zinc-200">{event.message}</div>
                                            <div className="text-xs text-zinc-500 mt-1">{event.details}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Snapshot Inspector */}
                <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
                    {/* Latest Snapshot Viewer */}
                    <Card className="flex-1 border-zinc-800 bg-zinc-900/50 flex flex-col min-h-[300px]">
                        <CardHeader className="py-3 border-b border-zinc-800/50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileDiff className="w-4 h-4 text-zinc-400" />
                                <CardTitle className="text-sm font-medium text-zinc-200">
                                    Latest Snapshot Comparison
                                </CardTitle>
                            </div>
                            {snapshots.length > 0 && (
                                <span className="text-xs font-mono text-zinc-500">
                                    {snapshots[0].timestamp.toISOString()}
                                </span>
                            )}
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden relative font-mono text-xs">
                            {snapshots.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                                    Waiting for data...
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 h-full divide-x divide-zinc-800">
                                    <div className="p-4 overflow-auto bg-black/20">
                                        <div className="text-zinc-500 mb-2 font-bold uppercase tracking-wider flex items-center">
                                            <History className="w-3 h-3 mr-2" /> Previous Version
                                        </div>
                                        {snapshots.length > 1 ? (
                                            <pre className="text-zinc-400">
                                                {JSON.stringify(snapshots[1].data, null, 2)}
                                            </pre>
                                        ) : (
                                            <div className="italic text-zinc-600">No history available for comparison</div>
                                        )}
                                    </div>
                                    <div className="p-4 overflow-auto bg-black/40">
                                        <div className="text-orange-400 mb-2 font-bold uppercase tracking-wider flex items-center justify-between">
                                            <span className="flex items-center"><Eye className="w-3 h-3 mr-2" /> Current Version</span>
                                            <span className="text-[10px] bg-zinc-800 px-2 rounded opacity-70">Live</span>
                                        </div>
                                        <pre className="text-emerald-300">
                                            {JSON.stringify(snapshots[0].data, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats / Legend */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="bg-red-900/10 border-red-900/30 p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-red-300 opacity-70 uppercase font-bold">Data Leaks</div>
                                <div className="text-2xl font-bold text-red-500">
                                    {driftEvents.filter(e => e.type === 'permission_leak').length}
                                </div>
                            </div>
                            <ShieldAlert className="w-8 h-8 text-red-500/50" />
                        </Card>
                        <Card className="bg-orange-900/10 border-orange-900/30 p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-orange-300 opacity-70 uppercase font-bold">Breakages</div>
                                <div className="text-2xl font-bold text-orange-500">
                                    {driftEvents.filter(e => e.type === 'field_missing' || e.type === 'type_mismatch').length}
                                </div>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-orange-500/50" />
                        </Card>
                        <Card className="bg-blue-900/10 border-blue-900/30 p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-blue-300 opacity-70 uppercase font-bold">Schema Changes</div>
                                <div className="text-2xl font-bold text-blue-500">
                                    {driftEvents.filter(e => e.type === 'new_field').length}
                                </div>
                            </div>
                            <FileDiff className="w-8 h-8 text-blue-500/50" />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
