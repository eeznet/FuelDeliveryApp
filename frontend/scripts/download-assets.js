import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

async function downloadAssets() {
    const assets = {
        'favicon.ico': 'https://raw.githubusercontent.com/eeznet/assets/main/favicon.ico',
        'logo192.png': 'https://raw.githubusercontent.com/eeznet/assets/main/logo192.png',
        'logo512.png': 'https://raw.githubusercontent.com/eeznet/assets/main/logo512.png'
    };

    for (const [filename, url] of Object.entries(assets)) {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            await fs.writeFile(
                path.join('public', filename),
                response.data
            );
            console.log(`✓ Downloaded ${filename}`);
        } catch (error) {
            console.error(`✗ Failed to download ${filename}:`, error.message);
        }
    }
}

downloadAssets(); 