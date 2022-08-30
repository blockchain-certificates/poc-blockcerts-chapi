import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/chapi-wallet.js',
      format: 'iife',
      name: 'ChapiWallet'
    }
  ],
  plugins: [
    typescript()
  ]
};
