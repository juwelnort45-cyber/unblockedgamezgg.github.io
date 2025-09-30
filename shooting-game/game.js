const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = { x: 220, y: 580, w: 40, h: 20, speed: 5 };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

function drawPlayer() {
  ctx.fillStyle = '#0f0';
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawBullets() {
  ctx.fillStyle = '#ff0';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
}

function drawEnemies() {
  ctx.fillStyle = '#f00';
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function moveBullets() {
  bullets.forEach(b => b.y -= b.speed);
  bullets = bullets.filter(b => b.y > -b.h);
}

function moveEnemies() {
  enemies.forEach(e => e.y += e.speed);
  enemies = enemies.filter(e => e.y < canvas.height + e.h);
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 40);
  enemies.push({ x, y: -20, w: 40, h: 20, speed: 2 + Math.random() * 2 });
}

function detectCollisions() {
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score += 10;
      }
    });
  });
  enemies.forEach(e => {
    if (e.x < player.x + player.w && e.x + e.w > player.x && e.y < player.y + player.h && e.y + e.h > player.y) {
      gameOver = true;
    }
  });
}

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = '#fff';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', 120, 320);
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 200, 360);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();
  moveBullets();
  moveEnemies();
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

let left = false, right = false;
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') left = true;
  if (e.key === 'ArrowRight') right = true;
  if (e.key === ' ' && !gameOver) {
    bullets.push({ x: player.x + player.w/2 - 2, y: player.y, w: 4, h: 10, speed: 7 });
  }
});
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft') left = false;
  if (e.key === 'ArrowRight') right = false;
});

function updatePlayer() {
  if (left && player.x > 0) player.x -= player.speed;
  if (right && player.x < canvas.width - player.w) player.x += player.speed;
}

setInterval(() => {
  if (!gameOver) spawnEnemy();
}, 1000);

function mainLoop() {
  updatePlayer();
  requestAnimationFrame(mainLoop);
}

gameLoop();
mainLoop();
