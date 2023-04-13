// Set up our drawing canvas
const canvas  = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Set up our constant values
const numBlocksVert = 6;
const numBlocksHorz = 10;
const blockWidth    = 50;
const blockHeight   = 20;
const blockMargin   = 2;
const blockColors   = [ 'purple', 'blue', 'green', 'yellow', 'orange', 'red' ];
const screenWidth   = numBlocksHorz * (2 * blockMargin + blockWidth);
const screenHeight  = 400 + numBlocksVert * (2 * blockMargin + blockHeight);
const batWidth      = 100;
const batHeight     = 20;
const batY          = screenHeight - batHeight - blockMargin;
const batColor      = 'black';
const ballWidth     = 20;
const ballColor     = 'black';

// Set up the size of the screen
canvas.width  = screenWidth;
canvas.height = screenHeight;

// Set up our changing values
var batX          = screenWidth / 2 - batWidth / 2;
var ballX         = screenWidth / 2 - ballWidth / 2;
var ballY         = screenHeight / 2 - ballWidth / 2;
var ballVelocityX = 0;
var ballVelocityY = 0;
var gameStarted   = false;
var gameWin       = false;
var gameLose      = false;

// Set up our blocks
var blocks = []
for (var y = 0; y < numBlocksVert; y++) {
  for (var x = 0; x < numBlocksHorz; x++) {
    blocks.push({
      blockX: x * (2 * blockMargin + blockWidth) + blockMargin,
      blockY: y * (2 * blockMargin + blockHeight) + blockMargin,
      color: blockColors[y],
      alive: true,
    });
  }
}

// Move the bat when we move our mouse
canvas.addEventListener('mousemove', (event) => {
  var rect = canvas.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  batX = mouseX - batWidth / 2;
});

// Wait for the user to click to start
canvas.addEventListener('click', () => {
  // Start the game if it's not started
  if (!gameStarted) {
    gameStarted = true;
    ballVelocityY = 8;
  }
});

// Render text on the screen
function renderText(text) {
  context.font = '48px sans-serif';
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.fillText(text, screenWidth / 2, screenHeight / 2);
}

// Render a rectangle
function renderRect(x, y, w, h, color) {
  context.beginPath();
  context.rect(x, y, w, h);
  context.fillStyle = color;
  context.fill();
}

// Check if two blocks are touching
function isBallTouching(x, y, w, h) {
  var left = Math.max(x, ballX);
  var right = Math.min(x + w, ballX + ballWidth);
  var top = Math.max(y, ballY);
  var bottom = Math.min(y + h, ballY + ballWidth);
  return left < right && top < bottom;
}

// Update the game state
function update() {

  // Clear what we drew before
  context.clearRect(0, 0, screenWidth, screenHeight);

  // If we didn't start, show start message
  if (!gameStarted) {
    renderText('Click to start');
    return;
  }
  // If we won, show win message
  if (gameWin) {
    renderText('You won :)');
    return;
  }
  // If we lost, show lose message
  if (gameLose) {
    renderText('You lost :(');
    return;
  }

  // Draw our blocks at the top
  for (var block of blocks) {
    if (block.alive) {
      renderRect(block.blockX, block.blockY, blockWidth, blockHeight, block.color);
    }
  }

  // Draw our bat at the bottom
  renderRect(batX, batY, batWidth, batHeight, batColor);

  // Draw the ball
  renderRect(ballX, ballY, ballWidth, ballWidth, ballColor);

  // Move the ball in the direction it's going
  ballX += ballVelocityX;
  ballY += ballVelocityY;

  // If the ball is touching the bat, bounce it up
  if (isBallTouching(batX, batY, batWidth, batHeight)) {
    // If ball is moving down
    if (ballVelocityY > 0) {
      // Make it move up
      ballVelocityY *= -1;
      // Add some random spin to the ball
      ballVelocityX += Math.random() * 4 - 2;
    }
  }

  // If the ball is touching the top wall, bounce it down
  if (ballY <= 0) {
    // If ball is moving up
    if (ballVelocityY < 0) {
      // Make it move down;
      ballVelocityY *= -1;
    }
  }

  // If the ball is touching the left wall, bounce it right
  if (ballX <= 0) {
    // If ball is moving left
    if (ballVelocityX < 0) {
      // Make it move right;
      ballVelocityX *= -1;
    }
  }

  // If the ball is touching the right wall, bounce it left
  if (ballX + ballWidth >= screenWidth) {
    // If ball is moving right
    if (ballVelocityX > 0) {
      // Make it move left;
      ballVelocityX *= -1;
    }
  }

  // If the ball is touching the bottom wall, we lost
  if (ballY + ballWidth >= screenHeight) {
    gameLose = true;
    return;
  }

  // If the ball is touching a block, then delete the block and bounce
  for (var block of blocks) {
    // If block is alive and ball is touching it
    if (block.alive && isBallTouching(block.blockX, block.blockY, blockWidth, blockHeight)) {
      // Then the block is now not alive
      block.alive = false;
      // We also want to bounce our ball down
      if (ballVelocityY < 0) {
        ballVelocityY *= -1;
      }
    }
  }

  // If all of the blocks aren't alive, then we won
  if (blocks.every(block => !block.alive)) {
    gameWin = true;
  }

}

// Run the update once 60 times per second
setInterval(update, 16);
