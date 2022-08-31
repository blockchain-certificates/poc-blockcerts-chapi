import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';
import fs from 'fs';

export default {
  input: 'issuer/src/index.ts',
  output: [
    {
      file: 'issuer/lib/index.js',
      format: 'iife',
      name: 'ChapiIssuer'
    }
  ],
  plugins: [
    typescript(),
    json(),
    serve({
      contentBase: [
        'issuer/lib',
        'issuer/browser'
      ],
      host: '0.0.0.0',
      port: 9002,
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
