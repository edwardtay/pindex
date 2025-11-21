# Deployment Guide

## PinMe Deployment Steps

### Prerequisites

1. **Build the project**
   ```bash
   npm install
   npm run build
   ```

2. **Get WalletConnect Project ID** (optional but recommended)
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a project and get your Project ID
   - Add it to `.env.local`:
     ```
     NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
     ```

### Deploy with PinMe

#### Option 1: CLI Deployment

1. **Install PinMe CLI**
   ```bash
   npm install -g pinme
   ```

2. **Deploy**
   ```bash
   pinme deploy out/
   ```

3. **Follow prompts**
   - Enter your ENS domain (or create one)
   - Confirm deployment
   - Verify content-hash

#### Option 2: Web Deployment

1. Visit [https://pinme.eth.limo/](https://pinme.eth.limo/)
2. Upload the `out/` directory
3. Follow the web interface instructions

### Verification

After deployment:

1. **Check ENS Resolution**
   - Visit `yourdomain.eth.limo`
   - Verify the site loads correctly

2. **Verify Content-Hash**
   - PinMe provides content-hash verification
   - Ensure it matches your deployment

3. **Test Functionality**
   - Connect wallet
   - Test token swaps
   - Verify all features work

### Troubleshooting

- **Build errors**: Ensure all dependencies are installed
- **Deployment fails**: Check ENS domain ownership
- **Content-hash mismatch**: Rebuild and redeploy
- **Wallet connection issues**: Verify WalletConnect Project ID

## Continuous Deployment

For automated deployments:

1. Set up GitHub Actions or similar CI/CD
2. Build on push to main branch
3. Deploy to PinMe automatically
4. Update ENS record with new content-hash


