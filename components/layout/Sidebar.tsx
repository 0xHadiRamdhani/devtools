"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Braces,
    Clipboard,
    Code2,
    FileJson,
    Globe,
    KeyRound,
    LayoutDashboard,
    Menu,
    X,
    Info,
    Network,
    Activity,
    Zap,
    GitCompare,
    Bot,
    ShieldCheck,
    ChevronDown,
    ChevronRight,
    Wrench,
    Shield,
    Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define grouping structure
interface MenuItem {
    href: string;
    label: string;
    icon: any;
}

interface MenuGroup {
    id: string;
    label: string;
    icon?: any;
    items?: MenuItem[];
    href?: string; // For single top-level items
}

const menuGroups: MenuGroup[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        id: "converters",
        label: "Converters & Utils",
        icon: Wrench,
        items: [
            { href: "/tools/smart-clipboard", label: "Smart Clipboard", icon: Clipboard },
            { href: "/tools/json-formatter", label: "JSON Formatter", icon: FileJson },
            { href: "/tools/base64", label: "Base64 Converter", icon: Code2 },
            { href: "/tools/regex-tester", label: "Regex Tester", icon: Braces },
            { href: "/tools/encoding-analyzer", label: "Encoding Chain", icon: Code2 },
        ]
    },
    {
        id: "api",
        label: "API & Network",
        icon: Server,
        items: [
            { href: "/tools/http-status", label: "HTTP Status", icon: Globe },
            { href: "/tools/api-validator", label: "API Validator", icon: FileJson },
            { href: "/tools/api-flow", label: "API Flow Sim", icon: Activity },
            { href: "/tools/drift-detector", label: "Drift Detector", icon: GitCompare },
            { href: "/tools/jwt-decoder", label: "JWT Decoder", icon: KeyRound },
        ]
    },
    {
        id: "security",
        label: "Security Analysis",
        icon: Shield,
        items: [
            { href: "/tools/auth-analyzer", label: "Auth Flow Analyzer", icon: Globe },
            { href: "/tools/auth-graph", label: "Auth & Perm Graph", icon: Network },
            { href: "/tools/attack-simulator", label: "Attack Simulator", icon: KeyRound },
            { href: "/tools/attack-chain", label: "Attack Chain", icon: Zap },
            { href: "/tools/ai-reviewer", label: "AI Security Review", icon: Bot },
            { href: "/tools/compliance-engine", label: "Compliance Engine", icon: ShieldCheck },
        ]
    },
    {
        id: "about",
        label: "About DevTools",
        href: "/about",
        icon: Info,
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    // Track which groups are expanded. Default all closed or open based on preference.
    // Let's keep them open if a child is active.
    const [expandedGroups, setExpandedGroups] = useState<string[]>(["converters", "api", "security"]);

    // Close mobile menu on path change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Automatically expand group if child is active
    useEffect(() => {
        menuGroups.forEach(group => {
            if (group.items && group.items.some(item => item.href === pathname)) {
                setExpandedGroups(prev => prev.includes(group.id) ? prev : [...prev, group.id]);
            }
        });
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const toggleGroup = (id: string) => {
        setExpandedGroups(prev =>
            prev.includes(id)
                ? prev.filter(g => g !== id)
                : [...prev, id]
        );
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col px-4 py-8">
            <div className="mb-8 flex items-center gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Code2 className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                    DevTools
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto min-h-0 py-2 no-scrollbar">
                {menuGroups.map((group) => {
                    // Render Single Link
                    if (group.href) {
                        const isActive = pathname === group.href;
                        const Icon = group.icon;
                        return (
                            <Link
                                key={group.id}
                                href={group.href}
                                className={cn(
                                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 mb-1",
                                    isActive
                                        ? "text-white"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 rounded-lg bg-white/10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon className="relative z-10 h-4 w-4" />
                                <span className="relative z-10">{group.label}</span>
                            </Link>
                        );
                    }

                    // Render Group
                    const isExpanded = expandedGroups.includes(group.id);
                    const GroupIcon = group.icon;
                    const hasActiveChild = group.items?.some(i => i.href === pathname);

                    return (
                        <div key={group.id} className="mb-2">
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-white/5 group",
                                    hasActiveChild ? "text-zinc-100" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <GroupIcon className="h-4 w-4 group-hover:text-white transition-colors" />
                                    <span className="group-hover:text-white transition-colors">{group.label}</span>
                                </div>
                                {isExpanded ? (
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                ) : (
                                    <ChevronRight className="h-3 w-3 opacity-50" />
                                )}
                            </button>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-1 pl-4 mt-1 border-l border-zinc-800 ml-4">
                                            {group.items?.map((item) => {
                                                const isActive = pathname === item.href;
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                                            isActive
                                                                ? "text-blue-400 bg-blue-400/10"
                                                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                                        )}
                                                    >
                                                        <Icon className="h-3.5 w-3.5" />
                                                        <span>{item.label}</span>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            <div className="mt-auto px-2 pt-4 border-t border-white/5">
                <div className="rounded-xl border border-white/5 bg-linear-to-br from-zinc-900 to-zinc-950 p-4">
                    <h4 className="mb-1 text-xs font-semibold text-zinc-400">Pro Tip</h4>
                    <p className="text-xs text-zinc-500">
                        Press <kbd className="font-sans rounded bg-white/10 px-1 text-white">Cmd+K</kbd> to search tools quickly.
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-zinc-950/80 px-4 backdrop-blur-xl lg:hidden">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Code2 className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">DevTools</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </header>

            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl lg:flex">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs border-r border-white/10 bg-zinc-950 p-0 shadow-xl lg:hidden"
                        >
                            <div className="absolute right-4 top-4">
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
