import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { yellowSwapService, SwapQuote } from '../services/yellowService';
import { TOKENS } from '../config/tokens';

export function useYellowSwap() {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [quote, setQuote] = useState<SwapQuote | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Create a gasless session
     */
    const createSession = async () => {
        if (!address || !walletClient) {
            setError('Wallet not connected');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Create signer function for Nitrolite
            const signer = async (message: string) => {
                return await walletClient.signMessage({ message });
            };

            const session = await yellowSwapService.createSession(address, signer);

            if (session) {
                setSessionId(session);
            } else {
                throw new Error('Failed to create session');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create session');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Get a swap quote
     */
    const getQuote = async (usdcAmount: string) => {
        if (!address) {
            setError('Wallet not connected');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const swapQuote = await yellowSwapService.getSwapQuote(
                TOKENS.USDC.address,
                '0x0000000000000000000000000000000000000000', // ETH
                usdcAmount
            );

            if (swapQuote) {
                setQuote(swapQuote);
            } else {
                throw new Error('Failed to get quote');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get quote');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Execute the swap
     */
    const executeSwap = async () => {
        if (!quote || !address || !walletClient) {
            setError('Missing required data');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Create signer function
            const signer = async (message: string) => {
                return await walletClient.signMessage({ message });
            };

            const result = await yellowSwapService.executeSwap(quote, address, signer);

            if (result.success) {
                return result.txHash;
            } else {
                throw new Error(result.error || 'Swap failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Swap execution failed');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Close the session
     */
    const closeSession = async () => {
        await yellowSwapService.closeSession();
        setSessionId(null);
        setQuote(null);
    };

    return {
        sessionId,
        quote,
        isLoading,
        error,
        createSession,
        getQuote,
        executeSwap,
        closeSession,
    };
}
