import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vendor-react': ['react', 'react-dom'],
                        'vendor-chakra': [
                            '@chakra-ui/react',
                            '@chakra-ui/icons',
                            '@emotion/react',
                            '@emotion/styled',
                            'framer-motion',
                        ],
                        'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
                        'vendor-query': ['@tanstack/react-query'],
                    },
                },
            },
        },
        plugins: [react()],
        server: {
            host: true,
        },
    };
});
