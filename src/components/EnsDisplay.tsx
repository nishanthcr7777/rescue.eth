import { useAccount, useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export function EnsDisplay() {
    const { address, isConnected } = useAccount();
    const { data: ensName } = useEnsName({
        address,
        chainId: mainnet.id,
    });

    if (!isConnected || !ensName) return null;

    return (
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm transition-all hover:border-[hsl(var(--accent))]/50 group">
            <span className="text-[10px] font-black text-[hsl(var(--accent))] uppercase tracking-[0.2em] bg-[hsl(var(--accent))]/10 px-2 py-0.5 rounded-md group-hover:bg-[hsl(var(--accent))]/20 transition-colors">ENS</span>
            <span className="text-sm font-bold font-outfit text-white tracking-tight">{ensName}</span>
        </div>
    );
}
