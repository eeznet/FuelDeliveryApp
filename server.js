// Keep it simple - just redirect to mjs
import('./server.mjs').catch(err => {
    console.error('Failed to load server.mjs:', err);
    process.exit(1);
}); 