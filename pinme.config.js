/**
 * PinMe Configuration
 * Deploy to ENS and IPFS with verifiable content-hash
 */
module.exports = {
  // ENS domain (will be set during deployment)
  ensDomain: process.env.ENS_DOMAIN || 'decentralizedlife.eth',
  
  // IPFS configuration
  ipfs: {
    gateway: 'https://ipfs.io/ipfs/',
  },
  
  // Build output directory
  outputDir: 'out',
  
  // Content hash verification
  verifyContentHash: true,
};


