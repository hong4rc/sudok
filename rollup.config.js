import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

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
    typescript(),
  ],
};
