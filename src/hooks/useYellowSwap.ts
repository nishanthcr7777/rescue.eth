import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { yellowSwapService, SwapQuote } from '../services/yellowService'
import { TOKENS } from '../config/tokens'

export function useYellowSwap() {
    const { address } = useAccount()
    const { data: walletClient } = useWalletClient()

    const [sessionId, setSessionId] = useState<string | null>(null)
    const [quote, setQuote] = useState<SwapQuote | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Create a Nitro gasless session
     */
    const createSession = async () => {
        if (!address || !walletClient) {
            setError('Wallet not connected')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const session = await yellowSwapService.createSession(address, walletClient)

            if (!session) throw new Error('Failed to create session')

            setSessionId(session)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create session')
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Get LI.FI quote
     */
    const getQuote = async (usdcAmount: string) => {
        if (!address) {
            setError('Wallet not connected')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const swapQuote = await yellowSwapService.getSwapQuote(
                TOKENS.USDC.address,
                '0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', // LI.FI Native Token address
                usdcAmount
            )

            if (!swapQuote) throw new Error('No route found')

            setQuote(swapQuote)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get quote')
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Execute gasless swap
     */
    const executeSwap = async () => {
        if (!quote || !address || !walletClient) {
            setError('Missing required data')
            return null
        }

        setIsLoading(true)
        setError(null)

        try {
            let activeSessionId = sessionId

            // Auto-create session if missing
            if (!activeSessionId) {
                activeSessionId = await yellowSwapService.createSession(address, walletClient)
                if (!activeSessionId) throw new Error('Failed to create session')
                setSessionId(activeSessionId)
            }

            const result = await yellowSwapService.executeSwap(
                quote,
                address,
                walletClient
            )

            if (!result.success) throw new Error(result.error || 'Swap failed')

            return result.txHash || null
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Swap execution failed')
            return null
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Close Nitro session
     */
    const closeSession = async () => {
        yellowSwapService.closeSession()
        setSessionId(null)
        setQuote(null)
    }

    return {
        sessionId,
        quote,
        isLoading,
        error,
        createSession,
        getQuote,
        executeSwap,
        closeSession,
    }
}
