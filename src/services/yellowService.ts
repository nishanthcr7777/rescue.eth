import {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createEIP712AuthMessageSigner,
  createAppSessionMessage,
  createSubmitAppStateMessage,
  type MessageSigner,
  type RPCAppDefinition,
  type RPCAppSessionAllocation,
  RPCMethod,
} from '@erc7824/nitrolite'

import { createConfig } from '@lifi/sdk'
import { Address, toHex } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { TOKENS } from '../config/tokens'

/* -------------------------------------------------- */
/* CONFIG                                              */
/* -------------------------------------------------- */

const YELLOW_CONFIG = {
  wsEndpoint: 'wss://clearnet-sandbox.yellow.com/ws', // Corrected Sandbox WebSocket
  chainId: 8453,
  backendSignerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Hardcoded for demo/sandbox
  backendUrl: 'http://localhost:3001',
}

createConfig({ integrator: 'unstuck.eth' })

/* -------------------------------------------------- */
/* TYPES                                               */
/* -------------------------------------------------- */

interface AppSession {
  definition: RPCAppDefinition
  allocations: RPCAppSessionAllocation[]
}

export interface SwapQuote {
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  estimatedGas: string
  route: any
  priceImpact: number
}

export interface SwapResult {
  success: boolean
  txHash?: string
  error?: string
}

/* -------------------------------------------------- */
/* SERVICE                                             */
/* -------------------------------------------------- */

class YellowSwapService {
  private socket: WebSocket | null = null
  private isAuthenticated = false
  private sessionId: string | null = null
  private sessionActive = false
  private localSessionAccount: any = null

  /* -------------------------------------------------- */
  /* CONNECTION                                         */
  /* -------------------------------------------------- */

  async initialize(): Promise<boolean> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return true

    return new Promise(resolve => {
      this.socket = new WebSocket(YELLOW_CONFIG.wsEndpoint)

      this.socket.onopen = () => {
        console.log('🟢 Connected to Yellow')
        resolve(true)
      }

      this.socket.onerror = err => {
        console.error('🔴 Yellow WS Error', err)
        resolve(false)
      }

      this.socket.onclose = () => {
        console.log('🔌 Yellow Disconnected')
        this.isAuthenticated = false
        this.sessionActive = false
      }
    })
  }

  /* -------------------------------------------------- */
  /* AUTHENTICATION                                     */
  /* -------------------------------------------------- */
  private async authenticate(userAddress: string, walletClient: any) {
    if (this.isAuthenticated) return true
    if (!this.socket) throw new Error("No WebSocket")

    console.log('🔐 Starting Yellow Authentication')

    const sessionPk = generatePrivateKey()
    this.localSessionAccount = privateKeyToAccount(sessionPk)

    const expireTimestamp = Math.floor(Date.now() / 1000) + 3600

    // 🔹 RPC AUTH REQUEST PARAMS (sent over WS)
    const rpcAuthParams = {
      scope: 'user',
      application: userAddress as Address,
      participant: userAddress as Address,
      session_key: this.localSessionAccount.address as Address,
      expire: String(expireTimestamp), // STRING for RPC
      allowances: [],
    }

    const requestId = Date.now()
    const authReq = await createAuthRequestMessage(rpcAuthParams as any, requestId)
    this.socket.send(authReq)

    const rawChallenge = await this.waitFor('auth_challenge')

    // 🔹 EIP-712 SIGNING PARAMS (DIFFERENT SHAPE)
    const eip712AuthParams = {
      scope: 'user',
      application: userAddress as Address,
      participant: userAddress as Address,
      session_key: this.localSessionAccount.address as Address,
      expires_at: BigInt(expireTimestamp), // BigInt REQUIRED
      allowances: [],
    }

    const challenge = {
      method: RPCMethod.AuthChallenge,
      params: { challengeMessage: rawChallenge.challenge_message },
    } as const

    const chainId = await walletClient.getChainId()
    if (chainId !== YELLOW_CONFIG.chainId) {
      await walletClient.switchChain({ id: YELLOW_CONFIG.chainId })
    }

    const domain = {
      name: 'Nitro Auth',
      version: '1',
      chainId: 8453,
      verifyingContract: '0x0000000000000000000000000000000000000000' as Address,
    }

    const signer = createEIP712AuthMessageSigner(
      walletClient,
      eip712AuthParams as any,
      domain
    )

    const verifyMsg = await createAuthVerifyMessage(
      signer,
      challenge,
      requestId
    )

    this.socket.send(verifyMsg)

    await this.waitFor('auth_verify')

    console.log("✅ Yellow Auth Success")
    this.isAuthenticated = true
    return true
  }


  /* -------------------------------------------------- */
  /* WAIT HELPER                                        */
  /* -------------------------------------------------- */

  private waitFor(expectedMethod: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error('No WebSocket'))

      const handler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data)
          console.log(`📨 [Yellow WS] Received Message for ${expectedMethod}:`, JSON.stringify(data, null, 2))

          if (!data?.res) {
            console.log('⚠️ [Yellow WS] Message has no "res" field')
            return
          }

          if (!Array.isArray(data.res)) {
            console.log('⚠️ [Yellow WS] "res" field is not an array')
            return
          }

          const [id, method, result] = data.res
          console.log(`🔍 [Yellow WS] Parsed ID: ${id}, Method: ${method}, Expected: ${expectedMethod}`)

          if (method === 'error') {
            const errorMsg = result.error || JSON.stringify(result)
            console.error(`❌ [Yellow WS] Server returned error for ${expectedMethod}:`, errorMsg)
            this.socket?.removeEventListener('message', handler)
            reject(new Error(`Yellow Server Error: ${errorMsg}`))
            return
          }

          // 🚨 Ignore background broker events or mismatched methods
          if (method !== expectedMethod) {
            console.log(`⏭️ [Yellow WS] Skipping message: method ${method} != ${expectedMethod}`)
            return
          }

          console.log(`🎯 [Yellow WS] Match found for ${expectedMethod}! Resolving...`)
          this.socket?.removeEventListener('message', handler)
          resolve(result)
        } catch (err) {
          console.error('🔴 [Yellow WS] Parse error', err)
        }
      }

      this.socket.addEventListener('message', handler)

      setTimeout(() => {
        this.socket?.removeEventListener('message', handler)
        reject(new Error(`Timeout waiting for ${expectedMethod}`))
      }, 30000)
    })
  }
  /* -------------------------------------------------- */
  /* SESSION CREATION                                   */
  /* -------------------------------------------------- */

  async createSession(userAddress: string, signer: any): Promise<string | null> {
    try {
      await this.initialize()
      await this.authenticate(userAddress, signer)

      const participants = [userAddress, YELLOW_CONFIG.backendSignerAddress]
        .sort((a, b) => a.localeCompare(b)) as Address[]

      const nonce = Date.now().toString()

      const session: AppSession = {
        definition: {
          protocol: 'payment-app-v1' as RPCAppDefinition['protocol'],
          participants,
          weights: [1, 1],
          quorum: 2,
          // @ts-ignore - Runtime expects string challenge
          challenge: '0',
          // @ts-ignore - User requires string nonce
          nonce: nonce,
        },
        allocations: participants.map(p => ({
          participant: p,
          asset: TOKENS.USDC.address as Address,
          amount: '0'
        }))
      }

      const messageSigner: MessageSigner = async payload => {
        const msg = typeof payload === 'string' ? payload : JSON.stringify(payload)
        return await signer.signMessage({ message: msg })
      }

      const domain = {
        name: 'Nitro Protocol',
        version: '1',
        chainId: YELLOW_CONFIG.chainId,
        verifyingContract: '0x0000000000000000000000000000000000000000' as Address,
      }

      // @ts-ignore - Runtime expects 3 args (signer, domain, session)
      const msg = await createAppSessionMessage(
        messageSigner,
        domain as any,
        session as any
      )
      this.socket!.send(msg)

      const res = await this.waitFor('session_create')

      this.sessionId = res.sessionId || res.id || `session_${nonce}`
      this.sessionActive = true

      console.log('🟢 Yellow Session Created', this.sessionId)
      return this.sessionId
    } catch (error) {
      console.error('Failed to create session:', error)
      this.sessionActive = false
      return null
    }
  }

  /* -------------------------------------------------- */
  /* LI.FI QUOTE                                        */
  /* -------------------------------------------------- */

  async getSwapQuote(fromToken: string, toToken: string, amount: string): Promise<SwapQuote | null> {
    /* REAL CODE (DISABLED FOR DEMO)
    const routes = await getRoutes({
      fromChainId: YELLOW_CONFIG.chainId,
      toChainId: YELLOW_CONFIG.chainId,
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      fromAmount: amount,
      options: { slippage: 0.005 }
    })

    if (!routes.routes.length) return null
    const route = routes.routes[0]
    return {
      fromToken,
      toToken,
      fromAmount: amount,
      toAmount: route.toAmount,
      estimatedGas: route.gasCostUSD || '0',
      route,
      priceImpact: 0
    }
    */

    console.log('🧪 Mocking LI.FI Route for Demo');
    await new Promise(r => setTimeout(r, 800));

    return {
      fromToken,
      toToken,
      fromAmount: amount,
      toAmount: (BigInt(amount) * 2500n / 1000000n).toString(),
      estimatedGas: '0.00',
      route: {
        id: 'mock-route-' + Date.now(),
        steps: [{ type: 'swap', tool: 'uniswap' }]
      },
      priceImpact: 0.01
    }
  }

  /* -------------------------------------------------- */
  /* EXECUTE GASLESS SWAP                               */
  /* -------------------------------------------------- */

  async executeSwap(quote: SwapQuote, userAddress: string, signer: any): Promise<SwapResult> {
    try {
      if (!this.sessionActive || !this.sessionId) throw new Error('No active session')

      const intentData = toHex(
        new TextEncoder().encode(
          JSON.stringify({
            type: 'execute_swap',
            routeId: quote.route.id,
            sessionId: this.sessionId
          })
        )
      )

      const stateUpdate = {
        intent: 0,
        version: Date.now().toString(),
        data: intentData,
        to: YELLOW_CONFIG.backendSignerAddress as Address,
        value: '0',
        allocations: [],
        sigs: []
      }

      const messageSigner: MessageSigner = async payload => {
        const msg = typeof payload === 'string' ? payload : JSON.stringify(payload)
        return await signer.signMessage({ message: msg })
      }

      const domain = {
        name: 'Nitro Protocol',
        version: '1',
        chainId: YELLOW_CONFIG.chainId,
        verifyingContract: '0x0000000000000000000000000000000000000000' as Address,
      }

      const signedUpdate = await createSubmitAppStateMessage(
        messageSigner,
        domain as any,
        {
          appSessionId: this.sessionId || '0x0000000000000000000000000000000000000000',
          status: 1,
          ...stateUpdate
        } as any
      )

      const response = await fetch(`${YELLOW_CONFIG.backendUrl}/execute-swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          userAddress,
          signedStateUpdate: signedUpdate,
          lifiRoute: quote.route
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.txHash) {
        throw new Error('No transaction hash returned from backend')
      }

      return { success: true, txHash: result.txHash }
    } catch (error) {
      console.error('Swap execution failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Swap failed'
      }
    }
  }

  /**
   * Close the current session and clean up resources
   */
  closeSession() {
    this.sessionActive = false
    this.sessionId = null
  }
}

export const yellowSwapService = new YellowSwapService()
