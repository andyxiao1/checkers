# Checkers App

## Features

- basic checkers game play: turns, basic moves, jumping over enemies
- drag-n-drop movement with mouse
- highlight possible moves on mouseover
- forced capture
- AI that plays any valid move
- board implemented with css-grid

## Design

- I tried to separate out logic and presentation, abstracting the checkers game logic into `utils/checkers.js`
- a sort of more functional approach where we output a new board after every move (works better with react setstate)

## Rules of Checkers

- 8x8 board
- light color in bottom right
- checkers on dark squares
- goal: capture all opponents pieces or trap them so they have no moves
- checkers can move diagonally forward 1 space
- take turns moving 1 checker at a time
- capture: jumping opponents checker with your own, requires square behind it to be empty
- can have multiple captures in one move, must be forward if not king
- king checker if you reach the other side of the board, can move forward or backwards
- forced capture

## Technology Choices

- yarn > npm: I like yarn + speed eventhough it doesn't matter for such a small webapp
- parcel > create-react-app: lightweight + simpler, no webpack, overall much more enjoyable
- no redux: didn't think I really needed it for such a small app
- netlify hosting: simplicity
- styling: styled components

## Notes

- if I had more time I would implement game stats, save state in localStorage to persist across sessions, use a stack to be able to undo moves, and add styling themes + animations
