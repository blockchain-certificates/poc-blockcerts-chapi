import typescript from '@rollup/plugin-typescript';

export default {
  input: 'wallet/src/worker.ts',
  output: [
    {
      file: 'wallet/lib/worker.js',
      format: 'iife',
      name: 'ChapiWalletWorker'
    }
  ],
  plugins: [
    typescript()
  ]
};
