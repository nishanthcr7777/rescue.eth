import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from '@reown/appkit/networks';

// 1. Get Project ID
export const projectId = ((import.meta as any).env?.VITE_WALLETCONNECT_PROJECT_ID as string) || '66185202613c77eb71131154f67c69f2'; // Using a public testing ID if missing

// 2. Set Chains
export const networks = [base];

// 3. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
    ssr: true,
    networks,
    projectId
});

// 4. Create Modal
createAppKit({
    // @ts-ignore - Type mismatch due to peer deps
    adapters: [wagmiAdapter],
    // @ts-ignore - Type mismatch due to peer deps
    networks,
    projectId,
    features: {
        analytics: true
    }
});

export const config = wagmiAdapter.wagmiConfig;
