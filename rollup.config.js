import resolve from '@rollup/plugin-node-resolve';

export default {
  input: [
    './src/Sudoku.js',
  ],
  output: {
    sourcemap: true,
    file: './dist/index.js',
  },
  plugins: [
    resolve({ modulesOnly: true }),
  ],
};
