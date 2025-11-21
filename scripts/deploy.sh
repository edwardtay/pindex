#!/bin/bash

# PinMe Deployment Script
# This script builds and prepares the project for PinMe deployment

set -e

echo "🔨 Building project..."
npm run build

echo "✅ Build complete!"
echo ""
echo "📦 Output directory: ./out"
echo ""
echo "🚀 To deploy with PinMe:"
echo "   1. Install PinMe: npm install -g pinme"
echo "   2. Run: pinme deploy out/"
echo "   3. Follow prompts to set your ENS domain"
echo ""
echo "🌐 Or visit https://pinme.eth.limo/ for web-based deployment"


