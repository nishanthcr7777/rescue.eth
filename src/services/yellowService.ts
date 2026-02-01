import { createAppSessionMessage, createSubmitAppStateMessage } from '@erc7824/nitrolite';
import { createConfig, getRoutes } from '@lifi/sdk';
import { Address, Hex } from 'viem';
import { TOKENS } from '../config/tokens';

// Configuration
const YELLOW_CONFIG = {
    wsEndpoint: 'wss://clearnet.yellow.com/ws', // PRODUCTION
    chainId: 8453, // Base Mainnet
    backendSignerAddress: '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf', // Mock Backend Signer Address
    backendUrl: 'http://localhost:3001', // Local Backend
};

// Initialize LI.FI Config
createConfig({
    integrator: 'unstuck.eth',
});

export interface SwapQuote {
    fromToken: string;
    toToken: string;
    fromAmount: string;
    toAmount: string;
    estimatedGas: string;
    route: any; // LI.FI Route
    priceImpact: number;
}

export interface SwapResult {
    success: boolean;
    txHash?: string;
    error?: string;
}

class YellowSwapService {
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;
    private sessionId: string | null = null;
    private sessionActive: boolean = false;

    // Callbacks for message handling
    private messageHandlers = new Set<(data: any) => void>();

    // Initialize Yellow Network connection
    async initialize(): Promise<boolean> {
        if (this.socket && this.isConnected) return true;

        return new Promise((resolve) => {
            try {
                console.log('Connecting to Yellow Network Sandbox:', YELLOW_CONFIG.wsEndpoint);
                this.socket = new WebSocket(YELLOW_CONFIG.wsEndpoint);

                this.socket.onopen = () => {
                    console.log('Connected to Yellow Network');
                    this.isConnected = true;
                    resolve(true);
                };

                this.socket.onmessage = (event) => {
                    this.handleMessage(event.data);
                };

                this.socket.onerror = (error) => {
                    console.error('Yellow Network WebSocket error:', error);
                    this.isConnected = false;
                    resolve(false);
                };

                this.socket.onclose = () => {
                    console.log('Disconnected from Yellow Network');
                    this.isConnected = false;
                    this.socket = null;
                    this.sessionActive = false;
                };
            } catch (error) {
                console.error('Failed to connect:', error);
                resolve(false);
            }
        });
    }

    // Handle incoming messages
    private handleMessage(data: any) {
        try {
            console.log('WS Message Received:', data.toString());
            const parsed = JSON.parse(data.toString());

            // Invoke all registered handlers
            this.messageHandlers.forEach(handler => handler(parsed));

        } catch (error) {
            console.error('Error handling message:', error);
        }
    }



    // Create a Yellow Network Session
    async createSession(userAddress: string, signer: any, allocationAmount: string = '0'): Promise<string | null> {
        try {
            await this.initialize();

            console.log('Creating Yellow Session for:', userAddress);

            // Prepare Session Data
            const sessionData = {
                definition: {
                    protocol: 'payment-app-v1',
                    // Correct Participants: User + Backend Signer (Counterparty)
                    participants: [userAddress as Address, YELLOW_CONFIG.backendSignerAddress as Address],
                    weights: [1, 1],
                    quorum: 2,
                    challenge: 0,
                    nonce: Date.now()
                },
                // Initial Allocation: User deposits funds into the channel
                allocations: [
                    {
                        participant: userAddress as Address,
                        asset: TOKENS.USDC.address as Address,
                        amount: allocationAmount, // Initial deposit logic needs to be handled by caller or assumed
                    }
                ]
            };

            // Wrap Signer
            const messageSigner = async (payload: any) => {
                const message = JSON.stringify(payload);
                return await signer(message);
            };

            // 3. Create Session Message
            const requestId = Date.now();
            const sessionMessage = await createAppSessionMessage(
                messageSigner,
                {
                    appDefinition: sessionData.definition as any,
                    allocations: sessionData.allocations as any, // Include allocations in creation
                } as any,
                requestId
            );

            console.log('Session Message Created:', JSON.stringify(sessionMessage));

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                console.log('Sending WS Message:', JSON.stringify(sessionMessage));
                this.socket.send(JSON.stringify(sessionMessage));

                // Wait for response
                return new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Session creation timed out'));
                    }, 30000);

                    const handler = (data: any) => {
                        // Assuming the response contains a sessionId or confirmation
                        // This is a placeholder for actual Yellow Network response parsing
                        if (data && data.type === 'session_created' && data.sessionId) {
                            clearTimeout(timeout);
                            this.messageHandlers.delete(handler); // Clean up handler
                            this.sessionId = data.sessionId;
                            this.sessionActive = true;
                            console.log('Yellow Session Established:', this.sessionId);
                            resolve(this.sessionId);
                        } else if (data && data.type === 'error') {
                            clearTimeout(timeout);
                            this.messageHandlers.delete(handler);
                            reject(new Error(`Session creation failed: ${data.message}`));
                        }
                    };
                    this.messageHandlers.add(handler);
                });
            } else {
                throw new Error('WebSocket not connected');
            }

        } catch (error) {
            console.error('Failed to create session:', error);
            this.sessionActive = false;
            return null;
        }
    }

    // Get Swap Quote from LI.FI
    async getSwapQuote(
        fromToken: string,
        toToken: string,
        amount: string
    ): Promise<SwapQuote | null> {
        try {
            console.log('Getting LI.FI Quote...');
            const routes = await getRoutes({
                fromChainId: YELLOW_CONFIG.chainId,
                toChainId: YELLOW_CONFIG.chainId,
                fromTokenAddress: fromToken,
                toTokenAddress: toToken,
                fromAmount: amount, // Raw amount
                options: {
                    slippage: 0.005, // 0.5%
                }
            });

            if (!routes.routes.length) {
                console.warn('No routes found via LI.FI');
                return null;
            }

            const route = routes.routes[0];
            const toAmount = route.toAmount;

            return {
                fromToken,
                toToken,
                fromAmount: amount,
                toAmount,
                estimatedGas: route.gasCostUSD || '0',
                route: route,
                priceImpact: 0 // LI.FI usually provides this in details
            };

        } catch (error) {
            console.error('Failed to get LI.FI quote:', error);
            return null;
        }
    }

    // Execute Gasless Swap via Backend
    async executeSwap(
        quote: SwapQuote,
        userAddress: string,
        signer: any
    ): Promise<SwapResult> {
        try {
            console.log('User Address for swap:', userAddress);
            if (!this.sessionActive) {
                throw new Error('Session not active. Call createSession first.');
            }

            console.log('Preparing Gasless Transaction...');

            const transactionRequest = quote.route.steps[0].transactionRequest;
            if (!transactionRequest) throw new Error('No transaction request in LI.FI route');

            // Construct intent for backend execution
            const intentData = JSON.stringify({
                type: 'execute_swap',
                routeId: quote.route.id,
                sessionId: this.sessionId,
            });

            const stateUpdate = {
                intent: 0, // OPERATE
                version: BigInt(Date.now()),
                data: intentData as unknown as Hex, // Sending intent as data
                to: YELLOW_CONFIG.backendSignerAddress as Address, // Target is Backend
                value: BigInt(0),
                allocations: [
                    // Allocations would be updated here in a full implementation
                ],
                sigs: []
            };

            console.log('Wrapping TX in Yellow Transport:', stateUpdate);

            // User signs the state update authorizing the swap
            const messageSigner = async (payload: any) => {
                const message = JSON.stringify(payload);
                return await signer(message);
            };

            const requestId = Date.now();
            const appSessionId = '0x0000000000000000000000000000000000000000' as Hex;

            const signedUpdateMessage = await createSubmitAppStateMessage(
                messageSigner,
                {
                    appSessionId,
                    status: 1, // Active
                    ...stateUpdate
                } as any,
                requestId
            );

            console.log('Sending to Backend:', signedUpdateMessage);

            const response = await fetch(`${YELLOW_CONFIG.backendUrl}/execute-swap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    userAddress,
                    signedStateUpdate: signedUpdateMessage,
                    lifiRoute: quote.route
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Backend swap execution failed');
            }

            const result = await response.json();

            // 5. Result
            return {
                success: true,
                txHash: result.txHash
            };

        } catch (error) {
            console.error('Swap execution failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Swap failed'
            };
        }
    }

    /**
     * Close the gasless session
     */
    async closeSession(): Promise<void> {
        this.sessionActive = false;
        this.sessionId = null;
    }

    /**
     * Check if gasless swap is available
     */
    isGaslessAvailable(fromToken: string, toToken: string): boolean {
        // Base Mainnet USDC -> ETH/WETH
        return (
            YELLOW_CONFIG.chainId === 8453 &&
            fromToken.toLowerCase() === '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'.toLowerCase() &&
            (toToken.toLowerCase() === '0x4200000000000000000000000000000000000006'.toLowerCase() ||
                toToken === '0x0000000000000000000000000000000000000000')
        );
    }
}

export const yellowSwapService = new YellowSwapService();
