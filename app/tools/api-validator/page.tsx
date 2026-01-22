"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, FileJson, Play, XCircle } from "lucide-react";
import yaml from "js-yaml";

interface ValidationResult {
    status: "success" | "error" | "warning";
    message: string;
    field?: string;
}

export default function ApiValidatorPage() {
    const [specInput, setSpecInput] = useState("");
    const [responseInput, setResponseInput] = useState("");
    const [results, setResults] = useState<ValidationResult[]>([]);
    const [endpointMethod, setEndpointMethod] = useState("GET");
    const [endpointPath, setEndpointPath] = useState("/");

    const validateContract = () => {
        try {
            // 1. Parse Spec
            let spec: any;
            try {
                spec = JSON.parse(specInput);
            } catch {
                try {
                    spec = yaml.load(specInput);
                } catch (e) {
                    setResults([{ status: "error", message: "Invalid OpenAPI Spec (JSON or YAML format required)" }]);
                    return;
                }
            }

            // 2. Parse Response
            let response: any;
            try {
                response = JSON.parse(responseInput);
            } catch {
                setResults([{ status: "error", message: "Invalid Response JSON" }]);
                return;
            }

            // 3. Find Schema (Simplified for demo: assuming flat schema or finding first match)
            // In a real generic tool, we'd need a selector for path/method.
            // For now, let's try to find a schema that looks like it matches or just use the first one found.

            const errors: ValidationResult[] = [];
            const warnings: ValidationResult[] = [];

            // Very basic structural check - in a real app this would be recursive and handle $ref
            // This is a "Safe Simulation" so we check top-level keys mainly.

            let schemaProperties: any = {};
            let requiredFields: string[] = [];

            // Attempt to extract properties from a standard OpenAPI structure
            // paths -> /path -> method -> responses -> 200 -> content -> application/json -> schema
            try {
                // Safe traversal helper
                const findSchema = (obj: any) => {
                    if (obj.properties) return obj;
                    if (obj.schema) return findSchema(obj.schema);
                    if (obj.content && obj.content['application/json']) return findSchema(obj.content['application/json'].schema);
                    // Iterate paths
                    for (const key in obj) {
                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                            const found: any = findSchema(obj[key]);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const foundSchema = findSchema(spec);
                if (foundSchema && foundSchema.properties) {
                    schemaProperties = foundSchema.properties;
                    requiredFields = foundSchema.required || [];
                } else {
                    // If user pasted just a schema object directly
                    if (spec.properties) {
                        schemaProperties = spec.properties;
                        requiredFields = spec.required || [];
                    } else {
                        errors.push({ status: "error", message: "Could not find a valid Schema definition in the input spec." });
                    }
                }
            } catch (e) {
                console.error(e);
            }

            if (Object.keys(schemaProperties).length === 0 && errors.length === 0) {
                errors.push({ status: "warning", message: "No properties found in schema to validate against." });
            }

            // Check for Missing Required Fields
            requiredFields.forEach(field => {
                if (!(field in response)) {
                    errors.push({ status: "error", message: `Missing required field: '${field}'`, field });
                }
            });

            // Check for Type Mismatches & valid fields
            Object.keys(response).forEach(key => {
                if (!schemaProperties[key]) {
                    // Extra field (OpenAPI usually allows this, but strict mode might not)
                    warnings.push({ status: "warning", message: `Extra field not in spec: '${key}'`, field: key });
                } else {
                    const expectedType = schemaProperties[key].type;
                    const actualType = Array.isArray(response[key]) ? 'array' : typeof response[key];

                    if (expectedType && expectedType !== actualType) {
                        // loosen check for integer/number
                        if (expectedType === 'integer' && actualType === 'number') { /* ok */ }
                        else if (expectedType === 'number' && actualType === 'number') { /* ok */ }
                        else {
                            errors.push({ status: "error", message: `Type mismatch for '${key}'. Expected ${expectedType}, got ${actualType}`, field: key });
                        }
                    }
                }
            });

            if (errors.length === 0 && warnings.length === 0) {
                setResults([{ status: "success", message: "Validation Successful! Response matches the Contract." }]);
            } else {
                setResults([...errors, ...warnings]);
            }

        } catch (e: any) {
            setResults([{ status: "error", message: `Unexpected error: ${e.message}` }]);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center space-x-4 mb-8">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    API Contract Validator
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
                {/* Left Col: Spec */}
                <div className="flex flex-col space-y-4">
                    <Card className="flex-1 flex flex-col border-zinc-800 bg-zinc-900/50">
                        <CardHeader>
                            <CardTitle className="flex items-center text-sm font-medium text-zinc-400">
                                <FileJson className="w-4 h-4 mr-2" /> OpenAPI Spec (JSON/YAML)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative">
                            <Textarea
                                placeholder="Paste your OpenAPI spec or Schema object here..."
                                className="h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-xs focus-visible:ring-0 leading-relaxed"
                                value={specInput}
                                onChange={(e) => setSpecInput(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Response & Results */}
                <div className="flex flex-col space-y-4">
                    <Card className="flex-1 flex flex-col border-zinc-800 bg-zinc-900/50 min-h-[300px]">
                        <CardHeader>
                            <CardTitle className="flex items-center text-sm font-medium text-zinc-400">
                                <FileJson className="w-4 h-4 mr-2" /> API Response (JSON)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            <Textarea
                                placeholder="Paste the actual API response here..."
                                className="h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-xs focus-visible:ring-0 leading-relaxed"
                                value={responseInput}
                                onChange={(e) => setResponseInput(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <Button onClick={validateContract} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6">
                        <Play className="w-4 h-4 mr-2" /> Validate Contract
                    </Button>

                    <div className="min-h-[200px] space-y-2 overflow-y-auto">
                        {results.length > 0 ? (
                            results.map((res, idx) => (
                                <Alert key={idx} variant={res.status === 'error' ? 'destructive' : 'default'} className={`border-l-4 ${res.status === 'success' ? 'border-l-green-500 bg-green-500/10 border-green-900/20' : res.status === 'warning' ? 'border-l-yellow-500 bg-yellow-500/10 border-yellow-900/20' : 'border-l-red-500 bg-red-500/10 border-red-900/20'}`}>
                                    <div className="flex items-center">
                                        {res.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />}
                                        {res.status === 'error' && <XCircle className="h-4 w-4 text-red-500 mr-2" />}
                                        {res.status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />}
                                        <AlertTitle className="mb-0 font-medium text-sm">
                                            {res.status.toUpperCase()} {res.field ? `: ${res.field}` : ''}
                                        </AlertTitle>
                                    </div>
                                    <AlertDescription className="mt-1 ml-6 text-xs opacity-90">
                                        {res.message}
                                    </AlertDescription>
                                </Alert>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-500 text-sm italic">
                                Run validation to see results...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
