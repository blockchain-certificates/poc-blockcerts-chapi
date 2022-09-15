import typescript from '@rollup/plugin-typescript';
import deleteDir from 'rollup-plugin-delete';

const outputDir = 'wallet/lib/get';
export default {
  input: 'wallet/src/worker-get.ts',
  output: [
    {
      dir: outputDir,
      format: 'esm',
      name: 'ChapiWalletWorkerGet'
    }
  ],
  plugins: [
    deleteDir({
      targets: outputDir
    }),
    typescript()
  ]
};
