# PinDex

**PinDex** - Decentralized DEX frontend for Uniswap, deployed via PinMe to ENS and IPFS with verifiable content-hash, tamper-proof delivery, and censorship resistance.

## Features

- 🔄 **Uniswap Integration**: Full swap functionality using Uniswap V3 protocol
- 🌐 **Decentralized Deployment**: Deployed to ENS and IPFS via PinMe
- 🔒 **Content-Hash Verification**: Tamper-proof content delivery
- 🚫 **Censorship Resistant**: No single point of failure
- 💼 **Wallet Connect**: Support for multiple wallets via Web3Modal
- 🎨 **Modern UI**: Clean, responsive interface

## Tech Stack

- **Frontend**: Next.js 14 (static export)
- **Web3**: Wagmi, Viem, Web3Modal
- **DEX**: Uniswap V3 SDK
- **Deployment**: PinMe (ENS + IPFS)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Wallet Connect Project ID (get from [WalletConnect Cloud](https://cloud.walletconnect.com/))

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

This creates a static export in the `out/` directory, optimized for IPFS deployment.

### Deploy with PinMe

1. Install PinMe: Visit [https://pinme.eth.limo/](https://pinme.eth.limo/)
2. Build the project: `npm run build`
3. Deploy: `pinme deploy out/`
4. Follow prompts to set your ENS domain
5. Verify content-hash after deployment

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/          # React components
│   ├── SwapInterface.tsx
│   ├── TokenInput.tsx
│   ├── Web3Provider.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   └── useUniswapSwap.ts
├── utils/              # Utilities
│   ├── tokens.ts
│   ├── constants.ts
│   └── abis.ts
├── workflow.md         # Development workflow
└── pinme.config.js     # PinMe configuration
```

## Hackathon Submission

Built for **PinMe DeFront Hack** - demonstrating:
- ✅ Decentralized frontend deployment
- ✅ ENS + IPFS integration
- ✅ Content-hash verification
- ✅ DeFi integration (Uniswap)
- ✅ Censorship resistance

## Resources

- [PinMe](https://pinme.eth.limo/)
- [Uniswap V3 Docs](https://docs.uniswap.org/)
- [Wagmi Docs](https://wagmi.sh/)
- [Hackathon Page](https://www.hackquest.io/hackathons/PinMe-DeFront-Hack)

## License

MIT

