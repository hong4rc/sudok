const SMALL_SQ = 3;
const BIG_SQ = SMALL_SQ * SMALL_SQ;
const ALL_BITS = 0x1FF; // 9 bits set to 1

class BitCandidates {
  constructor() {
    this.colsMask = [];
    this.rowsMask = [];
    this.blocksMask = [];
    for (let i = 0; i < 9; i++) {
      this.colsMask[i] = ALL_BITS;
      this.rowsMask[i] = ALL_BITS;
      if (!this.blocksMask[Math.trunc(i / 3)]) {
        this.blocksMask[Math.trunc(i / 3)] = [];
      }
      this.blocksMask[Math.trunc(i / 3)][i % 3] = ALL_BITS;
    }
  }

  /**
   * Marks a value as used for that row, that col and that block
   */
  useVal(row, col, val) {
    const bit = ~(1 << (val - 1));
    this.colsMask[col] &= bit;
    this.rowsMask[row] &= bit;
    const { blockRow, blockCol } = BitCandidates.getBlockRowCol(row, col);
    this.blocksMask[blockRow][blockCol] &= bit;
  }

  /**
   * Sets a value as available again for that row, that col and that block
   */
  clearVal(row, col, val) {
    const bit = (1 << (val - 1));
    this.colsMask[col] |= bit;
    this.rowsMask[row] |= bit;
    const { blockRow, blockCol } = BitCandidates.getBlockRowCol(row, col);
    this.blocksMask[blockRow][blockCol] |= bit;
  }

  /**
   *  Returns the bitmask for the valid values for that cell
   */
  getMask(row, col) {
    const { blockRow, blockCol } = BitCandidates.getBlockRowCol(row, col);
    const mask = this.rowsMask[row] & this.colsMask[col] & this.blocksMask[blockRow][blockCol];
    return mask;
  }

  /**
   * Return the row and col of the block of the specified cell
   */
  static getBlockRowCol(row, col) {
    const blockRow = Math.trunc(row / 3);
    const blockCol = Math.trunc(col / 3);
    return { blockRow, blockCol };
  }
}

module.exports = {
  SMALL_SQ,
  BIG_SQ,
  BitCandidates,
};
