"use server";

export async function checkUrl(url: string, method: string = "GET") {
    try {
        // Validate URL
        new URL(url);

        const startTime = Date.now();
        const res = await fetch(url, {
            method,
            cache: "no-store",
            redirect: "manual" // Don't simplify redirects, show the 301/302
        });
        const endTime = Date.now();

        const headers: Record<string, string> = {};
        res.headers.forEach((v, k) => {
            headers[k] = v;
        });

        return {
            status: res.status,
            statusText: res.statusText,
            duration: endTime - startTime,
            headers,
        };
    } catch (e: any) {
        return { error: e.message || "Failed to fetch URL" };
    }
}
