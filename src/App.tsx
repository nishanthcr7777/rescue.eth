import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { WalletConnector } from './components/WalletConnector';

const config = getDefaultConfig({
    appName: 'Smart Rescue',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
    chains: [base],
});

const queryClient = new QueryClient();

function App() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                        <nav className="p-6 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🚀</span>
                                <h1 className="text-xl font-bold text-gray-900">Smart Rescue</h1>
                            </div>
                            <WalletConnector />
                        </nav>

                        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
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
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                        <span>Balance detection (next)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default App;
