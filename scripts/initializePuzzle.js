const puzzleCtr = document.getElementById('puzzle');
const msgBox = document.getElementById('message-box');

const puzzleWidth = 9;
const puzzleHeight = 9;

puzzleCtr.classList.add('puzzle');

for (let i = 0; i < puzzleHeight; i++) {
  const row = document.createElement('section');
  row.classList.add('row');
  puzzleCtr.appendChild(row);

  for (let j = 0; j < puzzleWidth; j++) {
    const cell = document.createElement('input');
    cell.classList.add('cell');
    cell.maxLength = 1;
    row.appendChild(cell);
  }
}

const puzzleRows = document.querySelectorAll('.puzzle .row');
let puzzle = [];
puzzleRows.forEach((row) => {
  let parsedRow = row.querySelectorAll('.cell');
  puzzle.push(parsedRow);
});
