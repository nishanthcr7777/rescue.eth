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
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">ENS</span>
            <span className="text-sm font-semibold text-blue-900">{ensName}</span>
        </div>
    );
}
