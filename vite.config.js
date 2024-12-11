import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api': 'http://localhost:3000', // Proxy API requests to the backend
        },
    },
    root: 'src', // Ensure Vite serves files from the src folder
});
