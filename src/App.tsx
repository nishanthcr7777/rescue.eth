import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { WalletConnector } from './components/WalletConnector';
import { BalanceDetector } from './components/BalanceDetector';
import { useBalances } from './hooks/useBalances';
import { config } from './config/wagmi';

const queryClient = new QueryClient();

function AppContent() {
    const { isConnected } = useBalances();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <nav className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    <h1 className="text-xl font-bold text-gray-900">rescue.eth</h1>
                </div>
                <WalletConnector />
            </nav>

            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
                {isConnected ? (
                    <div className="w-full max-w-4xl px-6">
                        <BalanceDetector />
                    </div>
                ) : (
                    <div className="text-center max-w-2xl px-6">
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">
                            Turn being gasless into an opportunity
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Three gasless rescue options for stranded tokens on Base
                        </p>
                        <div className="flex gap-4 justify-center text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Wallet connection ✅</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Balance detection ✅</span>
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="text-gray-500">Connect your wallet to get started</p>
                        </div>
                    </div>
                )}
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
