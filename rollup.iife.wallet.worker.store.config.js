import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: 'wallet/src/worker-store.ts',
  output: [
    {
      file: 'wallet/lib/worker-store.js',
      format: 'iife',
      name: 'ChapiWalletWorkerStore'
    }
  ],
  plugins: [
    typescript(),
    json()
  ]
};
