const {
  SMALL_SQ,
  BIG_SQ,
  BitCandidates,
} = require('./BitCandidates');

class Sudoku {
  /**
   * The constructor of a sudoku. Note that the grid passed as input will be changed during
   * the iterations, and will eventually contain the solution.
   */
  constructor(grid) {
    this.grid = grid;
    this.bitCandidates = this.initCandidates();
  }

  /**
   * The method that calculates the solution.
   * @returns true if a solution has been found.
   * The grid passed in the constructor contains the solution itself.
   */
  solve() {
    return this.recursiveSolve();
  }

  toString() {
    let ret = '';
    for (let row = 0; row < this.grid.length; row++) {
      if (row > 0 && row % SMALL_SQ === 0) {
        ret = `${ret}------+-------+------ \n`;
      }
      for (let col = 0; col < BIG_SQ; col++) {
        if (col > 0 && col % 3 === 0) {
          ret = `${ret}| `;
        }
        const cell = this.grid[row][col];
        ret += (cell ? `${cell.toString()} ` : '. ');
      }
      ret = `${ret}\n`;
    }
    return ret;
  }

  // The recursive routine that searches the solution
  recursiveSolve() {
    while (true) {
      const rowCol = this.getTopmostCell(this.grid);
      if (!rowCol) {
        // No empty cells, we're done!
        return true;
      }
      const { row, col } = rowCol;
      const mask = this.bitCandidates.getMask(row, col);
      for (let val = 1; mask !== 0 && val <= 9; val++) {
        if ((mask & (1 << val - 1)) !== 0) {
          this.bitCandidates.useVal(row, col, val);
          this.grid[row][col] = val;
          if (this.recursiveSolve()) {
            // This value allowed the completion
            return true;
          }
          // Not the good value, try another
          this.grid[row][col] = 0;
          this.bitCandidates.clearVal(row, col, val);
        }
      }
      // No values found, unsolvable
      return false;
    }
  }

  // Initialise the candidates data structure by adding the numbers already on the grid
  initCandidates() {
    const bitCandidates = new BitCandidates();
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const val = this.grid[row][col];
        if (val) {
          bitCandidates.useVal(row, col, val);
        }
      }
    }
    return bitCandidates;
  }

  // The idea is that we always get the cell with less alternatives.
  // Ideally, this should let us to quickly identify situations with no solution:
  // if a cell admits only one value, for instance, it's better if we try that one
  // sooner than later.
  getTopmostCell(grid) {
    let topmostCell = null;
    let bestNumberOfOptions = Number.MAX_VALUE;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (!grid[row][col]) {
          const mask = this.bitCandidates.getMask(row, col);
          const numberOfOptions = Sudoku.countBits(mask);
          if (numberOfOptions < bestNumberOfOptions) {
            // A cell with fewer options
            topmostCell = { row, col };
            bestNumberOfOptions = numberOfOptions;
          }
        }
      }
    }
    return topmostCell;
  }

  // Counts how many bits are set in val
  static countBits(val) {
    let count = 0;
    while (val) {
      if (val & 1) {
        count++;
      }
      val >>= 1;
    }
    return count;
  }
}

module.exports = Sudoku;
