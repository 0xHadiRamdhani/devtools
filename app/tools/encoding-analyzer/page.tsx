"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowDown, Wand2, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface EncodingStep {
    id: string;
    method: "Input" | "Base64 Decode" | "URL Decode" | "Hex Decode" | "HTML Decode";
    value: string;
}

export default function EncodingAnalyzerPage() {
    const [steps, setSteps] = useState<EncodingStep[]>([
        { id: "root", method: "Input", value: "" },
    ]);

    const updateRootValue = (val: string) => {
        setSteps([{ id: "root", method: "Input", value: val }]);
    };

    const addStep = (method: EncodingStep["method"]) => {
        const lastStep = steps[steps.length - 1];
        let newValue = lastStep.value;

        try {
            switch (method) {
                case "Base64 Decode":
                    newValue = atob(lastStep.value);
                    break;
                case "URL Decode":
                    newValue = decodeURIComponent(lastStep.value);
                    break;
                case "Hex Decode":
                    newValue = lastStep.value.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || "";
                    break;
                case "HTML Decode":
                    const txt = document.createElement("textarea");
                    txt.innerHTML = lastStep.value;
                    newValue = txt.value;
                    break;
            }
            setSteps([...steps, { id: Math.random().toString(36).substr(2, 9), method, value: newValue }]);
        } catch (e) {
            toast.error(`Failed to ${method}: Invalid input`);
        }
    };

    const removeStep = (index: number) => {
        setSteps(steps.slice(0, index + 1));
    };

    const autoSolve = () => {
        let current = steps[steps.length - 1].value;
        let newSteps = [...steps];
        let madeProgress = true;
        let safetyCounter = 0;

        while (madeProgress && safetyCounter < 10) {
            madeProgress = false;
            safetyCounter++;

            // Try URL Decode
            try {
                const urlDecoded = decodeURIComponent(current);
                if (urlDecoded !== current && urlDecoded.length < current.length) { // simplistic heuristic
                    newSteps.push({ id: Math.random().toString(), method: "URL Decode", value: urlDecoded });
                    current = urlDecoded;
                    madeProgress = true;
                    continue;
                }
            } catch { }

            // Try Base64
            try {
                // Check if looks like base64
                if (/^[A-Za-z0-9+/]+={0,2}$/.test(current) && current.length % 4 === 0) {
                    const b64Decoded = atob(current);
                    // Check if result is readable (simple check)
                    if (/^[\x20-\x7E]*$/.test(b64Decoded)) {
                        newSteps.push({ id: Math.random().toString(), method: "Base64 Decode", value: b64Decoded });
                        current = b64Decoded;
                        madeProgress = true;
                        continue;
                    }
                }
            } catch { }
        }

        if (newSteps.length === steps.length) {
            toast("No obvious nested encoding detected.");
        } else {
            setSteps(newSteps);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-8">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    Encoding Chain Analyzer
                </h1>
            </div>

            <div className="space-y-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="relative group">
                        <Card className={`border-zinc-800 bg-zinc-900/50 ${index === 0 ? 'ring-2 ring-blue-500/20' : ''}`}>
                            <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                        {index + 1}
                                    </span>
                                    <CardTitle className="text-sm font-medium text-zinc-300">
                                        {step.method}
                                    </CardTitle>
                                </div>
                                {index > 0 && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-red-400" onClick={() => removeStep(index - 1)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="pb-3">
                                {index === 0 ? (
                                    <Textarea
                                        value={step.value}
                                        onChange={(e) => updateRootValue(e.target.value)}
                                        className="font-mono text-sm border-zinc-700 bg-black/20 focus-visible:ring-blue-500/50"
                                        placeholder="Paste encoded string here..."
                                    />
                                ) : (
                                    <div className="p-3 rounded-md bg-black/40 border border-zinc-800 font-mono text-sm break-all text-zinc-100">
                                        {step.value}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Arrow Connector */}
                        {index < steps.length - 1 && (
                            <div className="flex justify-center -my-2 relative z-10">
                                <div className="bg-zinc-800 rounded-full p-1 border border-zinc-700">
                                    <ArrowDown className="h-4 w-4 text-zinc-400" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Action Bar */}
                <div className="flex flex-wrap gap-2 justify-center pt-4">
                    <Button variant="outline" onClick={autoSolve} className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                        <Wand2 className="mr-2 h-4 w-4" /> Auto Detect
                    </Button>
                    <div className="w-px h-8 bg-zinc-800 mx-2 self-center"></div>
                    <Button variant="secondary" size="sm" onClick={() => addStep("Base64 Decode")}>Base64</Button>
                    <Button variant="secondary" size="sm" onClick={() => addStep("URL Decode")}>URL</Button>
                    <Button variant="secondary" size="sm" onClick={() => addStep("Hex Decode")}>Hex</Button>
                </div>
            </div>
        </div>
    );
}
