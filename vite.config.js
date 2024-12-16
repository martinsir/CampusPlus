import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    esbuild: {
        loader: 'js', // Ensure JS files are treated as regular JavaScript
        include: /\.js$/, // Apply this only to .js files
        exclude: /node_modules/, // Exclude node_modules
    },
});
