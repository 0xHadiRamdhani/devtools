"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Braces,
    Code2,
    FileJson,
    Globe,
    KeyRound,
    LayoutDashboard,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tools/json-formatter", label: "JSON Formatter", icon: FileJson },
    { href: "/tools/base64", label: "Base64 Converter", icon: Code2 },
    { href: "/tools/jwt-decoder", label: "JWT Decoder", icon: KeyRound },
    { href: "/tools/regex-tester", label: "Regex Tester", icon: Braces },
    { href: "/tools/http-status", label: "HTTP Status", icon: Globe },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close mobile menu on path change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const SidebarContent = () => (
        <div className="flex h-full flex-col px-4 py-8">
            <div className="mb-10 flex items-center gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Code2 className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                    DevTools
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
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
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto px-2">
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
