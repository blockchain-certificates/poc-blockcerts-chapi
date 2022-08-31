import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import fs from 'fs';

export default {
  input: 'verifier/src/index.ts',
  output: [
    {
      file: 'verifier/lib/index.js',
      format: 'iife',
      name: 'ChapiVerifier'
    }
  ],
  plugins: [
    typescript(),
    serve({
      contentBase: [
        'verifier/lib',
        'verifier/browser',
        'node_modules/@webcomponents/webcomponentsjs',
        'node_modules/@blockcerts'
      ],
      host: '0.0.0.0',
      port: 9001,
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
