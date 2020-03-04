import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: [
    './src/Sudoku.ts',
  ],
  output: {
    sourcemap: true,
    file: './dist/index.js',
  },
  plugins: [
    resolve({ modulesOnly: true }),
    typescript({ target: 'ES2015' }),
    terser(),
  ],
};
