# PinDex Documentation

## Overview
PinDex is a fully decentralized DEX frontend for Uniswap, deployed via PinMe to ENS and IPFS.

## Architecture

### Decentralized Infrastructure
- **RPC Providers**: 7+ endpoints with automatic failover
- **Price Quotes**: On-chain via Uniswap Quoter V2
- **ETH Price**: On-chain from Uniswap pools
- **Gas Prices**: On-chain via wagmi
- **Token Info**: On-chain ERC20 contract calls
- **IPFS Access**: 5+ gateways with failover
- **ENS Resolution**: Multiple RPC endpoints
- **Wallet Connections**: Optional WalletConnect with direct fallback

### No Centralized Dependencies
- ❌ No Infura/Alchemy required
- ❌ No centralized APIs
- ❌ No price APIs
- ❌ No analytics/tracking
- ❌ No backend server
- ✅ All data from blockchain
- ✅ Multiple fallbacks for everything

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── scripts/          # Deployment scripts
└── docs/             # Documentation
```

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run deploy:prepare  # Prepare for deployment
```

## Deployment

Deploy to IPFS and ENS using PinMe:
```bash
npm run build
pinme deploy out/
```

## Features

- ✅ Fully decentralized
- ✅ On-chain quotes
- ✅ Multiple RPC fallbacks
- ✅ Error boundaries
- ✅ Responsive design
- ✅ Dark/Light theme

## Resources

- [PinMe](https://pinme.eth.limo/)
- [Uniswap V3 Docs](https://docs.uniswap.org/)
- [Wagmi Docs](https://wagmi.sh/)

