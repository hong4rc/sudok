class BitCandidates {
  constructor(factory) {
    this.factory = factory;
    this.colsMask = [];
    this.rowsMask = [];
    this.blocksMask = [];
    for (let i = 0; i < this.factory.length; ++i) {
      this.colsMask[i] = this.factory.allBit;
      this.rowsMask[i] = this.factory.allBit;
      if (i % this.factory.height === 0) {
        this.blocksMask[this.factory.truncH[i]] = [];
      }
      this.blocksMask[this.factory.truncH[i]][i % this.factory.height] = this.factory.allBit;
    }
    this.markes = new Array(this.factory.length);

    for (let i = 0; i < this.factory.length; ++i) {
      this.markes[i] = new Array(this.factory.length);
    }
  }

  /**
   * Marks a value as used for that row, that col and that block
   */
  useVal(row, col, val) {
    const bit = ~(1 << (val - 1));
    const bit2 = 1 << (val - 1);
    const blockRow = this.factory.truncH[row];
    const blockCol = this.factory.truncW[col];
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
    const blockRow = this.factory.truncH[row];
    const blockCol = this.factory.truncW[col];
    this.blocksMask[blockRow][blockCol] |= bit;
  }

  /**
   *  Returns the bitmask for the valid values for that cell
   */
  getMask(row, col) {
    if (this.grid[row][col]) {
      return 0;
    }
    const blockRow = this.factory.truncH[row];
    const blockCol = this.factory.truncW[col];
    const mask = this.rowsMask[row] & this.colsMask[col] & this.blocksMask[blockRow][blockCol];
    return mask;
  }

  getUnique() {
    this.fillAllMark();
    const uniques = [];
    for (let row = 0; row < this.factory.length; ++row) {
      uniques.push(...this.getUniqueRow(row));
    }
    for (let col = 0; col < this.factory.length; ++col) {
      uniques.push(...this.getUniqueCol(col));
    }
    for (let iRow = 0; iRow < this.factory.height; ++iRow) {
      for (let iCol = 0; iCol < this.factory.width; ++iCol) {
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
    for (let val = 1; val <= this.factory.length; ++val) {
      // `val` avaiable is this row
      if ((rowMask & (1 << val - 1)) !== 0) {
        let unique = null;
        for (let col = 0; col < this.factory.length; ++col) {
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
    for (let val = 1; val <= this.factory.length; ++val) {
      // `val` avaiable is this col
      if ((colMask & (1 << val - 1)) !== 0) {
        let unique = null;
        for (let row = 0; row < this.factory.length; ++row) {
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
    for (let val = 1; val <= this.factory.length; ++val) {
      // `val` avaiable is this col
      if ((blockMask & (1 << val - 1)) !== 0) {
        let unique = null;
        for (let i = 0; i < this.factory.length; ++i) {
          const row = iRow * this.factory.height + this.factory.truncH[i];
          const col = iCol * this.factory.width + (i % this.factory.width);
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
    for (let row = 0; row < this.factory.length; ++row) {
      for (let col = 0; col < this.factory.length; ++col) {
        this.markes[row][col] = this.getMask(row, col);
      }
    }
  }
}

module.exports = {
  BitCandidates,
};
