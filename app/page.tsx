import Link from "next/link";
import {
  Braces,
  Code2,
  FileJson,
  Globe,
  KeyRound,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    href: "/tools/json-formatter",
    label: "JSON Formatter",
    description: "Format, minify, and validate JSON data with error highlighting.",
    icon: FileJson,
    color: "text-blue-400 bg-blue-400/10",
  },
  {
    href: "/tools/base64",
    label: "Base64 Converter",
    description: "Encode and decode text to Base64 format instantly.",
    icon: Code2,
    color: "text-purple-400 bg-purple-400/10",
  },
  {
    href: "/tools/jwt-decoder",
    label: "JWT Decoder",
    description: "Decode JSON Web Tokens to view headers and payloads.",
    icon: KeyRound,
    color: "text-rose-400 bg-rose-400/10",
  },
  {
    href: "/tools/regex-tester",
    label: "Regex Tester",
    description: "Test regular expressions against strings in real-time.",
    icon: Braces,
    color: "text-amber-400 bg-amber-400/10",
  },
  {
    href: "/tools/http-status",
    label: "HTTP Status",
    description: "Check URL status codes, response times, and headers.",
    icon: Globe,
    color: "text-emerald-400 bg-emerald-400/10",
  },
];

export default function Home() {
  return (
    <div className="space-y-12 py-10">
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
          Developer <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Toolkit</span>
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          A collection of essential tools for developers and pentesters.
          Fast, secure, and designed for your workflow.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="h-full border-zinc-800 bg-zinc-900/30 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50 hover:shadow-2xl">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-zinc-100 group-hover:text-white transition-colors">
                    {tool.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400 mb-6">
                    {tool.description}
                  </CardDescription>
                  <div className="flex items-center text-sm font-medium text-zinc-500 group-hover:text-blue-400 transition-colors">
                    Open Tool <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
