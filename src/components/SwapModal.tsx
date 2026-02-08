import { useState } from 'react';
import { useYellowSwap } from '../hooks/useYellowSwap';
import { formatUnits } from 'viem';

interface SwapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SwapModal({ isOpen, onClose }: SwapModalProps) {
    const { quote, isLoading, error, getQuote, executeSwap } = useYellowSwap();
    const [swapAmount, setSwapAmount] = useState('5');
    const [txHash, setTxHash] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGetQuote = async () => {
        const amountInWei = (parseFloat(swapAmount) * 1e6).toString();
        await getQuote(amountInWei);
    };

    const handleExecuteSwap = async () => {
        const hash = await executeSwap();
        if (hash) setTxHash(hash);
    };

    const handleClose = () => {
        setSwapAmount('5');
        setTxHash(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className="glass-card w-full max-w-lg rounded-[2.5rem] p-1 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-[hsl(var(--background))]/40 rounded-[2.4rem] p-8 space-y-8">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black font-outfit">Emergency Rescue</h3>
                                <p className="text-xs text-[hsl(var(--muted-foreground))] font-bold uppercase tracking-widest">Powered by Yellow Network</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white transition-all active:scale-90"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {txHash ? (
                        <div className="space-y-6 text-center py-8">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4 border border-green-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold mb-2">Rescue Complete</h4>
                                <p className="text-[hsl(var(--muted-foreground))]">Gas tokens are on their way to your wallet.</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 break-all text-sm font-mono text-[hsl(var(--accent))]">
                                {txHash}
                            </div>
                            <div className="flex flex-col gap-3 pt-4">
                                <a
                                    href={`https://sepolia.basescan.org/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                >
                                    View on Explorer
                                </a>
                                <button onClick={handleClose} className="btn-ghost">Close Window</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Input Group */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-end mb-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Amount to Rescue</label>
                                        <span className="text-[10px] text-[hsl(var(--accent))] font-black uppercase tracking-tighter bg-[hsl(var(--accent))]/10 px-2 py-0.5 rounded-full">No Gas Fee</span>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            value={swapAmount}
                                            onChange={(e) => setSwapAmount(e.target.value)}
                                            className="input-field pr-20 text-xl font-bold"
                                            placeholder="5"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-sm text-[hsl(var(--muted-foreground))]">USDC</div>
                                    </div>
                                </div>

                                {quote && (
                                    <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                            <span className="text-sm text-[hsl(var(--muted-foreground))] font-medium">Estimated Return</span>
                                            <div className="text-right">
                                                <div className="text-lg font-black text-white">
                                                    {parseFloat(formatUnits(BigInt(quote.toAmount), 18)).toFixed(6)} ETH
                                                </div>
                                                <div className="text-[10px] text-[hsl(var(--muted-foreground))] font-bold uppercase">Gas Tank Contribution</div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[hsl(var(--muted-foreground))]">Protocol Fee</span>
                                                <span className="text-green-500 font-bold tracking-widest uppercase italic">Sponsored ✨</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[hsl(var(--muted-foreground))]">LIFI Efficiency</span>
                                                <span className="text-white font-bold tracking-tight">Best Route Locked</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-200 text-sm">
                                        <span>⚠️</span>
                                        <p>{error}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {!quote ? (
                                <button
                                    onClick={handleGetQuote}
                                    disabled={isLoading || !swapAmount}
                                    className="btn-primary w-full py-5 text-lg"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Analyzing Routes...</span>
                                        </div>
                                    ) : 'Lock Rescue Route'}
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        onClick={handleExecuteSwap}
                                        disabled={isLoading}
                                        className="btn-secondary w-full py-5 text-lg shadow-[0_0_20px_hsla(var(--secondary),0.3)]"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-5 h-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                                                <span>Signing Transaction...</span>
                                            </div>
                                        ) : 'Commit Emergency Swap'}
                                    </button>
                                    <p className="text-center text-[10px] text-[hsl(var(--muted-foreground))] font-medium uppercase tracking-widest">You will sign a gasless EIP-712 message</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
