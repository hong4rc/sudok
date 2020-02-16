const Sudoku = require('..');
const listGrid = require('./fixture/grid');

describe('Sudoku', () => {
  test('One result', () => {
    listGrid.oneResult.forEach((grid) => {
      const sudoku = new Sudoku(grid);
      sudoku.solve();
      expect(sudoku.results).toHaveLength(1);
    });
  });

  test('Out of length result', () => {
    listGrid.oneResult.forEach((grid) => {
      const sudoku = new Sudoku(grid);
      sudoku.solve();
      expect(() => sudoku.result(2)).toThrowError();
    });
  });

  test('Set duplicate', () => {
    listGrid.oneResult.forEach((grid) => {
      expect(() => {
        const sudoku = new Sudoku(grid);
        sudoku.set(0, 0, 1);
        sudoku.set(0, 0, 2);
      }).toThrowError('Cannot set');
    });
  });

  test('Fill unique', () => {
    const sudoku = new Sudoku(listGrid.autofill);
    sudoku.solve();
  });

  test('Throw invalid grid', () => {
    listGrid.invalid.forEach((grid) => {
      expect(() => new Sudoku(grid)).toThrowError();
    });
  });

  test('None grid => multi-result', () => {
    const sudoku = new Sudoku(listGrid.none);
    [1, 2, 5, 8].forEach((limit) => {
      sudoku.solve(limit);
      expect(sudoku.results).toHaveLength(limit);
    });
  });

  test('Against the brute force', () => {
    const sudoku = new Sudoku(listGrid.againstBF.grid);
    sudoku.solve();
    expect(sudoku.results[0]).toEqual(listGrid.againstBF.expected);
  });

  test('Impossible to solve grid', () => {
    const sudoku = new Sudoku(listGrid.impossible);
    expect(sudoku.solve()).toBeFalsy();
  });

  test('Create quizz', () => {
    const sudoku = new Sudoku(listGrid.none);
    sudoku.quizz();
    sudoku.solve();
    expect(sudoku.results).toHaveLength(1);
  });

  test('Create quizz from impossible', () => {
    const sudoku = new Sudoku(listGrid.impossible);
    expect(() => sudoku.quizz()).toThrowError('Can\'t solve this sudoku board');
  });

  test('Get string of board', () => {
    const sudoku = new Sudoku(listGrid.none);
    sudoku.solve(1);
    expect(typeof sudoku.toString()).toEqual('string');
    expect(typeof sudoku.result()).toEqual('string');
    expect(sudoku.code().match(/\d/g)).toHaveLength(81);
  });
});
