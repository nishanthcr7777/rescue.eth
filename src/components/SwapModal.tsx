import { useState } from 'react';
import { useYellowSwap } from '../hooks/useYellowSwap';
import { formatUnits } from 'viem';

interface SwapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SwapModal({ isOpen, onClose }: SwapModalProps) {
    const { quote, isLoading, error, getQuote, executeSwap } = useYellowSwap();
    const [swapAmount, setSwapAmount] = useState('5'); // Default 5 USDC
    const [txHash, setTxHash] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGetQuote = async () => {
        const amountInWei = (parseFloat(swapAmount) * 1e6).toString(); // USDC has 6 decimals
        await getQuote(amountInWei);
    };

    const handleExecuteSwap = async () => {
        const hash = await executeSwap();
        if (hash) {
            setTxHash(hash);
        }
    };

    const handleClose = () => {
        setSwapAmount('5');
        setTxHash(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Get Gas</h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Success State */}
                {txHash ? (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <p className="font-semibold text-green-900">Swap Successful!</p>
                                    <p className="text-sm text-green-700 mt-1 break-all">
                                        {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <a
                            href={`https://sepolia.basescan.org/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center text-blue-600 hover:underline"
                        >
                            View on BaseScan →
                        </a>
                        <button
                            onClick={handleClose}
                            className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Amount Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (USDC)
                            </label>
                            <input
                                type="number"
                                value={swapAmount}
                                onChange={(e) => setSwapAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="5"
                                min="1"
                                max="1000"
                            />
                        </div>

                        {/* Quote Display */}
                        {quote && (
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">You pay:</span>
                                    <span className="font-semibold">{swapAmount} USDC</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">You receive:</span>
                                    <span className="font-semibold">
                                        {parseFloat(formatUnits(BigInt(quote.toAmount), 18)).toFixed(6)} ETH
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Gas fee:</span>
                                    <span className="font-semibold text-green-600">FREE ✨</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Route:</span>
                                    <span className="text-gray-500">{quote.route.steps.length} steps</span>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {!quote ? (
                            <button
                                onClick={handleGetQuote}
                                disabled={isLoading || !swapAmount}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                            >
                                {isLoading ? 'Getting Quote...' : 'Get Quote'}
                            </button>
                        ) : (
                            <button
                                onClick={handleExecuteSwap}
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
                            >
                                {isLoading ? 'Executing...' : 'Execute Swap'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
