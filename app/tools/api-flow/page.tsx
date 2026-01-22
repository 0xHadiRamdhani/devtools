"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Plus, ArrowRight, Save } from "lucide-react";

interface ApiStep {
    id: number;
    method: string;
    url: string;
    extract?: string;
    use?: string;
    status: 'pending' | 'success' | 'failed';
    response?: string;
}

export default function ApiFlowPage() {
    const [steps, setSteps] = useState<ApiStep[]>([
        { id: 1, method: "POST", url: "https://api.example.com/login", extract: "token", status: 'pending' },
        { id: 2, method: "GET", url: "https://api.example.com/user/profile", use: "token", status: 'pending' }
    ]);

    const runFlow = async () => {
        // Simulation
        const newSteps = [...steps];

        for (let i = 0; i < newSteps.length; i++) {
            newSteps[i].status = 'pending'; // In progress
            // In a real app we'd trigger a render here but let's just simulate end result
        }
        setSteps([...newSteps]);

        // Simulate async execution
        await new Promise(r => setTimeout(r, 500));
        newSteps[0].status = 'success';
        newSteps[0].response = '{"token": "eyJhbGciOiJIUzI1Ni..."}';
        setSteps([...newSteps]);

        await new Promise(r => setTimeout(r, 800));
        newSteps[1].status = 'success';
        newSteps[1].response = '{"id": 123, "name": "Admin"}';
        setSteps([...newSteps]);
    };

    const addStep = () => {
        setSteps([...steps, {
            id: steps.length + 1,
            method: "GET",
            url: "",
            status: 'pending'
        }]);
    };

    return (
        <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    Stateful API Flow Simulator
                </h1>
                <Button onClick={runFlow} className="bg-green-600 hover:bg-green-500">
                    <Play className="w-4 h-4 mr-2" /> Run Flow
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {steps.map((step, idx) => (
                        <Card key={step.id} className="border-zinc-800 bg-zinc-900/50">
                            <CardContent className="p-4 flex items-center space-x-4">
                                <div className="flex flex-col items-center justify-center space-y-1">
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                                        {idx + 1}
                                    </div>
                                    {idx < steps.length - 1 && <div className="h-full w-px bg-zinc-800" />}
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex space-x-2">
                                        <select
                                            className="bg-zinc-950 border border-zinc-700 rounded text-sm px-2 py-1"
                                            value={step.method}
                                            onChange={(e) => {
                                                const ns = [...steps];
                                                ns[idx].method = e.target.value;
                                                setSteps(ns);
                                            }}
                                        >
                                            <option>GET</option>
                                            <option>POST</option>
                                            <option>PUT</option>
                                            <option>DELETE</option>
                                        </select>
                                        <Input
                                            value={step.url}
                                            onChange={(e) => {
                                                const ns = [...steps];
                                                ns[idx].url = e.target.value;
                                                setSteps(ns);
                                            }}
                                            placeholder="/api/endpoint"
                                            className="h-8 bg-zinc-950 border-zinc-700"
                                        />
                                    </div>
                                    <div className="flex space-x-2 text-xs text-zinc-500">
                                        {step.extract && <span className="text-blue-400 bg-blue-400/10 px-1 rounded">Extracts: {step.extract}</span>}
                                        {step.use && <span className="text-orange-400 bg-orange-400/10 px-1 rounded">Uses: {step.use}</span>}
                                    </div>
                                </div>

                                <div>
                                    {step.status === 'success' && <div className="w-3 h-3 rounded-full bg-green-500" />}
                                    {step.status === 'failed' && <div className="w-3 h-3 rounded-full bg-red-500" />}
                                    {step.status === 'pending' && <div className="w-3 h-3 rounded-full bg-zinc-700" />}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Button variant="outline" className="w-full border-dashed border-zinc-700 text-zinc-400" onClick={addStep}>
                        <Plus className="w-4 h-4 mr-2" /> Add Step
                    </Button>
                </div>

                <Card className="border-zinc-800 bg-zinc-950 font-mono text-sm overflow-hidden">
                    <CardHeader className="bg-zinc-900/50 border-b border-zinc-800 py-3">
                        <CardTitle className="text-sm">Execution Log</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {steps.map((step, idx) => (
                            step.response && (
                                <div key={idx} className="space-y-1">
                                    <div className="text-zinc-500">Step {idx + 1}: {step.method} {step.url}</div>
                                    <pre className="text-green-400 bg-black/50 p-2 rounded overflow-x-auto">
                                        {step.response}
                                    </pre>
                                </div>
                            )
                        ))}
                        {steps.every(s => s.status === 'pending') && (
                            <div className="text-zinc-600 italic">Ready to run...</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
