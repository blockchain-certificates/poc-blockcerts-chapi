import typescript from '@rollup/plugin-typescript';
import deleteDir from 'rollup-plugin-delete';

const outputDir = 'wallet/lib/store';
export default {
  input: 'wallet/src/worker-store.ts',
  output: [
    {
      dir: outputDir,
      format: 'esm',
      name: 'ChapiWalletWorkerStore'
    }
  ],
  plugins: [
    deleteDir({
      targets: outputDir
    }),
    typescript()
  ]
};
