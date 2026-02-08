import WebSocket from 'ws';
import 'dotenv/config';

const YELLOW_WS_URL = process.env.YELLOW_WS_URL || 'wss://clearnet.yellow.com/ws';

export class YellowClient {
    private ws: WebSocket | null = null;

    constructor() {
        this.connect();
    }

    private connect() {
        this.ws = new WebSocket(YELLOW_WS_URL);

        this.ws.on('open', () => {
            console.log('✅ Connected to Yellow Network Clearnet');
            // Start heartbeat
            this.startHeartbeat();
        });

        this.ws.on('error', (err) => {
            console.error('❌ Yellow WebSocket Error:', err);
        });

        this.ws.on('close', () => {
            console.log('⚠️ Yellow WebSocket Disconnected. Reconnecting...');
            this.stopHeartbeat();
            setTimeout(() => this.connect(), 3000);
        });
    }

    private pingInterval: NodeJS.Timeout | null = null;

    private startHeartbeat() {
        this.stopHeartbeat();
        this.pingInterval = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.ping();
            }
        }, 30000); // Ping every 30s
    }

    private stopHeartbeat() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    // Confirm state channel update off-chain
    public async submitStateUpdate(signedUpdate: any): Promise<void> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('Yellow Network WebSocket is not connected');
        }

        const payload = JSON.stringify({
            jsonrpc: '2.0',
            method: 'state_update', // Assuming standard method name
            params: [signedUpdate],
            id: Date.now()
        });

        this.ws.send(payload);
        console.log('📤 State update submitted to Yellow Network');

        // In a real impl, we would wait for an ack/response here
        // For MVP, we assume submission is fire-and-forget or handled by listeners
    }
}

export const yellowClient = new YellowClient();
