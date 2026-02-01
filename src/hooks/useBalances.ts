import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { TOKENS } from '../config/tokens';
import { formatUnits, createPublicClient, http } from 'viem';
import { base } from 'wagmi/chains';

// Create a public client for direct RPC calls
const publicClient = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
});

// ERC20 ABI for balanceOf
const erc20Abi = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export function useBalances() {
    const { address, isConnected, chain } = useAccount();

    const [ethBalance, setEthBalance] = useState('0');
    const [usdcBalance, setUsdcBalance] = useState('0');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!address || !isConnected) {
            setEthBalance('0');
            setUsdcBalance('0');
            return;
        }

        const fetchBalances = async () => {
            setIsLoading(true);
            try {
                // Fetch ETH balance
                const ethBal = await publicClient.getBalance({ address });
                const ethFormatted = formatUnits(ethBal, 18);
                setEthBalance(ethFormatted);

                // Fetch USDC balance
                const usdcBal = await publicClient.readContract({
                    address: TOKENS.USDC.address,
                    abi: erc20Abi,
                    functionName: 'balanceOf',
                    args: [address],
                });
                const usdcFormatted = formatUnits(usdcBal, 6);
                setUsdcBalance(usdcFormatted);

                console.log('Balance Fetched:', {
                    address,
                    ethRaw: ethBal.toString(),
                    ethFormatted,
                    usdcRaw: usdcBal.toString(),
                    usdcFormatted,
                });
            } catch (error) {
                console.error('Balance fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalances();

        // Refresh every 30 seconds instead of every block
        const interval = setInterval(fetchBalances, 30000);
        return () => clearInterval(interval);
    }, [address, isConnected]);

    // Detect stranded state: has USDC but low ETH (< 0.001 ETH, approx $2.50)
    // Modified for testing: allow 0 USDC to test flow
    const isStranded =
        isConnected &&
        !isLoading &&
        // parseFloat(usdcBalance) > 0 &&
        parseFloat(ethBalance) < 0.001;

    return {
        address,
        isConnected,
        ethBalance,
        usdcBalance,
        isStranded,
        isLoading,
        wrongNetwork: chain?.id !== base.id,
    };
}
