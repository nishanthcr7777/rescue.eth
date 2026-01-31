// Base Mainnet configuration
export const BASE_MAINNET = {
    id: 8453,
    name: 'Base Mainnet',
    network: 'base',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: {
        default: { http: ['https://mainnet.base.org'] },
        public: { http: ['https://mainnet.base.org'] }
    },
    blockExplorers: {
        default: {
            name: 'Basescan',
            url: 'https://basescan.org'
        }
    }
} as const;
