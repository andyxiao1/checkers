import { createNewCell } from './helpers'

// Checkers Constants
export const NUM_ROWS = 8
export const NUM_COLS = 8
const board = [
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
]
board.forEach((row, i) => {
  row.forEach((val, j) => {
    board[i][j] = createNewCell(val)
  })
})
export const INITIAL_BOARD = board
export const USER = 1
export const AI = 2

// Colors
export const DARK = '#BA7A3A'
export const LIGHT = '#FFE4C4'
export const WHITE = '#FFFFFF'
export const RED = '#ff0000'
export const BLACK = '#000000'
export const HIGHLIGHT = '#87cefa'
