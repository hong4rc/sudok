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
    this.results = [];
    this.limit = 0;
  }

  /**
   * The method that calculates the solution.
   * @returns true if a solution has been found.
   * The grid passed in the constructor contains the solution itself.
   */
  solve(limit = 0) {
    this.limit = limit;
    this.results = [];
    return this.recursiveSolve();
  }

  static str(grid) {
    let ret = '';
    for (let row = 0; row < BIG_SQ; row++) {
      if (row > 0 && row % SMALL_SQ === 0) {
        ret = `${ret}------+-------+------ \n`;
      }
      for (let col = 0; col < BIG_SQ; col++) {
        if (col > 0 && col % 3 === 0) {
          ret = `${ret}| `;
        }
        const cell = grid[row][col];
        ret += (cell ? `${cell.toString()} ` : '. ');
      }
      ret = `${ret}\n`;
    }
    return ret;
  }

  toString() {
    return Sudoku.str(this.grid);
  }

  result(index = 0) {
    if (index < 0 || index > this.results.length) {
      throw new Error(`index must be 0..${this.results.length - 1}`);
    }
    return Sudoku.str(this.results[index]);
  }

  capture() {
    // if (!this.isValid()) {
    //   throw new Error('Can\'t capture with invalid board');
    // }
    this.results.push(JSON.parse(JSON.stringify(this.grid)));
  }

  isFull() {
    return this.limit !== 0 && this.results.length >= this.limit;
  }

  // The recursive routine that searches the solution
  recursiveSolve() {
    while (true) {
      const rowCol = this.getTopmostCell(this.grid);
      if (!rowCol) {
        // No empty cells, we're done!
        this.capture();
        return true;
      }

      let found = false;
      const { row, col } = rowCol;
      const mask = this.bitCandidates.getMask(row, col);
      for (let val = 1; mask !== 0 && val <= BIG_SQ; val++) {
        if ((mask & (1 << val - 1)) !== 0) {
          this.set(row, col, val);
          if (this.recursiveSolve()) {
            found = true;
            if (this.isFull()) {
              this.clear(row, col);
              break;
            }
          }
          // Try another
          this.clear(row, col);
        }
      }
      return found;
    }
  }

  set(row, col, val) {
    if (this.grid[row][col]) {
      throw new Error('Cannot set');
    }
    this.grid[row][col] = val;
    this.bitCandidates.useVal(row, col, val);
  }

  clear(row, col) {
    this.bitCandidates.clearVal(row, col, this.grid[row][col]);
    this.grid[row][col] = 0;
  }

  // Initialise the candidates data structure by adding the numbers already on the grid
  initCandidates() {
    const bitCandidates = new BitCandidates();
    for (let row = 0; row < BIG_SQ; row++) {
      for (let col = 0; col < BIG_SQ; col++) {
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
    for (let row = 0; row < BIG_SQ; row++) {
      for (let col = 0; col < BIG_SQ; col++) {
        if (!grid[row][col]) {
          const mask = this.bitCandidates.getMask(row, col);
          const numberOfOptions = Sudoku.countBits(mask);
          if (numberOfOptions < bestNumberOfOptions) {
            // A cell with fewer options
            topmostCell = { row, col };
            bestNumberOfOptions = numberOfOptions;
            if (numberOfOptions === 1) {
              return topmostCell;
            }
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
