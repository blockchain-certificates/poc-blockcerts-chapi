import typescript from '@rollup/plugin-typescript';

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
    typescript()
  ]
};
