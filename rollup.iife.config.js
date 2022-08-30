import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import fs from 'fs';

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
    typescript(),
    serve({
      contentBase: ['lib', 'browser'],
      host: '0.0.0.0',
      port: 9000,
      open: true,
      https: {
        cert: fs.readFileSync('https-cert/cert.pem'),
        key: fs.readFileSync('https-cert/key.pem')
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  ]
};
