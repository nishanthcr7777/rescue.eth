import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { WalletConnector } from './components/WalletConnector';
import { SwapModal } from './components/SwapModal';
import { useBalances } from './hooks/useBalances';
import { config } from './config/wagmi';
import { useState } from 'react';

const queryClient = new QueryClient();

function AppContent() {
    const { isConnected, ethBalance, usdcBalance, isStranded } = useBalances();
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🚀</span>
                        <h1 className="text-xl font-bold text-gray-900">rescue.eth</h1>
                    </div>
                    <WalletConnector />
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {!isConnected ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">⛓️</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Stuck with tokens?
                        </h2>
                        <p className="text-lg text-gray-600">
                            No gas? No problem. Connect your wallet to rescue your stranded tokens.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Balance Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Your Balance on Base</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">USDC</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${parseFloat(usdcBalance).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">ETH</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        {parseFloat(ethBalance).toFixed(6)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stranded Alert */}
                        {isStranded && (
                            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-yellow-900 mb-1">
                                            You're stranded!
                                        </h3>
                                        <p className="text-yellow-800">
                                            You have USDC but no ETH for gas. Choose a rescue option below.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rescue Options */}
                        {isStranded && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Rescue Options</h3>

                                <div className="space-y-3">
                                    {/* Get Gas */}
                                    <button
                                        onClick={() => setIsSwapModalOpen(true)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 text-left transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">⛽</span>
                                            <div className="flex-1">
                                                <h4 className="font-semibold">Get Gas</h4>
                                                <p className="text-sm text-blue-100">
                                                    Swap USDC → ETH without gas fees
                                                </p>
                                            </div>
                                            <span className="text-xl">→</span>
                                        </div>
                                    </button>

                                    {/* Bridge */}
                                    <div className="w-full bg-gray-100 rounded-lg p-4 text-left opacity-60 cursor-not-allowed">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🌉</span>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-700">Bridge</h4>
                                                <p className="text-sm text-gray-500">Coming soon...</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Send */}
                                    <div className="w-full bg-gray-100 rounded-lg p-4 text-left opacity-60 cursor-not-allowed">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📤</span>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-700">Send</h4>
                                                <p className="text-sm text-gray-500">Coming soon...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Swap Modal */}
                <SwapModal
                    isOpen={isSwapModalOpen}
                    onClose={() => setIsSwapModalOpen(false)}
                />
            </div>
        </div>
    );
}

function App() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <AppContent />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default App;
