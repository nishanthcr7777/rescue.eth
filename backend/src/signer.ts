import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import 'dotenv/config';

if (!process.env.BACKEND_PRIVATE_KEY) {
    throw new Error('BACKEND_PRIVATE_KEY is missing in .env');
}

// Create account from private key
const account = privateKeyToAccount(process.env.BACKEND_PRIVATE_KEY as `0x${string}`);

// Create wallet client for signing
export const backendWallet = createWalletClient({
    account,
    chain: mainnet,
    transport: http()
});

// Used for Yellow protocol signatures
export async function signYellowMessage(message: string): Promise<`0x${string}`> {
    return account.signMessage({ message });
}

export const backendAddress = account.address;
