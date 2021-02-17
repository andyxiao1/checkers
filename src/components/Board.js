import React, { useEffect, useState } from 'react'
import s from 'styled-components'
import {
  NUM_ROWS,
  NUM_COLS,
  DARK,
  LIGHT,
  WHITE,
  RED,
  BLACK,
  INITIAL_BOARD,
  HIGHLIGHT,
  USER,
  AI,
} from '../utils/constants'
import { findValidMoves, makeMove, isGameOver } from '../utils/checkers'
import { removeHighlightedCells, getOpponent } from '../utils/helpers'
import { makeAIMove } from '../utils/ai'

const Grid = s.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  height: calc(40vw - 5px);
  width: calc(40vw - 5px);
  min-height: 600px;
  min-width: 600px;
  margin: auto;
  cursor: pointer;
`

const Cell = s.div`
  background-color: ${props =>
    props.isHighlighted
      ? HIGHLIGHT
      : props.row % 2
      ? props.col % 2
        ? LIGHT
        : DARK
      : props.col % 2
      ? DARK
      : LIGHT};
  display: flex;
  justify-content: center;
  align-items: center;
`

const Checker = s.div`
  transform: translate(0, 0); // workaround to have rounded edges when dragging
  height: calc(90% - 20px);
  width: calc(90% - 20px);
  border: 4px solid ${WHITE};
  border-radius: 50%;
  background-color: ${props => (props.player == USER ? RED : BLACK)};
`

const Board = () => {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [posDragged, setPosDragged] = useState([])
  const [turn, setTurn] = useState(USER)
  const [isGameOverBool, setIsGameOverBool] = useState(false)

  useEffect(() => {
    setIsGameOverBool(isGameOver(board, turn))
  }, [board])

  useEffect(() => {
    if (turn === AI && !isGameOverBool) {
      setTimeout(() => {
        setBoard(b => makeAIMove(b))
        setTurn(USER)
      }, 1000)
    }
  }, [turn])

  useEffect(() => {
    if (isGameOverBool) {
      alert(
        `Game Over! ${turn === USER ? 'You have won' : 'The Computer has won'}!`
      )
    }
  }, [isGameOverBool])

  const handleMouseEnter = (row, col) =>
    setBoard(b => findValidMoves(b, [row, col]))

  const handleMouseLeave = () => setBoard(b => removeHighlightedCells(b))

  const handleDragStart = (row, col) => setPosDragged([row, col])

  const handleDrop = (row, col) => {
    const { board: newBoard, successful } = makeMove(board, posDragged, [
      row,
      col,
    ])
    // If the user's move is successful, we check if the game is over and execute the AI's turn.
    if (successful) {
      setBoard(newBoard)
      setTurn(AI)
    }
  }

  return (
    <Grid>
      {[].concat(...board).map(({ player, id, isHighlighted }, i) => {
        const row = Math.floor(i / NUM_ROWS)
        const col = i % NUM_COLS

        return (
          <Cell
            key={id}
            row={row}
            col={col}
            isHighlighted={isHighlighted}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(row, col)}
          >
            {Boolean(player) && (
              <Checker
                onMouseEnter={
                  player === USER && turn == USER
                    ? () => handleMouseEnter(row, col)
                    : undefined
                }
                onMouseLeave={player === USER ? handleMouseLeave : undefined}
                draggable={player === USER && turn === USER}
                onDragStart={() => handleDragStart(row, col)}
                player={player}
              />
            )}
          </Cell>
        )
      })}
    </Grid>
  )
}

export default Board
