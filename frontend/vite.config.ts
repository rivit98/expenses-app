import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// Rolldown (Vite 8) accepts only the function form of manualChunks. Matching on the
// node_modules path also keeps react-dom's internals in vendor-react, which Rollup's
// object form never did -- it only matched a package's entry module.
const vendorChunks: Record<string, string[]> = {
    'vendor-react': ['react', 'react-dom'],
    'vendor-chakra': ['@chakra-ui/react', '@emotion/react', 'lucide-react'],
    'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
    'vendor-query': ['@tanstack/react-query'],
};

const manualChunks = (id: string): string | undefined => {
    const path = id.replaceAll('\\', '/');
    if (!path.includes('/node_modules/')) {
        return undefined;
    }

    return Object.entries(vendorChunks).find(([, packages]) =>
        packages.some((pkg) => path.includes(`/node_modules/${pkg}/`))
    )?.[0];
};

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
            rollupOptions: {
                output: {
                    manualChunks,
                },
            },
        },
        plugins: [react()],
        server: {
            host: true,
        },
    };
});
