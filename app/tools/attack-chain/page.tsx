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
    MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Zap, Target } from "lucide-react";

// Kill Chain / Attack Chain Simulation

const initialNodes: Node[] = [
    { id: '1', type: 'input', data: { label: 'Reconnaissance' }, position: { x: 250, y: 0 }, style: { background: '#0f172a', color: '#fff', border: '1px solid #334155' } },
    { id: '2', data: { label: 'Weaponization' }, position: { x: 250, y: 100 }, style: { background: '#0f172a', color: '#fff', border: '1px solid #334155' } },
    { id: '3', data: { label: 'Delivery' }, position: { x: 250, y: 200 }, style: { background: '#0f172a', color: '#fff', border: '1px solid #334155' } },
    { id: '4', data: { label: 'Exploitation' }, position: { x: 250, y: 300 }, style: { background: '#7f1d1d', color: '#fff', border: '1px solid #ef4444' } }, // Red for exploit
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#475569' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#475569' } },
    { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#ef4444' } },
];

export default function AttackChainPage() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const addStage = () => {
        const id = `${nodes.length + 1}`;
        const newNode: Node = {
            id,
            data: { label: 'Next Stage' },
            position: { x: 250, y: nodes.length * 100 },
            style: { background: '#0f172a', color: '#fff', border: '1px solid #334155' }
        };
        const newEdge: Edge = {
            id: `e${nodes.length}-${id}`,
            source: `${nodes.length}`,
            target: id,
            animated: true, style: { stroke: '#475569' }
        };

        setNodes([...nodes, newNode]);
        setEdges([...edges, newEdge]);
    };

    return (
        <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-red-500 to-orange-500">
                        Attack Chain Visualizer
                    </h1>
                    <p className="text-zinc-500 text-sm">Visualize and plan attack paths (Cyber Kill Chain / MITRE ATT&CK).</p>
                </div>
                <Button onClick={addStage} variant="secondary">
                    <Plus className="w-4 h-4 mr-2" /> Add Stage
                </Button>
            </div>

            <Card className="flex-1 border-zinc-800 bg-zinc-900/50 overflow-hidden relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                >
                    <Background color="#222" gap={20} />
                    <Controls />
                </ReactFlow>
            </Card>
        </div>
    );
}
