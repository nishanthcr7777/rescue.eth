// Token addresses on Base Sepolia Testnet
export const TOKENS = {
    USDC: {
        address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`, // Base Sepolia USDC
        symbol: 'USDC',
        decimals: 6,
        name: 'USD Coin'
    },
    WETH: {
        address: '0x4200000000000000000000000000000000000006' as `0x${string}`, // WETH is usually the same on L2 testnets
        symbol: 'WETH',
        decimals: 18,
        name: 'Wrapped Ether'
    },
    YTEST: {
        address: '0xDB9F293e3898c9E5536A3be1b0C56c89d2b32DEb' as `0x${string}`, // Yellow Test Token from assets log
        symbol: 'ytest.usd',
        decimals: 6,
        name: 'Yellow Test USD'
    }
} as const;
