import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: 'src/worker-get.ts',
  output: [
    {
      file: 'lib/worker-get.js',
      format: 'iife',
      name: 'ChapiWalletWorkerGet'
    }
  ],
  plugins: [
    typescript(),
    json()
  ]
};
