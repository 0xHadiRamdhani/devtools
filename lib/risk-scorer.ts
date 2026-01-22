
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface RiskScore {
    score: number; // 0-10
    severity: Severity;
    color: string;
    label: string;
}

export interface OWASPReference {
    id: string; // e.g., "A01:2021"
    name: string;
    description: string;
    url: string;
}

export const OWASP_TOP_10_2021: Record<string, OWASPReference> = {
    'A01': {
        id: 'A01:2021',
        name: 'Broken Access Control',
        description: 'Access control enforces policy such that users cannot act outside of their intended permissions.',
        url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'
    },
    'A02': {
        id: 'A02:2021',
        name: 'Cryptographic Failures',
        description: 'Failures related to cryptography, which often leads to sensitive data exposure or system compromise.',
        url: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/'
    },
    'A03': {
        id: 'A03:2021',
        name: 'Injection',
        description: 'Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query.',
        url: 'https://owasp.org/Top10/A03_2021-Injection/'
    },
    'A04': {
        id: 'A04:2021',
        name: 'Insecure Design',
        description: 'Insecure design allows attackers to identify and exploit design flaws.',
        url: 'https://owasp.org/Top10/A04_2021-Insecure_Design/'
    },
    'A05': {
        id: 'A05:2021',
        name: 'Security Misconfiguration',
        description: 'Security misconfiguration is the most commonly seen issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.',
        url: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
    },
    'A07': {
        id: 'A07:2021',
        name: 'Identification and Authentication Failures',
        description: 'Confirmation of the user\'s identity, authentication, and session management is critical to protect against authentication-related attacks.',
        url: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'
    }
};

export function calculateRisk(severity: Severity): RiskScore {
    switch (severity) {
        case 'CRITICAL':
            return { score: 10, severity: 'CRITICAL', color: 'text-red-600 bg-red-600/10', label: 'Critical Risk' };
        case 'HIGH':
            return { score: 8, severity: 'HIGH', color: 'text-orange-500 bg-orange-500/10', label: 'High Risk' };
        case 'MEDIUM':
            return { score: 5, severity: 'MEDIUM', color: 'text-yellow-500 bg-yellow-500/10', label: 'Medium Risk' };
        case 'LOW':
            return { score: 2, severity: 'LOW', color: 'text-blue-500 bg-blue-500/10', label: 'Low Risk' };
        case 'INFO':
        default:
            return { score: 0, severity: 'INFO', color: 'text-zinc-500 bg-zinc-500/10', label: 'Informational' };
    }
}

export function getOWASPReference(shortId: string): OWASPReference | undefined {
    return OWASP_TOP_10_2021[shortId];
}
