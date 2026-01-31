import { useBalances } from '../hooks/useBalances';

export function BalanceDetector() {
    const { isConnected, ethBalance, usdcBalance, isStranded, isLoading, wrongNetwork } = useBalances();

    if (!isConnected) {
        return null;
    }

    if (wrongNetwork) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="font-semibold text-red-900">Wrong Network</p>
                            <p className="text-sm text-red-700 mt-1">
                                Please switch to Base Mainnet in your wallet
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Balance on Base</h3>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">USDC</span>
                    <span className="font-mono font-semibold text-gray-900">
                        {parseFloat(usdcBalance).toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600">ETH</span>
                    <span className="font-mono font-semibold text-gray-900">
                        {parseFloat(ethBalance).toFixed(6)}
                    </span>
                </div>
            </div>

            {isStranded && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="font-semibold text-yellow-900">You're stranded!</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                You have USDC but no ETH for gas. Let's rescue your tokens!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
