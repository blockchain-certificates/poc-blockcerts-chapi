import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/worker.ts',
  output: [
    {
      file: 'lib/worker.js',
      format: 'iife',
      name: 'ChapiWalletWorker'
    }
  ],
  plugins: [
    typescript()
  ]
};
