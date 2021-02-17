// Functions for AI moves.
import { findValidMoves, makeMove } from './checkers'
import { AI } from './constants'

/**
 * Plays arbitrary move. By definition, must play a capture move if possible.
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @returns {Object[][]} New board after AI move.
 */
export const makeAIMove = board => {
  let startRow = 0
  let startCol = 0
  let endRow = 0
  let endCol = 0
  board.some((row, r) =>
    row.some((val, c) => {
      if (val.player !== AI) {
        return false
      }
      const boardToCompare = findValidMoves(board, [r, c])
      return boardToCompare.some((row, r2) =>
        row.some(({ isHighlighted }, c2) => {
          if (!isHighlighted) {
            return false
          }
          startRow = r
          startCol = c
          endRow = r2
          endCol = c2
          return true
        })
      )
    })
  )
  const { board: newBoard } = makeMove(
    board,
    [startRow, startCol],
    [endRow, endCol]
  )
  return newBoard
}
