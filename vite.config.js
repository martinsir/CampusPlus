import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src', // Opsæt rodmappen, typisk 'src'
    build: {
        outDir: '../dist', // Opsæt outputmappen til produktion
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000', // Proxy API-anmodninger til din Node.js server
        },
    },
});

