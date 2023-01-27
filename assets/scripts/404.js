let cols = 30;
let rows = 15;
let size = 30;

let height = rows * size;
let width = cols * size;

let cells;
let player;

let startX = 0;
let startY = 0;
let endX = cols - 1;
let endY = rows - 1;

class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.up = true;
    this.down = true;
    this.left = true;
    this.right = true;

    this.visited = false;
  }
}

function generateMaze() {
  canvas = document.getElementById("maze");
  maze = canvas.getContext("2d");

  canvas.height = height;
  canvas.width = width;

  cells = [];
  for (let i = 0; i < cols; i++) {
    cells[i] = []
    for (let j = 0; j < rows; j++) {
      cells[i][j] = new Cell(i, j);
    }
  }

  randX = Math.floor(Math.random() * cols);
  randY = Math.floor(Math.random() * rows);

  stack = []
  stack.push(cells[randX][randY]);

  while (hasUnvisited()) {
    cur = stack[stack.length - 1];
    cur.visited = true;

    if (
      (cur.x !== 0 && !cells[cur.x - 1][cur.y].visited) ||
      (cur.x !== (cols - 1) && !cells[cur.x + 1][cur.y].visited) ||
      (cur.y !== 0 && !cells[cur.x][cur.y - 1].visited) ||
      (cur.y !== (rows - 1) && !cells[cur.x][cur.y + 1].visited)
    ) {
      next = null;
      found = false;

      do {
        dir = Math.floor(Math.random() * 4);
        switch (dir) {
          case 0:
            if (cur.x !== (cols - 1) && !cells[cur.x + 1][cur.y].visited) {
              cur.right = false;
              next = cells[cur.x + 1][cur.y];
              next.left = false;
              found = true;
            }
            break;
          case 1:
            if (cur.y !== 0 && !cells[cur.x][cur.y - 1].visited) {
              cur.up = false;
              next = cells[cur.x][cur.y - 1];
              next.down = false;
              found = true;
            }
            break;
          case 2:
            if (cur.y !== (rows - 1) && !cells[cur.x][cur.y + 1].visited) {
              cur.down = false;
              next = cells[cur.x][cur.y + 1];
              next.up = false;
              found = true;
            }
            break;
          case 3:
            if (cur.x !== 0 && !cells[cur.x - 1][cur.y].visited) {
              cur.left = false;
              next = cells[cur.x - 1][cur.y];
              next.right = false;
              found = true;
            }
            break;
        }
        if (found) {
          stack.push(next);
        }
      } while (!found)
    } else {
      cur = stack.pop();
    }
  }
  console.log(cells);

  // draw maze
  maze.fillStyle = "#ffffff";
  maze.fillRect(0, 0, canvas.width, canvas.height);
  maze.strokeStyle = "#444444";
  maze.strokeRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (cells[i][j].up) {
        maze.beginPath();
        maze.moveTo(i * size, j * size);
        maze.lineTo((i + 1) * size, j * size);
        maze.stroke();
      }
      if (cells[i][j].down) {
        maze.beginPath();
        maze.moveTo(i * size, (j + 1) * size);
        maze.lineTo((i + 1) * size, (j + 1) * size);
        maze.stroke();
      }
      if (cells[i][j].left) {
        maze.beginPath();
        maze.moveTo(i * size, j * size);
        maze.lineTo(i * size, (j + 1) * size);
        maze.stroke();
      }
      if (cells[i][j].right) {
        maze.beginPath();
        maze.moveTo((i + 1) * size, j * size);
        maze.lineTo((i + 1) * size, (j + 1) * size);
        maze.stroke();
      }
    }
  }

  image = new Image();
  image.src = ("./assets/images/home.png");
  image.onload = function () {
    maze.drawImage(image, (endX + 0.2) * size, (endY + 0.2) * size, size * 0.6, size * 0.6);
  };
}

function hasUnvisited() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!cells[i][j].visited) {
        return true;
      }
    }
  }
  return false;
}

function generateGame(x, y) {
  canvas = document.getElementById("game");
  game = canvas.getContext("2d");

  canvas.height = height;
  canvas.width = width;

  game.beginPath();
  game.fillStyle = "#444444";
  game.arc((x * size) + (size / 2), (y * size) + (size / 2), size * 0.35, 0, 2 * Math.PI, false);
  game.fill();
}

function movePlayer(event) {
  switch (event.keyCode) {
    case 37:
      if (!cells[player.x][player.y].left) {
        player.x--;
      }
      break;
    case 39:
      if (!cells[player.x][player.y].right) {
        player.x++;
      }
      break;
    case 40:
      if (!cells[player.x][player.y].down) {
        player.y++;
      }
      break;
    case 38:
      if (!cells[player.x][player.y].up) {
        player.y--;
      }
      break;
  }

  if (player.x != endX || player.y != endY) {
    generateGame(player.x, player.y);
  } else {
    window.alert("You found your way home! You'll be there soon!");
    window.location.href = "/";
  }
}

generateMaze();
generateGame(startX, startY);

player = new Player;

document.addEventListener("keydown", movePlayer);
