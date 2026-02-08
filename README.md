# 🚀 Rescue.eth - Smart Recovery Layer on Base

**Never stay stranded again. Turn a gasless panic moment into a seamless recovery experience.**

[![Base](https://img.shields.io/badge/Base-Sepolia-blue)](https://base.org)
[![Yellow Network](https://img.shields.io/badge/Yellow-Sandbox-yellow)](https://yellow.com)
[![LI.FI](https://img.shields.io/badge/LI.FI-Production-green)](https://li.fi)

---

## 🎯 The Mission

Users often find themselves "stranded" on L2s like Base when they have valuable assets (like USDC) but zero ETH for gas. This creates a "need gas to get gas" deadlock that frustrates users and locks capital.

**Rescue.eth** provides a premium, gasless recovery primitive. By leveraging the **Yellow Network** for gasless execution and **LI.FI** for intelligent routing, we allow users to swap a small portion of their assets for ETH without ever needing a gas balance.

---

## ✨ Premium Experience

The Smart Rescue dashboard has been overhauled with a **Command Center** aesthetic, designed for maximum trust and technical precision:

- **Deep Space Theme**: A sophisticated dark mode utilizing HSL tokens for deep, harmonious blacks and vibrant neon accents.
- **Glassmorphism**: High-end UI components featuring blurred backdrops (`glass-panel`, `glass-card`) for a modern, tactile feel.
- **Micro-Animations**: Fluid transitions and hover effects that provide immediate feedback and a premium "living" interface.
- **ENS Centric**: Seamless primary ENS name resolution for a personalized identity layer.

---

## 💡 How It Works

1.  **Detection**: The system automatically monitors your balances and alerts you if you're "Stranded."
2.  **Quote**: Lock in a real-time rescue route from LI.FI, calculating exactly how much ETH you'll receive for your USDC.
3.  **Rescue**: Sign a gasless EIP-712 permit. The Yellow Network executes the swap and delivers gas to your wallet.
4.  **Ready**: You're back in action with enough gas to bridge, swap, or trade.

---

## 🛠️ Tech Stack

-   **Frontend**: React 18, Vite, TypeScript, Tailwind CSS (Custom Design System).
-   **Web3**: Wagmi + AppKit (Reown) for multi-wallet connectivity.
-   **Gasless Layer**: @erc7824/nitrolite (Yellow Network SDK) for off-chain signatures/on-chain execution.
-   **Routing Layer**: LI.FI SDK for multi-pool, optimized swap paths.
-   **Network**: **Base Sepolia** (Chain ID: 84532).

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/nishanthcr7777/rescue.eth.git
cd rescue.eth

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Fill in your RPC and API keys (AppKit Project ID, etc.)

# Start the command center
npm run dev
```

### Environment Config

Ensure your `.env` is configured for **Base Sepolia**:
- `VITE_CHAIN_ID=84532`
- `VITE_YELLOW_CONFIG=sandbox`

---

## 🛡️ Security & Reliability

- **EIP-712 Compliance**: Strictly enforced domain separation for secure off-chain signatures.
- **Sandbox Testing**: Fully validated against the Yellow Network Sandbox environment.
- **Error Handling**: Graceful degradation and clear feedback for network mismatches or failed quotes.

---

## 📝 License

MIT © 2026 Smart Rescue Contributors

**Powered by Yellow Network, LI.FI, and ENS**
