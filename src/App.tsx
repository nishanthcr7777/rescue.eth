import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { WalletConnector } from './components/WalletConnector';
import { SwapModal } from './components/SwapModal';
import { useBalances } from './hooks/useBalances';
import { EnsDisplay } from './components/EnsDisplay';
import { config } from './config/wagmi';
import { useState } from 'react';

const queryClient = new QueryClient();

const AppContent = () => {
    const { ethBalance, usdcBalance, isStranded, isLoading, wrongNetwork } = useBalances();
    const [isSwapOpen, setIsSwapOpen] = useState(false);

    return (
        <div className="relative min-h-screen">
            <div className="bg-glow" />

            {/* Header / Navigation Bar */}
            <header className="sticky top-0 z-40 glass-panel">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-xl font-bold text-white">R</span>
                        </div>
                        <div>
                            <h1 className="text-xl leading-none font-bold">Rescue.eth</h1>
                            <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-bold mt-1">Smart Rescue Primitive</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <EnsDisplay />
                        <WalletConnector />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-12 space-y-8">
                        {/* Welcome Card */}
                        <div className="glass-card rounded-[2rem] p-10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-20 -mt-20" />

                            <div className="relative z-10 max-w-2xl">
                                <h2 className="text-4xl md:text-5xl font-black mb-6">Never stay <span className="text-[hsl(var(--accent))]">stranded</span> again.</h2>
                                <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed mb-8">
                                    Rescue.eth is your ultimate recovery layer. Swap USDC for Gas tokens gaslessly via the Yellow Network when your balance is too low to trade.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => setIsSwapOpen(true)}
                                        className="btn-primary flex items-center gap-3"
                                    >
                                        <span>Initialize Rescue</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button className="btn-ghost">View Explorer</button>
                                </div>
                            </div>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* USDC Balance */}
                            <div className="glass-card rounded-2xl p-6">
                                <p className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-bold mb-4">Rescue Asset</p>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-3xl font-bold">{isLoading ? '---' : usdcBalance}</p>
                                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">USDC Available</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 font-bold text-sm">USDC</div>
                                </div>
                            </div>

                            {/* Gas Balance */}
                            <div className="glass-card rounded-2xl p-6">
                                <p className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-bold mb-4">Gas Tank</p>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-3xl font-bold">{isLoading ? '---' : ethBalance}</p>
                                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">ETH on Base</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white font-black text-sm">Ξ</div>
                                </div>
                            </div>

                            {/* Health Monitor */}
                            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-[hsl(var(--primary))]">
                                <p className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-bold mb-4">Rescue Health</p>
                                <div className="flex items-center gap-4">
                                    {isStranded ? (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-3 w-3 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-red-500">Stranded Detected</p>
                                                <p className="text-xs text-[hsl(var(--muted-foreground))]">Low gas for execution</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                            <div>
                                                <p className="font-bold text-green-500">System Ready</p>
                                                <p className="text-xs text-[hsl(var(--muted-foreground))]">Adequate gas levels</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {wrongNetwork && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-center gap-3">
                                <span className="text-red-500">⚠️</span>
                                <p className="text-sm font-semibold text-red-200">Please switch to <span className="text-white font-bold">Base Sepolia</span> for Smart Rescue.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <SwapModal
                isOpen={isSwapOpen}
                onClose={() => setIsSwapOpen(false)}
            />

            <footer className="mt-auto py-12 border-t border-white/5 opacity-40">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm tracking-widest uppercase font-bold">Built for Nitro Network • Powered by Yellow Sandbox</p>
                </div>
            </footer>
        </div>
    );
};

function App() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <AppContent />
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default App;
