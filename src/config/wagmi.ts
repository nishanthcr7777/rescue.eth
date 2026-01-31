import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect project ID
const projectId = ((import.meta as any).env?.VITE_WALLETCONNECT_PROJECT_ID as string) || 'demo-project-id';

// Try multiple RPC URLs for Base Mainnet
const baseRpcUrls = [
    'https://mainnet.base.org',
    'https://base.llamarpc.com',
    'https://base-mainnet.public.blastapi.io'
];

export const config = createConfig({
    chains: [base],
    connectors: [
        injected(),
        walletConnect({ projectId }),
    ],
    transports: {
        [base.id]: http(baseRpcUrls[0], {
            batch: true,
            retryCount: 3,
        })
    },
});
