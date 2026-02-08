import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { signYellowMessage, backendAddress } from './signer';
import { yellowClient } from './yellowClient';
import { lifiExecutor } from './lifiExecutor';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', backendAddress });
});

// Root route for connectivity check
app.get('/', (req, res) => {
    res.send('Yellow Connect Backend Running 🚀');
});

// Orchestrate gasless swap flow
app.post('/execute-swap', async (req, res) => {
    try {
        const { sessionId, userAddress, signedStateUpdate, lifiRoute } = req.body;

        if (!sessionId || !userAddress || !signedStateUpdate || !lifiRoute) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log(`📥 Received Swap Request for Session: ${sessionId}`);

        // Validate route integrity
        if (!lifiExecutor.validateRoute(lifiRoute)) {
            return res.status(400).json({ error: 'Invalid LI.FI route' });
        }

        // Co-sign as counterparty
        const backendSignature = await signYellowMessage(JSON.stringify(signedStateUpdate));

        const fullySignedUpdate = {
            ...signedStateUpdate,
            backendSignature
        };

        // Submit to network & execute on-chain
        await yellowClient.submitStateUpdate(fullySignedUpdate);
        const txHash = await lifiExecutor.executeSwap(lifiRoute);

        res.json({
            success: true,
            sessionId,
            txHash,
            message: 'Swap executed successfully'
        });

    } catch (error: any) {
        console.error('❌ Swap Processing Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Yellow Connect Backend running on http://localhost:${PORT}`);
    console.log(`🔑 Backend Signer: ${backendAddress}`);
});
