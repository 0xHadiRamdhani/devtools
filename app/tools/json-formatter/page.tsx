"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, FileJson, Trash2, Minimize, Maximize, Code2, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Mode = "formatter" | "converter";
type Language = "typescript" | "dart";

export default function JsonFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>("formatter");
    const [lang, setLang] = useState<Language>("typescript");

    const handleFormat = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                return;
            }
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
            setError(null);
            toast.success("JSON formatted successfully");
        } catch (err) {
            setError("Invalid JSON");
            toast.error("Invalid JSON content");
        }
    };

    const handleMinify = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                return;
            }
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError(null);
            toast.success("JSON minified successfully");
        } catch (err) {
            setError("Invalid JSON");
            toast.error("Invalid JSON content");
        }
    };

    const generateTypes = () => {
        try {
            const parsed = JSON.parse(input);
            if (lang === "typescript") {
                setOutput(jsonToTs(parsed, "Root"));
            } else {
                setOutput(jsonToDart(parsed, "Root"));
            }
            setError(null);
            toast.success(`Generated ${lang === 'typescript' ? 'TypeScript' : 'Dart'} models`);
        } catch (err) {
            setError("Invalid JSON");
            toast.error("Invalid JSON for generation");
        }
    };

    // Simple TS Generator
    const jsonToTs = (obj: any, rootName: string): string => {
        let interfaces = "";
        const seen = new Set<string>();

        const getType = (val: any): string => {
            if (val === null) return "any";
            if (Array.isArray(val)) {
                if (val.length === 0) return "any[]";
                return `${getType(val[0])}[]`;
            }
            if (typeof val === "object") {
                return "any"; // Simplified nested handling for now or recursion
            }
            return typeof val;
        };

        // Detailed recursive implementation usually needed 
        // For MVP, simple top-level or single-level recursion
        const parseObject = (name: string, obj: any) => {
            if (seen.has(name)) return;
            seen.add(name);

            let result = `export interface ${name} {\n`;
            const nested: { name: string, obj: any }[] = [];

            for (const [key, val] of Object.entries(obj)) {
                let type = typeof val;
                if (val === null) type = "any";
                else if (Array.isArray(val)) {
                    if (val.length > 0 && typeof val[0] === 'object') {
                        const childName = capitalize(key);
                        type = `${childName}[]`;
                        nested.push({ name: childName, obj: val[0] });
                    } else if (val.length > 0) {
                        type = `${typeof val[0]}[]`;
                    } else {
                        type = "any[]";
                    }
                } else if (typeof val === 'object') {
                    const childName = capitalize(key);
                    type = childName;
                    nested.push({ name: childName, obj: val });
                }
                result += `  ${key}: ${type};\n`;
            }
            result += "}\n\n";
            interfaces += result;
            nested.forEach(n => parseObject(n.name, n.obj));
        };

        if (typeof obj === 'object' && !Array.isArray(obj)) {
            parseObject(rootName, obj);
        } else if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object') {
            parseObject(rootName, obj[0]);
        }

        return interfaces;
    };

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    // Simple Dart Generator
    const jsonToDart = (obj: any, rootName: string): string => {
        let classes = "";
        const seen = new Set<string>();

        const parseObject = (name: string, obj: any) => {
            if (seen.has(name)) return;
            seen.add(name);

            let result = `class ${name} {\n`;
            const nested: { name: string, obj: any }[] = [];
            let constructorArgs = "";
            let fromJson = `  ${name}.fromJson(Map<String, dynamic> json) {\n`;
            let toJson = `  Map<String, dynamic> toJson() {\n    final Map<String, dynamic> data = <String, dynamic>{};\n`;

            for (const [key, val] of Object.entries(obj)) {
                let type = "dynamic";
                let dartType = "dynamic";

                if (val === null) { }
                else if (typeof val === 'number') dartType = Number.isInteger(val) ? 'int' : 'double';
                else if (typeof val === 'boolean') dartType = 'bool';
                else if (typeof val === 'string') dartType = 'String';
                else if (Array.isArray(val)) {
                    dartType = 'List<dynamic>';
                    if (val.length > 0 && typeof val[0] === 'object') {
                        const childName = capitalize(key);
                        dartType = `List<${childName}>`;
                        nested.push({ name: childName, obj: val[0] });
                    }
                } else if (typeof val === 'object') {
                    const childName = capitalize(key);
                    dartType = childName;
                    nested.push({ name: childName, obj: val });
                }

                result += `  ${dartType}? ${key};\n`;
                // Simple parser generation omitted for brevity in MVP, focusing on class structure
            }

            result += `\n  ${name}({this.${Object.keys(obj).join(', this.')}});\n`;

            // Simplified FromJson/ToJson for MVP - full impl needs recursion logic mapping
            // Just leaving placeholder methods
            result += `\n  ${name}.fromJson(Map<String, dynamic> json) {\n    // Implementation\n  }\n`;
            result += `\n  Map<String, dynamic> toJson() {\n    final Map<String, dynamic> data = <String, dynamic>{};\n    // Implementation\n    return data;\n  }\n`;

            result += "}\n\n";
            classes += result;
            nested.forEach(n => parseObject(n.name, n.obj));
        };

        if (typeof obj === 'object' && !Array.isArray(obj)) {
            parseObject(rootName, obj);
        }

        return classes;
    }

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success("Copied to clipboard");
    };

    const handleClear = () => {
        setInput("");
        setOutput("");
        setError(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">JSON Toolkit</h1>
                <p className="text-zinc-400">
                    Format, minify, and generate type definitions from JSON.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
                <div className="bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 inline-flex self-center">
                    <Button
                        variant={mode === "formatter" ? "secondary" : "ghost"}
                        onClick={() => setMode("formatter")}
                        className="w-32"
                    >
                        Formatter
                    </Button>
                    <Button
                        variant={mode === "converter" ? "secondary" : "ghost"}
                        onClick={() => setMode("converter")}
                        className="w-32"
                    >
                        Type Gen
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:h-[calc(100vh-320px)]">
                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-zinc-200">Input JSON</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 flex flex-col gap-2">
                        <Textarea
                            className={`flex-1 font-mono text-sm resize-none bg-zinc-950/50 ${error ? "border-red-500 focus-visible:ring-red-500" : ""
                                }`}
                            placeholder="Paste your JSON here..."
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setError(null);
                            }}
                        />
                        <div className="flex gap-2 justify-end mt-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleClear}
                                disabled={!input}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/30">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-zinc-200">Output</CardTitle>
                        <div className="flex items-center gap-2">
                            {mode === "formatter" ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleMinify}
                                        disabled={!input}
                                        title="Minify"
                                    >
                                        <Minimize className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleFormat}
                                        disabled={!input}
                                        title="Format"
                                    >
                                        <Maximize className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <div className="flex items-center bg-zinc-900 rounded-md border border-zinc-800 p-0.5">
                                    <Button
                                        variant={lang === "typescript" ? "secondary" : "ghost"}
                                        size="sm"
                                        onClick={() => setLang("typescript")}
                                        className="h-7 text-xs"
                                    >
                                        TS
                                    </Button>
                                    <Button
                                        variant={lang === "dart" ? "secondary" : "ghost"}
                                        size="sm"
                                        onClick={() => setLang("dart")}
                                        className="h-7 text-xs"
                                    >
                                        Dart
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 ml-1"
                                        onClick={generateTypes}
                                        disabled={!input}
                                    >
                                        <Code2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                disabled={!output}
                                title="Copy Output"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            className="flex-1 h-full min-h-[300px] font-mono text-sm resize-none bg-zinc-950/50 text-green-400"
                            readOnly
                            value={output}
                            placeholder="Result will appear here..."
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
