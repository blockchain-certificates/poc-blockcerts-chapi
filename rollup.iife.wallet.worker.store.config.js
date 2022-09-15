import typescript from '@rollup/plugin-typescript';

export default {
  input: 'wallet/src/worker-store.ts',
  output: [
    {
      dir: 'wallet/lib/',
      format: 'esm',
      name: 'ChapiWalletWorkerStore'
    }
  ],
  plugins: [
    typescript()
  ]
};
