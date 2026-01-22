"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Lock, RefreshCw, ShieldAlert, Terminal } from "lucide-react";
import { calculateRisk } from "@/lib/risk-scorer";

// --- Scenario Data & Logic ---

interface ScenarioStep {
    title: string;
    description: string;
    hint?: string;
}

const IDOR_STEPS: ScenarioStep[] = [
    {
        title: "Analyze the URL",
        description: "You are logged in as a normal user. Look at the browser URL bar. Notice the parameters.",
        hint: "Do you see an 'id' parameter?",
    },
    {
        title: "Modify the ID",
        description: "Try to access another user's profile by changing the ID parameter in the URL.",
        hint: "Try changing '101' to '102'.",
    },
    {
        title: "Observe the Result",
        description: "If the application is vulnerable, you will see someone else's private data.",
        hint: "Did the profile name change?",
    },
];

// --- Components ---

export default function AttackSimulatorPage() {
    const [activeScenario, setActiveScenario] = useState<string | null>(null);

    return (
        <div className="container mx-auto p-6 h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex items-center space-x-4 mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    Attack Simulator (Safe Mode)
                </h1>
            </div>

            {!activeScenario ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition cursor-pointer group" onClick={() => setActiveScenario("IDOR")}>
                        <CardHeader>
                            <CardTitle className="group-hover:text-blue-400 transition">Broken Access Control (IDOR)</CardTitle>
                            <CardDescription>Simulate accessing private data by manipulating identifiers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="outline" className="text-orange-400 border-orange-400/20 bg-orange-400/10">High Risk</Badge>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-800 bg-zinc-900/30 opacity-60 cursor-not-allowed">
                        <CardHeader>
                            <CardTitle>Rate Limiting Bypass</CardTitle>
                            <CardDescription>Coming Soon</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            ) : (
                <SimulationRunner scenarioId={activeScenario} onExit={() => setActiveScenario(null)} />
            )}
        </div>
    );
}

function SimulationRunner({ scenarioId, onExit }: { scenarioId: string; onExit: () => void }) {
    const risk = calculateRisk("HIGH");
    const [currentUrl, setCurrentUrl] = useState("https://api.vulnerable-app.com/users?id=101");
    const [profileData, setProfileData] = useState({ id: "101", name: "Alice (You)", email: "alice@example.com", role: "User" });
    const [currentStep, setCurrentStep] = useState(0);
    const [isVulnerable, setIsVulnerable] = useState(true);

    // IDOR Logic
    const handleGo = () => {
        try {
            const urlObj = new URL(currentUrl);
            const id = urlObj.searchParams.get("id");

            if (id === "101") {
                setProfileData({ id: "101", name: "Alice (You)", email: "alice@example.com", role: "User" });
            } else if (id === "102") {
                if (isVulnerable) {
                    setProfileData({ id: "102", name: "Bob (victim)", email: "bob@company.com", role: "Admin" });
                    if (currentStep === 1) setCurrentStep(2);
                } else {
                    setProfileData({ id: "error", name: "Access Denied", email: "You do not have permission to view this resource.", role: "-" });
                }
            } else {
                setProfileData({ id: "error", name: "Not Found", email: "User not found", role: "-" });
            }

            if (currentStep === 0 && id !== "101") setCurrentStep(1); // Detected they tried to change it

        } catch {
            setProfileData({ id: "error", name: "Error", email: "Invalid URL", role: "-" });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6">
            {/* Sidebar Instructions */}
            <Card className="lg:w-1/3 border-zinc-800 bg-zinc-900/50 flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <Button variant="ghost" size="sm" onClick={onExit}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Badge className={risk.color}>{risk.label}</Badge>
                    </div>
                    <CardTitle>IDOR Simulation</CardTitle>
                    <CardDescription>Follow the steps to exploit the vulnerability.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 overflow-y-auto">
                    {IDOR_STEPS.map((step, idx) => (
                        <div key={idx} className={`relative pl-6 border-l-2 ${idx === currentStep ? 'border-blue-500' : idx < currentStep ? 'border-green-500' : 'border-zinc-700'}`}>
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${idx === currentStep ? 'bg-blue-500' : idx < currentStep ? 'bg-green-500' : 'bg-zinc-700'}`} />
                            <h3 className={`font-semibold ${idx === currentStep ? 'text-blue-400' : 'text-zinc-400'}`}>{step.title}</h3>
                            <p className="text-sm text-zinc-500 mt-1">{step.description}</p>
                            {idx === currentStep && step.hint && (
                                <div className="mt-2 text-xs text-yellow-500/80 bg-yellow-500/10 p-2 rounded">
                                    💡 Hint: {step.hint}
                                </div>
                            )}
                        </div>
                    ))}

                    {currentStep === 2 && (
                        <Alert className="bg-green-500/10 border-green-500/30">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertTitle className="text-green-500">Vulnerability Confirmed!</AlertTitle>
                            <AlertDescription className="text-green-400/80 text-xs mt-1">
                                You successfully accessed Bob's account (ID 102) without authorization. This is an Insecure Direct Object Reference.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="border-t border-zinc-800 pt-4 flex-col items-start gap-2">
                    <h4 className="text-sm font-semibold text-zinc-300 flex items-center"><ShieldAlert className="w-4 h-4 mr-2" /> Remediation</h4>
                    <div className="flex items-center space-x-2 w-full">
                        <span className="text-xs text-zinc-500">Secure Mode:</span>
                        <Button
                            variant={isVulnerable ? "destructive" : "default"}
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => setIsVulnerable(!isVulnerable)}
                        >
                            {isVulnerable ? "Vulnerable (Unsafe)" : "Patched (Secure)"}
                        </Button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                        Toggle to "Patched" and try expecting ID 102 again. You should see "Access Denied".
                    </p>
                </CardFooter>
            </Card>

            {/* Mock Browser */}
            <div className="flex-1 flex flex-col space-y-4">
                <div className="bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col flex-1 overflow-hidden">
                    {/* Browser Bar */}
                    <div className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 space-x-3">
                        <div className="flex space-x-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="flex-1 bg-black/50 rounded-md h-8 flex items-center px-3 text-sm text-zinc-400 font-mono relative">
                            <Lock className="w-3 h-3 mr-2 opacity-50" />
                            <Input
                                className="h-full border-0 bg-transparent focus-visible:ring-0 px-0 text-zinc-300 placeholder:text-zinc-600"
                                value={currentUrl}
                                onChange={(e) => setCurrentUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGo()}
                            />
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleGo}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white p-8 font-sans text-zinc-900">
                        {/* Mock App UI */}
                        <div className="max-w-2xl mx-auto border rounded shadow-sm">
                            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                                <h2 className="text-xl font-bold">User Profile</h2>
                                <Badge variant="secondary">{profileData.role}</Badge>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                                        {profileData.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">{profileData.name}</h3>
                                        <p className="text-gray-500">{profileData.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-gray-100 rounded">
                                        <span className="text-xs font-bold text-gray-400 uppercase">User ID</span>
                                        <div className="font-mono text-sm">{profileData.id}</div>
                                    </div>
                                    <div className="p-4 bg-gray-100 rounded">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                                        <div className="text-sm flex items-center text-green-600 font-medium">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" /> Active
                                        </div>
                                    </div>
                                </div>

                                {profileData.id === "102" && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm mt-4">
                                        ⚠️ <strong>Confidential:</strong> This user has Admin privileges and access to payroll data.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
