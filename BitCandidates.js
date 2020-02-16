const SMALL_SQ = 3;
const BIG_SQ = SMALL_SQ * SMALL_SQ;
const ALL_BITS = 0x1FF; // 9 bits set to 1

const trunc = {
  0: 0,
  1: 0,
  2: 0,
  3: 1,
  4: 1,
  5: 1,
  6: 2,
  7: 2,
  8: 2,
};

class BitCandidates {
  constructor() {
    this.colsMask = [];
    this.rowsMask = [];
    this.blocksMask = [];
    for (let i = 0; i < BIG_SQ; i++) {
      this.colsMask[i] = ALL_BITS;
      this.rowsMask[i] = ALL_BITS;
      if (i % SMALL_SQ === 0) {
        this.blocksMask[trunc[i]] = [];
      }
      this.blocksMask[trunc[i]][i % SMALL_SQ] = ALL_BITS;
    }
    this.markes = new Array(BIG_SQ);

    for (let i = 0; i < BIG_SQ; ++i) {
      this.markes[i] = new Array(BIG_SQ);
    }
  }

  /**
   * Marks a value as used for that row, that col and that block
   */
  useVal(row, col, val) {
    const bit = ~(1 << (val - 1));
    const bit2 = 1 << (val - 1);
    const blockRow = trunc[row];
    const blockCol = trunc[col];
    if (
      (this.colsMask[col] & bit2)
      && (this.rowsMask[row] & bit2)
      && (this.blocksMask[blockRow][blockCol] & bit2)
    ) {
      this.colsMask[col] &= bit;
      this.rowsMask[row] &= bit;
      this.blocksMask[blockRow][blockCol] &= bit;
    } else {
      throw new Error(`Duplicate in row: ${row}, col: ${col}`);
    }
  }

  /**
   * Sets a value as available again for that row, that col and that block
   */
  clearVal(row, col, val) {
    const bit = (1 << (val - 1));
    this.colsMask[col] |= bit;
    this.rowsMask[row] |= bit;
    const blockRow = trunc[row];
    const blockCol = trunc[col];
    this.blocksMask[blockRow][blockCol] |= bit;
  }

  /**
   *  Returns the bitmask for the valid values for that cell
   */
  getMask(row, col) {
    if (this.grid[row][col]) {
      return 0;
    }
    const blockRow = trunc[row];
    const blockCol = trunc[col];
    const mask = this.rowsMask[row] & this.colsMask[col] & this.blocksMask[blockRow][blockCol];
    return mask;
  }

  getUnique() {
    this.fillAllMark();
    const uniques = [];
    for (let row = 0; row < BIG_SQ; ++row) {
      uniques.push(...this.getUniqueRow(row));
    }
    for (let col = 0; col < BIG_SQ; ++col) {
      uniques.push(...this.getUniqueCol(col));
    }
    for (let iRow = 0; iRow < SMALL_SQ; ++iRow) {
      for (let iCol = 0; iCol < SMALL_SQ; ++iCol) {
        uniques.push(...this.getUniqueSquare(iRow, iCol));
      }
    }
    return uniques;
  }

  getUniqueRow(row) {
    const uniques = [];
    const rowMask = this.rowsMask[row];
    if (rowMask === 0) {
      return uniques;
    }
    for (let val = 1; val <= BIG_SQ; val++) {
      // `val` avaiable is this row
      if ((rowMask & (1 << val - 1)) !== 0) {
        let unique = null;
        for (let col = 0; col < BIG_SQ; ++col) {
          if ((this.markes[row][col] & (1 << val - 1)) !== 0) {
            if (unique !== null) {
              // Exist 2+ cell have val
              unique = null;
              break;
            }
            unique = { row, col, val };
          }
        }
        if (unique) {
          uniques.push(unique);
        }
      }
    }

    return uniques;
  }

  getUniqueCol(col) {
    const uniques = [];
    const colMask = this.colsMask[col];
    if (colMask === 0) {
      return uniques;
    }
    for (let val = 1; val <= BIG_SQ; val++) {
      // `val` avaiable is this col
      if ((colMask & (1 << val - 1)) !== 0) {
        let unique = null;
        for (let row = 0; row < BIG_SQ; ++row) {
          if ((this.markes[row][col] & (1 << val - 1)) !== 0) {
            if (unique !== null) {
              // Exist 2+ cell have val
              unique = null;
              break;
            }
            unique = { row, col, val };
          }
        }
        if (unique) {
          uniques.push(unique);
        }
      }
    }

    return uniques;
  }

  getUniqueSquare(iRow, iCol) {
    const uniques = [];
    const blockMask = this.blocksMask[iRow][iCol];
    if (blockMask === 0) {
      return uniques;
    }
    for (let val = 1; val <= BIG_SQ; val++) {
      // `val` avaiable is this col
      if ((blockMask & (1 << val - 1)) !== 0) {
        let unique = null;
        for (let i = 0; i < BIG_SQ; ++i) {
          const row = iRow * SMALL_SQ + trunc[i];
          const col = iCol * SMALL_SQ + (i % SMALL_SQ);
          if ((this.markes[row][col] & (1 << val - 1)) !== 0) {
            if (unique !== null) {
              // Exist 2+ cell have val
              unique = null;
              break;
            }
            unique = { row, col, val };
          }
        }
        if (unique) {
          uniques.push(unique);
        }
      }
    }

    return uniques;
  }

  fillAllMark() {
    for (let row = 0; row < BIG_SQ; ++row) {
      for (let col = 0; col < BIG_SQ; ++col) {
        this.markes[row][col] = this.getMask(row, col);
      }
    }
  }
}

module.exports = {
  SMALL_SQ,
  BIG_SQ,
  BitCandidates,
};
