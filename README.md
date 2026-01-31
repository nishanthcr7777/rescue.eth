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
git clone https://github.com/yourusername/smart-rescue.git
cd smart-rescue

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

## 📖 Documentation

- **[MASTER_SPECIFICATION.md](docs/MASTER_SPECIFICATION.md)** - Complete 0 to 1 spec
- **[11_CODING_STYLE_GUIDE.md](docs/11_CODING_STYLE_GUIDE.md)** - TypeScript style guide
- **[10_FUTURE_ENHANCEMENTS.md](docs/10_FUTURE_ENHANCEMENTS.md)** - Post-hackathon roadmap

---

## 🎬 Demo

**Live Demo:** [https://smart-rescue.vercel.app](https://smart-rescue.vercel.app)

**Video Demo:** [2-minute walkthrough](https://youtu.be/...)

### Demo Script (2 minutes)

1. **Problem** (0:20) - User stuck with 100 USDC, 0 gas
2. **Solution** (0:40) - Three rescue options
3. **Simulation** (1:00) - Deterministic preview
4. **Execute** (1:20) - One signature, gasless
5. **Success** (1:40) - Problem solved, fee paid

---

## 🏆 Hackathon Prizes

**Target: $15,000-18,000**

- **Yellow Network** ($5,000) - Gasless execution
- **LI.FI Composer** ($5,000) - Routing + cross-chain
- **ENS Creative DeFi** ($3,000) - Name resolution
- **General Prizes** ($2,000-5,000) - Best UX, production-ready

---

## 📊 Project Structure

```
/src
  /components       # UI components
  /services         # Yellow, LI.FI, fee collection
  /hooks            # React hooks
  /config           # Network, token configs
  App.tsx
  main.tsx

/docs
  MASTER_SPECIFICATION.md    # Complete spec
  11_CODING_STYLE_GUIDE.md   # TypeScript style
  10_FUTURE_ENHANCEMENTS.md  # Roadmap
  /archive                   # Old planning docs
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

See [10_FUTURE_ENHANCEMENTS.md](docs/10_FUTURE_ENHANCEMENTS.md) for details.

---

## 📝 License

MIT

---

## 🤝 Contributing

This is a hackathon project. Contributions welcome post-hackathon!

---

## 📧 Contact

- **Twitter:** [@yourusername](https://twitter.com/yourusername)
- **Discord:** yourusername#1234
- **Email:** your@email.com

---

**Built with ❤️ for HackMoney 2024**

**Powered by Yellow Network, LI.FI, and ENS**
