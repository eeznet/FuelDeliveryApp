const fs = require('fs');
const path = require('path');

// Check if dist directory exists
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
    console.error('❌ dist directory not found');
    process.exit(1);
}

// Check if index.html exists in dist
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found in dist');
    process.exit(1);
}

console.log('✅ Build verification passed'); 