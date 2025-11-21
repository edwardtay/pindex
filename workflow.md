# PinDex - Workflow

## Project Overview
PinDex - Decentralized frontend for Uniswap DEX, deployed via PinMe to ENS and IPFS.

## Development Workflow

### 1. Setup
```bash
npm install
```

### 2. Development
```bash
npm run dev
```
- Runs on http://localhost:3001
- Hot reload enabled

### 3. Build
```bash
npm run build
```
- Generates static export in `out/` directory
- Optimized for IPFS deployment

### 4. Deploy with PinMe
1. Install PinMe: `npm install -g pinme` or visit https://pinme.eth.limo/
2. Build the project: `npm run build`
3. Deploy: `pinme deploy out/`
4. Follow prompts to set ENS domain
5. Verify content-hash after deployment

### 5. Testing
- Test swap functionality on testnet first
- Verify ENS resolution
- Check IPFS content-hash verification
- Test censorship resistance

## Architecture

### Frontend
- Next.js (static export for IPFS)
- React components
- Wagmi for Web3 connections
- Uniswap SDK integration

### Backend Integration
- Uniswap V3 Protocol
- Smart Order Router for best prices
- Token price feeds
- Swap execution via wallet

### Deployment
- PinMe for ENS/IPFS pinning
- Content-hash verification
- Tamper-proof delivery
- Censorship resistant

## Git Workflow
- Use feature branches for new features
- Commit with descriptive messages
- Tag releases before PinMe deployment
- Keep main branch production-ready

## Iteration Process
1. Identify problem (5-7 potential sources)
2. Distill to 1-2 root causes
3. Add logging to validate assumptions
4. Implement fix
5. Test thoroughly
6. Tidy code after iteration

