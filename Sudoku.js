const {
  BCFactory,
} = require('./BCFactory');

class Sudoku {
  /**
   * The constructor of a sudoku. Note that the grid passed as input will be changed during
   * the iterations, and will eventually contain the solution.
   * @param {Array} grid
   * @param {number} smallWidth
   * @param {number} smallHeight
   */
  constructor(grid, smallWidth = 3, smallHeight = 3) {
    this.sWidth = smallWidth;
    this.sHeight = smallHeight;
    this.bigSq = smallHeight * smallWidth;
    this.grid = grid;
    if (!this.valid(grid) || !grid.every((arr) => this.valid(arr))) {
      throw new Error('Invalid input grid');
    }
    this.initCandidates();
    this.results = [];
    this.limit = 0;
  }

  valid(arr) {
    return Array.isArray(arr) && (arr.length === this.sWidth * this.sHeight);
  }

  /**
   * The method that calculates the solution.
   * @returns true if a solution has been found.
   * The grid passed in the constructor contains the solution itself.
   */
  solve(limit = 0) {
    this.limit = limit;
    this.results = [];
    const uniques = this.bitCandidates.getUnique();
    uniques.forEach(({ row, col, val }) => {
      this.set(row, col, val);
    });
    if (uniques.length) {
      const next = this.bitCandidates.getUnique();
      next.forEach(({ row, col, val }) => {
        this.set(row, col, val);
      });
      uniques.push(...next);
    }

    const solved = this.recursiveSolve();
    uniques.forEach(({ row, col }) => {
      this.clear(row, col);
    });
    return solved;
  }

  toString(grid = this.grid) {
    let ret = '';
    for (let row = 0; row < this.bigSq; ++row) {
      if (row > 0 && row % this.sHeight === 0) {
        ret = `${ret}------+-------+------ \n`;
      }
      for (let col = 0; col < this.bigSq; ++col) {
        if (col > 0 && col % this.sWidth === 0) {
          ret = `${ret}| `;
        }
        const cell = grid[row][col];
        ret += (cell ? `${cell} ` : '. ');
      }
      ret = `${ret}\n`;
    }
    return ret;
  }

  code() {
    const lines = [];
    for (let row = 0; row < this.bigSq; ++row) {
      lines[row] = `  [${this.grid[row].join(', ')}],`;
    }
    return `[\n${lines.join('\n')}\n]`;
  }

  result(index = 0) {
    if (index < 0 || index > this.results.length) {
      throw new Error(`index must be 0..${this.results.length - 1}`);
    }
    return this.toString(this.results[index]);
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
      for (let val = 1; mask !== 0 && val <= this.bigSq; ++val) {
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
      if (this.grid[row][col] === val) {
        return;
      }
      throw new Error('Cannot set');
    }
    this.grid[row][col] = val;
    this.bitCandidates.useVal(row, col, val);
  }

  clear(row, col) {
    if (this.grid[row][col] === 0) {
      return;
    }
    this.bitCandidates.clearVal(row, col, this.grid[row][col]);
    this.grid[row][col] = 0;
  }

  // Initialise the candidates data structure by adding the numbers already on the grid
  initCandidates() {
    const bitCandidates = BCFactory.gen(this.sWidth, this.sHeight);
    bitCandidates.grid = this.grid;
    for (let row = 0; row < this.bigSq; ++row) {
      for (let col = 0; col < this.bigSq; ++col) {
        const val = this.grid[row][col];
        if (val) {
          bitCandidates.useVal(row, col, val);
        }
      }
    }
    this.bitCandidates = bitCandidates;
  }

  // The idea is that we always get the cell with less alternatives.
  // Ideally, this should let us to quickly identify situations with no solution:
  // if a cell admits only one value, for instance, it's better if we try that one
  // sooner than later.
  getTopmostCell(grid) {
    let topmostCell = null;
    let bestNumberOfOptions = Number.MAX_VALUE;
    for (let row = 0; row < this.bigSq; ++row) {
      for (let col = 0; col < this.bigSq; ++col) {
        if (!grid[row][col]) {
          const mask = this.bitCandidates.getMask(row, col);
          const numberOfOptions = Sudoku.countBits(mask);
          if (numberOfOptions < bestNumberOfOptions) {
            // A cell with fewer options
            topmostCell = { row, col };
            bestNumberOfOptions = numberOfOptions;
            if (numberOfOptions === 0) {
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

  quizz() {
    this.solve(1);
    if (this.results.length === 0) {
      throw new Error('Can\'t solve this sudoku board');
    }
    [this.grid] = this.results;
    this.initCandidates();
    const positions = new Array(this.bigSq * this.bigSq);
    for (let i = positions.length - 1; i >= 0; --i) {
      positions[i] = i;
    }
    for (let i = positions.length - 1; i >= 0; --i) {
      const j = Math.floor(Math.random() * positions.length);
      const tmp = positions[i];
      positions[i] = positions[j];
      positions[j] = tmp;
    }

    for (let i = positions.length - 1; i >= 0; --i) {
      const p = positions[i];
      const row = Math.trunc(p / this.bigSq);
      const col = p % this.bigSq;
      const val = this.grid[row][col];
      if (val !== 0) {
        this.clear(row, col);
        this.solve(2);
        if (this.results.length > 1) {
          this.set(row, col, val);
        }
      }
    }
  }
}

module.exports = Sudoku;
