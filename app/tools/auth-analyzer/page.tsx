"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
    Node,
    Edge,
    Background,
    Controls,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    Connection,
    addEdge,
    MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Play, ShieldAlert, ShieldCheck } from "lucide-react";

interface AnalysisFinding {
    id: string;
    severity: "high" | "medium" | "low";
    title: string;
    description: string;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function AuthAnalyzerPage() {
    const [inputChain, setInputChain] = useState("");
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [findings, setFindings] = useState<AnalysisFinding[]>([]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const analyzeFlow = () => {
        const requests = inputChain.split(/\n\s*\n/); // Split by double newline (blocks)
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        const newFindings: AnalysisFinding[] = [];

        // Reset
        setNodes([]);
        setEdges([]);
        setFindings([]);

        let patternCsrfFound = false;
        let patternSessionId = "";

        requests.forEach((reqText, index) => {
            const lines = reqText.trim().split("\n");
            if (lines.length === 0) return;

            const firstLine = lines[0].split(" ");
            const method = firstLine[0] || "UNKNOWN";
            const url = firstLine[1] || "/";

            // Basic Analysis
            const isPost = method.toUpperCase() === "POST";
            const hasCsrfHeader = lines.some(l => l.toLowerCase().includes("csrf") || l.toLowerCase().includes("xsrf"));

            // Check for Session ID in cookies (simple check)
            const cookieLine = lines.find(l => l.toLowerCase().startsWith("cookie:"));
            let currentSessionId = "";
            if (cookieLine) {
                const match = cookieLine.match(/session_id=([^;]+)/) || cookieLine.match(/JSESSIONID=([^;]+)/) || cookieLine.match(/PHPSESSID=([^;]+)/);
                if (match) currentSessionId = match[1];
            }

            // Findings Logic
            if (isPost && !hasCsrfHeader) {
                newFindings.push({
                    id: `req-${index}-csrf`,
                    severity: "medium",
                    title: "Potential Missing CSRF Protection",
                    description: `Request #${index + 1} (${method} ${url}) is a POST request but does not appear to have standard CSRF headers.`
                });
            }

            // Visualization Node
            newNodes.push({
                id: `req-${index}`,
                data: { label: `${method} ${url}` },
                position: { x: 250, y: index * 150 + 50 },
                style: {
                    background: isPost ? '#1e293b' : '#0f172a',
                    color: '#e2e8f0',
                    border: isPost ? '1px solid #3b82f6' : '1px solid #475569',
                    width: 200,
                    borderRadius: '8px',
                    padding: '10px'
                },
            });

            // Edge to next
            if (index > 0) {
                newEdges.push({
                    id: `e-${index - 1}-${index}`,
                    source: `req-${index - 1}`,
                    target: `req-${index}`,
                    animated: true,
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { stroke: '#64748b' }
                });
            }
        });

        setNodes(newNodes);
        setEdges(newEdges);
        setFindings(newFindings);
    };

    return (
        <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center space-x-4 mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    Auth Flow Analyzer
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Input Column */}
                <Card className="lg:col-span-1 flex flex-col border-zinc-800 bg-zinc-900/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-zinc-400">Request Chain Input</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col space-y-4">
                        <p className="text-xs text-zinc-500">
                            Paste a sequence of raw HTTP requests (or similar format). Separate requests with empty lines.
                        </p>
                        <Textarea
                            value={inputChain}
                            onChange={(e) => setInputChain(e.target.value)}
                            placeholder={`POST /login HTTP/1.1
Host: example.com
Content-Type: application/json

{ "user": "admin", "pass": "123" }

GET /dashboard HTTP/1.1
Cookie: session_id=xyz...`}
                            className="flex-1 resize-none font-mono text-xs bg-black/20 border-zinc-800"
                        />
                        <Button onClick={analyzeFlow} className="w-full bg-blue-600 hover:bg-blue-500">
                            <Play className="w-4 h-4 mr-2" /> Analyze Flow
                        </Button>
                    </CardContent>
                </Card>

                {/* Visual & Findings Column */}
                <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
                    {/* Findings Panel (Top if any) */}
                    {findings.length > 0 && (
                        <Card className="border-zinc-800 bg-zinc-900/50 max-h-[200px] overflow-y-auto">
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                                    <ShieldAlert className="w-4 h-4 mr-2 text-yellow-500" /> Security Findings ({findings.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {findings.map(f => (
                                    <Alert key={f.id} className="border-yellow-900/50 bg-yellow-900/10 py-2">
                                        <AlertTitle className="text-yellow-500 text-xs font-bold mb-1">{f.title}</AlertTitle>
                                        <AlertDescription className="text-zinc-400 text-xs">{f.description}</AlertDescription>
                                    </Alert>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Flow Diagram */}
                    <Card className="flex-1 border-zinc-800 bg-zinc-900/50 relative overflow-hidden min-h-[400px]">
                        <div className="absolute inset-0">
                            {nodes.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                                    Enter request chain to visualize flow...
                                </div>
                            ) : (
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    fitView
                                >
                                    <Background color="#333" gap={16} />
                                    <Controls />
                                </ReactFlow>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
