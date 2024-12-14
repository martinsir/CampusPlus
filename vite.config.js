import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src', // Specify the root directory where index.html is located
    build: {
        outDir: '../dist', // Output folder for production build
        emptyOutDir: true, // Clears the output directory before building
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // Your Express server
                changeOrigin: true, // Necessary for some APIs
                rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api prefix if needed
            },
        },
    },
});
