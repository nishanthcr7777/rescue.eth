# 🚀 Smart Rescue - Gasless Token Rescue on Base

**Turn being gasless from a panic moment into an onboarding moment**

[![Base](https://img.shields.io/badge/Base-Mainnet-blue)](https://base.org)
[![Yellow Network](https://img.shields.io/badge/Yellow-Gasless-yellow)](https://yellow.org)
[![LI.FI](https://img.shields.io/badge/LI.FI-Routing-green)](https://li.fi)

---

## 🎯 The Problem

Users get stuck with tokens but no gas on L2s/sidechains.

**Example:**
- User bridges 100 USDC to Base
- Forgets to bridge ETH for gas
- Now has $100 but can't do anything
- Can't swap, can't bridge back, can't send to exchange
- **Need gas to get gas = impossible**

**This affects millions of users and $100M+ in stranded capital.**

---

## 💡 Our Solution

**Smart Rescue: Three gasless rescue options**

### 1. 💰 Get Gas & Stay (2.5% fee)
Swap small amount for gas, stay on Base
- User: 100 USDC, 0 ETH → 94.87 USDC, 0.01 ETH
- Fee: 0.13 USDC
- Gas cost: $0 (Yellow Network)

### 2. 🌉 Bridge to Mainnet (3% fee)
Move funds to Ethereum L1
- User: 100 USDC on Base → 95 USDC on Mainnet
- Fee: 2.85 USDC
- Gas cost: $0 (Yellow Network)

### 3. 📤 Send to Exchange (2% fee)
Transfer directly to CEX
- User: 100 USDC → 95 USDC at exchange
- Fee: 1.90 USDC
- Gas cost: $0 (Yellow Network)

**All gasless. All transparent. All atomic.**

---

## 🔥 Key Features

### Deterministic Simulation (Finance-Grade UX)
```
🔍 Rescue Preview

Amount sold:       5.13 USDC
Our fee (2.5%):    0.13 USDC
Gas received:      0.01 ETH
Guaranteed max:    $5.20

⚠️ Transaction reverts if limits exceeded
```

### Abuse Protection (Production-Ready)
```
🛡️ Daily limit:  $5 per wallet
   Cooldown:     24 hours
```

### Atomic Fees (Business Viability)
```
Either: User gets service AND we get paid ✅
Or: Transaction reverts, nothing happens ✅
Never: User gets service without us getting paid ❌
```

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Wallet:** wagmi + viem + RainbowKit
- **Gasless:** Yellow Network SDK
- **Routing:** LI.FI SDK
- **Network:** Base Mainnet (chainId: 8453)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Wallet with Base Mainnet configured

### Installation

```bash
# Clone repo
git clone https://github.com/yourusername/rescue.eth.git
cd rescue.eth

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your API keys to .env

# Run development server
npm run dev
```

### Environment Variables

```env
VITE_CHAIN_ID=8453
VITE_NETWORK_NAME=base-mainnet
VITE_RPC_URL=https://mainnet.base.org

VITE_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
VITE_WETH_ADDRESS=0x4200000000000000000000000000000000000006

VITE_YELLOW_API_KEY=your_yellow_key
VITE_LIFI_INTEGRATOR=rescue-dapp

VITE_SERVICE_WALLET_ADDRESS=0x...
```

---

## 🔒 Security

- **Atomic fees** - No free rides
- **Abuse protection** - $5/day limit per wallet
- **Bounds enforcement** - Transaction reverts if limits exceeded
- **Transparent fees** - Always shown upfront

---

## 🚧 Roadmap

### MVP (Hackathon) ✅
- Three rescue actions
- Deterministic simulation
- Abuse protection
- Atomic fees

### Post-Hackathon
- Smart contracts (fee recovery)
- Multi-chain support (Arbitrum, Optimism)
- ENS policy system (advanced preferences)
- Backend services (caching, analytics)
- Transaction history
- Mobile app

---

## 📝 License

MIT

---

**Built with ❤️ for HackMoney 2026**

**Powered by Yellow Network, LI.FI, and ENS**
