import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect project ID (get from https://cloud.walletconnect.com)
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
    chains: [base],
    connectors: [
        injected(),
        walletConnect({ projectId }),
    ],
    transports: {
        [base.id]: http()
    },
});
