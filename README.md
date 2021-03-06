# sudok
[![version](https://img.shields.io/npm/v/sudok?color=green)](https://www.npmjs.com/package/sudok)
[![GitHub CI](https://github.com/Hongarc/sudok/workflows/GitHub%20CI/badge.svg)](https://github.com/Hongarc/sudok/actions?query=workflow%3A%22GitHub+CI%22)
[![codecov](https://codecov.io/gh/Hongarc/sudok/branch/master/graph/badge.svg)](https://codecov.io/gh/Hongarc/sudok)

> Solver sudoku and other functions

Folk from https://github.com/brunoccc/sudokujs


## Install

```
$ npm install sudok
```


## Usage

```js
const Sudoku = require('sudok');

const grid = [
  [0, 0, 3, 0, 5, 6, 7, 8, 0],
  [4, 0, 6, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 4, 8, 9, 5],
  [0, 7, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 7],
  [3, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 7, 6, 0, 0],
  [9, 0, 0, 3, 4, 0, 0, 0, 2],
]; // 9x9

// Get all result from this grid
const sudoku = new Sudoku(grid);
if (sudoku.solve()) {
  console.log(`Get ${sudoku.results.length} results:`);
  for (let i = 0; i < sudoku.results.length; ++i) {
    console.log(`result ${i}:\n`);
    console.log(sudoku.result(i));
  }
} else {
  console.log('Impossible!');
}

sudoku.quizz();
console.log(sudoku.toString());
//=> show a grid, what is minimum grid from origin grid
```


## API

### new Sudoku(grid, smallWidth, smallheight)

#### grid

Type: `number[][]`

Array int 2d with size is `smallWidth * smallheight`, between 1 and `smallWidth * smallheight`

#### smallWidth, smallheight

Type: `number`

Width and height of small inside big square

### Instance

The instance is a sudoku board

#### .solve(limit = 0)

Solve all sudoku

##### limit

Type: `number`

Default: 0 (no limit)

Set maximum size of result

#### .toString()

The virtual `grid` of sudoku with a simple border

#### .result(index = 0)

The virtual result after `solve` with a simple border

##### index

Type: `number`

Default: 0

Index of result in a list all results
