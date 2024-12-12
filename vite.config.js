import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src', // Specify the root directory where index.html is located
    build: {
        outDir: '../dist', // Output folder for production build
        emptyOutDir: true, // Clears the output directory before building
    },
});
