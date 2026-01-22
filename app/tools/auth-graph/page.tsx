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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Shield, User, Key, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types
type NodeType = 'user' | 'role' | 'permission';

interface NodeData {
    label: string;
    type: NodeType;
}

const initialNodes: Node[] = [
    { id: 'admin', position: { x: 250, y: 0 }, data: { label: 'Admin User', type: 'user' }, style: { background: '#1e293b', color: '#fff', border: '1px solid #94a3b8' } },
    { id: 'role-admin', position: { x: 250, y: 150 }, data: { label: 'Administrator Role', type: 'role' }, style: { background: '#3b82f6', color: '#fff', border: '1px solid #1d4ed8' } },
    { id: 'perm-read', position: { x: 100, y: 300 }, data: { label: 'Read Data', type: 'permission' }, style: { background: '#10b981', color: '#fff', border: '1px solid #059669' } },
    { id: 'perm-write', position: { x: 400, y: 300 }, data: { label: 'Write Data', type: 'permission' }, style: { background: '#10b981', color: '#fff', border: '1px solid #059669' } },
    { id: 'perm-delete', position: { x: 250, y: 450 }, data: { label: 'Delete Data', type: 'permission' }, style: { background: '#ef4444', color: '#fff', border: '1px solid #b91c1c' } },
];

const initialEdges: Edge[] = [
    { id: 'e1', source: 'admin', target: 'role-admin', animated: true, style: { stroke: '#94a3b8' } },
    { id: 'e2', source: 'role-admin', target: 'perm-read', style: { stroke: '#94a3b8' } },
    { id: 'e3', source: 'role-admin', target: 'perm-write', style: { stroke: '#94a3b8' } },
    { id: 'e4', source: 'role-admin', target: 'perm-delete', style: { stroke: '#ef4444', strokeDasharray: '5,5' } },
];

export default function AuthGraphPage() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    // Form state
    const [newItemName, setNewItemName] = useState("");
    const [newItemType, setNewItemType] = useState<NodeType>('user');

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const addNode = () => {
        if (!newItemName) return;

        const id = `node-${Date.now()}`;
        let style = {};
        if (newItemType === 'user') style = { background: '#1e293b', color: '#fff', border: '1px solid #94a3b8' };
        else if (newItemType === 'role') style = { background: '#3b82f6', color: '#fff', border: '1px solid #1d4ed8' };
        else style = { background: '#10b981', color: '#fff', border: '1px solid #059669' };

        const newNode: Node = {
            id,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: newItemName, type: newItemType },
            style
        };

        setNodes((nds) => [...nds, newNode]);
        setNewItemName("");
    };

    return (
        <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center space-x-4 mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    Auth & Permission Graph
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Controls */}
                <Card className="lg:col-span-1 border-zinc-800 bg-zinc-900/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-zinc-400">Graph Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Add New Entity</Label>
                            <Input
                                placeholder="Entity Name"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                className="bg-zinc-950 border-zinc-800"
                            />
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    size="sm"
                                    variant={newItemType === 'user' ? 'default' : 'outline'}
                                    onClick={() => setNewItemType('user')}
                                    className="text-xs"
                                >
                                    <User className="w-3 h-3 mr-1" /> User
                                </Button>
                                <Button
                                    size="sm"
                                    variant={newItemType === 'role' ? 'default' : 'outline'}
                                    onClick={() => setNewItemType('role')}
                                    className="text-xs"
                                >
                                    <Key className="w-3 h-3 mr-1" /> Role
                                </Button>
                                <Button
                                    size="sm"
                                    variant={newItemType === 'permission' ? 'default' : 'outline'}
                                    onClick={() => setNewItemType('permission')}
                                    className="text-xs"
                                >
                                    <Lock className="w-3 h-3 mr-1" /> Perm
                                </Button>
                            </div>
                            <Button className="w-full" onClick={addNode} disabled={!newItemName}>
                                <Plus className="w-4 h-4 mr-2" /> Add Node
                            </Button>
                        </div>

                        <div className="pt-4 border-t border-zinc-800">
                            <p className="text-xs text-zinc-500 mb-2">
                                Drag nodes to connect them (experimental). Currently static visualization.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Graph */}
                <Card className="lg:col-span-3 border-zinc-800 bg-zinc-900/50 overflow-hidden relative">
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
                </Card>
            </div>
        </div>
    );
}
