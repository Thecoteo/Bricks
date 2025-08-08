const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ball
let x = canvas.width / 2;
let y = canvas.height - 40;
let dx = 3;
let dy = -3;
const ballRadius = 10;

// Paddle
const paddleHeight = 12;
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

// Controls
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

function keyDownHandler(e) {
  if (e.key === 'ArrowRight') rightPressed = true;
  else if (e.key === 'ArrowLeft') leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === 'ArrowRight') rightPressed = false;
  else if (e.key === 'ArrowLeft') leftPressed = false;
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.getBoundingClientRect().left;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// Bricks
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 60;
const brickHeight = 24;
const brickPadding = 12;
const brickOffsetTop = 40;
const brickOffsetLeft = 40;
const brickColors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6'];
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

let score = 0;
let lives = 3;

function drawBall() {
  ctx.beginPath();
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#f1c40f';
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#f1c40f';
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function drawPaddle() {
  ctx.beginPath();
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ffffff';
  ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
  // Paddle in bright white for contrast
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.shadowBlur = 8;
        ctx.shadowColor = brickColors[r % brickColors.length];
        ctx.fillStyle = brickColors[r % brickColors.length];
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
        ctx.closePath();
        ctx.shadowBlur = 0;
      }
    }
  }
}

function drawScore() {
  ctx.font = '18px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Score: ' + score, 20, 30);
}

function drawLives() {
  ctx.font = '18px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Lives: ' + lives, canvas.width - 100, 30);
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1 && x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
        dy = -dy;
        b.status = 0;
        score++;
        if (score === brickRowCount * brickColumnCount) {
          alert('YOU WIN, CONGRATS!');
          document.location.reload();
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Bounce logic
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius - paddleHeight - 10) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    else {
      lives--;
      if (lives === 0) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 40;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Move paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 10;
  else if (leftPressed && paddleX > 0) paddleX -= 10;

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
