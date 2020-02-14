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
});
