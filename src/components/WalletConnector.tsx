import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletConnector() {
    return (
        <ConnectButton
            chainStatus="icon"
            showBalance={false}
        />
    );
}
