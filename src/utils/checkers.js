// Functions for Checkers game.
import {
  createNewCell,
  copyBoard,
  isInBounds,
  getOpponent,
  isEmptyCell,
} from './helpers'
import { USER } from './constants'

const USER_NEIGHBOR_DELTAS = [
  [-1, -1],
  [-1, 1],
]
const AI_NEIGHBOR_DELTAS = [
  [1, 1],
  [1, -1],
]

// ================================================================================================
//                                       EXPORTED FUNCTIONS
// ================================================================================================

/**
 * Find and return the valid moves for a user's piece.
 * Returns an the a copy of the original board if there is no piece at the passed in posiiton.
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @param {Number[]} [row, col] - Position of cell we want to find moves for
 * @returns {Object[][]} - New board with potential moves highlighted (flag in cell object)
 */
export const findValidMoves = (board, [row, col]) => {
  const boardCopy = copyBoard(board)

  if (!isInBounds(row, col) || isEmptyCell(boardCopy[row][col])) {
    return boardCopy
  }

  const { player } = boardCopy[row][col]
  const neighborDeltas =
    player === USER ? USER_NEIGHBOR_DELTAS : AI_NEIGHBOR_DELTAS

  // Highlight direct neighbors if the user cannot capture any pieces.
  if (!canCaptureEnemyChecker(boardCopy, player)) {
    findDirectNeighborMoves(boardCopy, neighborDeltas, [row, col])
  } else {
    // Highlight all possible capture moves if the user can capture any piece.
    findCaptureMoves(boardCopy, neighborDeltas, player, [row, col])
  }

  return boardCopy
}

/**
 * Make move, returning the new board.
 * If multiple jumps, it chooses an arbitrary valid path to the end position.
 * Right now, we do not do anything if the move is invalid (return a copy of the original board).
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @param {Number[]} [startRow, startCol] - Piece to move
 * @param {Number[]} [endRow, endCol] - End position of moved piece
 * @returns {Object} - New board after move and whether or not the move was successful
 */
export const makeMove = (board, [startRow, startCol], [endRow, endCol]) => {
  const boardCopy = copyBoard(board)

  // Initial check to see if move is valid.
  if (
    !isInBounds(startRow, startCol) ||
    !isInBounds(endRow, endCol) ||
    isEmptyCell(boardCopy[startRow][startCol]) ||
    !isEmptyCell(boardCopy[endRow][endCol])
  ) {
    return { board: boardCopy, successful: false }
  }

  let successful = false
  const { player } = boardCopy[startRow][startCol]
  const neighborDeltas =
    player === USER ? USER_NEIGHBOR_DELTAS : AI_NEIGHBOR_DELTAS
  const rowDelta = endRow - startRow
  const colDelta = endCol - startCol

  // Check if it is a valid non-capture move.
  const isValidMove = neighborDeltas.some(
    ([dr, dc]) => dr === rowDelta && dc === colDelta
  )
  if (!canCaptureEnemyChecker(board, player) && isValidMove) {
    const tmp = boardCopy[startRow][startCol]
    boardCopy[startRow][startCol] = boardCopy[endRow][endCol]
    boardCopy[endRow][endCol] = tmp
    successful = true
  } else {
    // Otherwise the move must capture some opponent piece
    successful = makeCaptureMove(
      boardCopy,
      neighborDeltas,
      player,
      [startRow, startCol],
      [endRow, endCol]
    )
  }

  return { board: boardCopy, successful }
}

/**
 * Check if the game is over.
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @param {Number} player - Player whose turn it currently is
 * @returns {Boolean} - True if the game is over
 */
export const isGameOver = (board, player) => {
  // Check to see if the current player has any pieces left.
  const hasAnyPieces = board.some(row => row.some(val => val.player === player))
  if (!hasAnyPieces) {
    return true
  }

  // Brute force: Check whether any piece the player has has a valid move (highlighted cell).
  const hasValidMove = board.some((row, r) =>
    row.some((val, c) => {
      if (val.player !== player) {
        return false
      }
      const boardToCompare = findValidMoves(board, [r, c])
      return boardToCompare.some(row =>
        row.some(({ isHighlighted }) => isHighlighted)
      )
    })
  )
  return !hasValidMove
}

// ================================================================================================
//                                       HELPER FUNCTIONS
// ================================================================================================

/**
 * Helper to highlight the direct empty neighbor cells in place.
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @param {Number[]} neighborDeltas - direction of deltas to check
 * @param {Number[]} [row, col] - Position of cell we want to find moves for
 */
const findDirectNeighborMoves = (board, neighborDeltas, [row, col]) => {
  neighborDeltas.forEach(([dr, dc]) => {
    const r = row + dr
    const c = col + dc
    if (isInBounds(r, c) && isEmptyCell(board[r][c])) {
      board[r][c].isHighlighted = true
    }
  })
}

/**
 * Helper to highlight the capture moves in place.
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @param {Number[]} neighborDeltas - direction of deltas to check
 * @param {Number} player - Either player 1 or 2
 * @param {Number[]} [row, col] - Position of cell we want to find moves for
 */
const findCaptureMoves = (board, neighborDeltas, player, [row, col]) => {
  // We employ a DFS approach to find all possible valid capture moves for user.
  const stack = [[row, col]]

  while (stack.length) {
    const [r, c] = stack.pop()
    neighborDeltas.forEach(([dr, dc]) => {
      // TODO: some repeated code could throw into a helper.
      const nextRow = r + dr
      const nextCol = c + dc
      const hopRow = r + 2 * dr
      const hopCol = c + 2 * dc

      const inBounds =
        isInBounds(nextRow, nextCol) && isInBounds(hopRow, hopCol)
      const canCapture =
        inBounds &&
        board[nextRow][nextCol].player === getOpponent(player) &&
        isEmptyCell(board[hopRow][hopCol])

      if (canCapture && !board[hopRow][hopCol].isHighlighted) {
        board[hopRow][hopCol].isHighlighted = true
        stack.push([hopRow, hopCol])
      }
    })
  }
}

/**
 * Helper function to check if the current player can capture an enemy checker.
 * If so, they must do so in game.
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @param {Number} player - Either player 1 or 2
 * @returns {Boolean} - Whether or not the player can capture an enemy checker
 */
const canCaptureEnemyChecker = (board, player) => {
  const neighborDeltas =
    player === USER ? USER_NEIGHBOR_DELTAS : AI_NEIGHBOR_DELTAS

  return board.some((row, r) =>
    row.some((val, c) => {
      if (val.player !== player) {
        return false
      }
      return neighborDeltas.some(([dr, dc]) => {
        const nextRow = r + dr
        const nextCol = c + dc
        const hopRow = r + 2 * dr
        const hopCol = c + 2 * dc

        const inBounds =
          isInBounds(nextRow, nextCol) && isInBounds(hopRow, hopCol)
        const canCapture =
          inBounds &&
          board[nextRow][nextCol].player === getOpponent(player) &&
          isEmptyCell(board[hopRow][hopCol])
        return canCapture
      })
    })
  )
}

/**
 * Performs move that captures piece(s) in place.
 *
 * @param {Object[][]} board - Matrix of cell objects
 * @param {Number[]} neighborDeltas - direction of deltas to check
 * @param {Number} player - Either player 1 or 2
 * @param {Number[]} [startRow, startCol] - Piece to move
 * @param {Number[]} [endRow, endCol] - End position of moved piece
 * @returns {Boolean} - Whether or not the move was successful
 */
const makeCaptureMove = (
  board,
  neighborDeltas,
  player,
  [startRow, startCol],
  [endRow, endCol]
) => {
  // Perform a DFS keeping track of the path until we find the end position and then update board.
  // Since we currently can only go in one direction (no king piece) we don't need to maintain a seen array.
  const stack = [[startRow, startCol, [[startRow, startCol]]]] // [currRow, currCol, [path]]

  while (stack.length) {
    const [r, c, path] = stack.pop()

    // When we the end position we make the start position + every
    // in-between position in the path an empty cell.
    if (r === endRow && c === endCol) {
      board[endRow][endCol] = board[startRow][startCol]
      path.forEach(([row, col]) => (board[row][col] = createNewCell(0)))
      return true
    }

    neighborDeltas.forEach(([dr, dc]) => {
      const nextRow = r + dr
      const nextCol = c + dc
      const hopRow = r + 2 * dr
      const hopCol = c + 2 * dc

      const inBounds =
        isInBounds(nextRow, nextCol) && isInBounds(hopRow, hopCol)
      const canCapture =
        inBounds &&
        board[nextRow][nextCol].player === getOpponent(player) &&
        isEmptyCell(board[hopRow][hopCol])

      if (canCapture) {
        stack.push([hopRow, hopCol, [...path, [nextRow, nextCol]]])
      }
    })
  }
  return false
}
