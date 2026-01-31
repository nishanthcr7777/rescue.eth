// Token addresses on Base Mainnet
export const TOKENS = {
    USDC: {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
        symbol: 'USDC',
        decimals: 6,
        name: 'USD Coin'
    },
    WETH: {
        address: '0x4200000000000000000000000000000000000006' as `0x${string}`,
        symbol: 'WETH',
        decimals: 18,
        name: 'Wrapped Ether'
    }
} as const;
