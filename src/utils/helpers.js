import { nanoid } from 'nanoid'
import { NUM_ROWS, NUM_COLS, USER, AI } from './constants'

/**
 * Create and return a cell object with unique id and player.
 * Id is used as key when rendering list in react.
 *
 * @param {Number} player - Either 0, 1, or 2
 * @returns {Object} - Cell object with id and player
 */
export const createNewCell = player => ({
  id: nanoid(),
  player,
  isHighlighted: false,
})

/**
 * Returns deep copy of the board matrix.
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @returns {Object[][]} - Deep copy of board matrix
 */
export const copyBoard = board =>
  board.map(row => row.map(cell => ({ ...cell })))

/**
 * Returns a new board with no highlighted cells.
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @returns {Object[][]} - New board with no highlighed cells.
 */
export const removeHighlightedCells = board => {
  const res = copyBoard(board)
  res.forEach(row => row.forEach(cell => (cell.isHighlighted = false)))
  return res
}

/**
 * Checks if position is in bounds.
 *
 * @param {Number} r - Row
 * @param {Number} c - Column
 * @returns {Boolean} - True if row, col is in bounds
 */
export const isInBounds = (r, c) =>
  r >= 0 && c >= 0 && r < NUM_ROWS && c < NUM_COLS

/**
 * Get opponent number.
 *
 * @param {Number} player
 * @returns {Number} - Opponent
 */
export const getOpponent = player => (player === USER ? AI : USER)

/**
 * Checks if cell object is empty.
 *
 * @param {Object} {player} - Player number
 * @returns {Boolean} - True if cell is empty
 */
export const isEmptyCell = ({ player }) => !Boolean(player)
