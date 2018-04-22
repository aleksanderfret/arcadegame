class GameEntity {
  constructor() {
    this.x;
    this.y;
    this.stepY = 83;
    this.stepX = 101;
    this.edges = {
      left: 0,
      right: 101,
      top: 0,
      bottom: 171
    }
  }

  getEdge(edge){
    const coord = (['left','right'].includes(edge)) ? 'x' : 'y';
    return this[coord] + this.edges[edge];
  }
}

// Enemies our player must avoid
class Enemy extends GameEntity{
  constructor(track, speed, startEdge = 'left') {
    super();
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.edges = {
      left: 0,
      right: 101,
      top: 74,
      bottom: 146
    }
    this.startEdge = startEdge;
    this.speed = speed;
    this.setStartPosition(this.startEdge, track);
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.startEdge === 'left') {
      if (this.x < 606) {
        this.x += this.speed*dt;
      } else {
        this.x = -101;
      }
    } else {
      if (this.x > -101) {
        this.x -= this.speed*dt;
      } else {
        this.x = 707;
      }
    }
  }

  increaseSpeed(speed) {
    this.speed = (this.speed >= speed) ? this.speed+10 : speed;
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  stop() {
    this.speed = 0;
  }

  setStartPosition(startEdge, track){
    const initialPosition = 63;
    if(this.startEdge === 'left') {
      this.sprite = 'img/enemy-bug.png';
      this.x = -101;
    } else {
      this.sprite = 'img/enemy-bug2.png';
      this.x = 707;
    }
    switch(track) {
      case 1:
        this.y = initialPosition;
        break;
      case 2:
        this.y = initialPosition + this.stepY;
        break;
      case 3:
        this.y = initialPosition + this.stepY*2;
        break;
      default:
        null;
    }
  }
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player extends GameEntity{
  constructor(sprite) {
    super();
    this.reset();
    this.minX = 0;
    this.minY = -10;
    this.maxX = 404;
    this.maxY = 405;
    this.sprite = sprite;
    let lives = 3;
    this.edges = {
      left: 20,
      right: 81,
      top: 60,
      bottom: 143
    }
    this.getLives = () => {
      return lives;
    }
    this.decreaseLives = () => {
      lives = (lives>0) ? lives-1 : lives;
    }
  }

  reset() {
    this.isDead = false;
    this.x = 202;
    this.y = 405;
  }

  update() {

  }


  die() {
    this.isDead = true;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(direction){
    if(this.isDead){
      return;
    }
    switch (direction) {
      case 'left':
        this.x = Math.max((this.x - this.stepX), this.minX);
        break;
      case 'right':
        this.x = Math.min((this.x + this.stepX), this.maxX);
        break;
      case 'up':
        this.y = Math.max((this.y - this.stepY), this.minY);
        break;
      case 'down':
        this.y = Math.min((this.y + this.stepY), this.maxY);
        break;
      default:
        null;
    }
  }
}

class Game {
  constructor() {
    this.maxLevel = 12;
    this.lock = false;
    this.enemies = [];
    this.createEnemies(level.getLevel());
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  calculateEnemiesNumber(level) {
    const enemiesNumberRange = [];
    let min;
    let max;
    if (level <= 2) {
      min = 3;
      max = 3;
    } else if (level <=4) {
      min = 4;
      max = 5;
    } else if (level <=6) {
      min = 5;
      max = 7;
    } else if (level <=8) {
      min = 6;
      max = 8;
    } else if (level <=10) {
      min = 7;
      max = 10;
    } else {
      min = 8;
      max = 12;
    }
    enemiesNumberRange.push(min, max);
    return enemiesNumberRange;
  }
  calculateEnemiesSpeed(level){
    const enemiesSpeedRange = [];
    let min;
    let max;
    if(level <= 2) {
      min = 30;
      max = 100;
    }else if(level <= 4 ){
      min = 40;
      max = 140;
    } else if (level <= 6) {
      min = 50;
      max = 180;
    } else if (level <= 8) {
      min = 60;
      max = 220;
    } else if (level <= 10) {
      min = 70;
      max = 260;
    } else {
      min = 80;
      max = 300;
    }
    enemiesSpeedRange.push(min, max);
    return enemiesSpeedRange;
  }
  createEnemies(level){
    const createdEnemies = [];
    const enemiesNumberRange = this.calculateEnemiesNumber(level);
    const enemiesSpeedRange = this.calculateEnemiesSpeed(level);
    const enemiesNum = this.getRandomInt(enemiesNumberRange[0], enemiesNumberRange[1]);
    const newEnemiesNum = enemiesNum - this.enemies.length;
    let isOppositeEnemy = 0;
    let enemyTrack;
    let enemySpeed;
    for(let i=1; i<=newEnemiesNum; i++) {
      if (this.enemies.length >= 4) {
        isOppositeEnemy = this.getRandomInt(0, 1);
      }
      enemySpeed = this.getRandomInt(enemiesSpeedRange[0], enemiesSpeedRange[1]);

      if(this.enemies.length === 0 && i <= 3){
        enemyTrack = i;
      } else {
        enemyTrack = this.getRandomInt(1, 3);
      }

      const startEdge = isOppositeEnemy ? 'right' : 'left';
      createdEnemies.push(new Enemy(enemyTrack, enemySpeed, startEdge));
    }
    this.enemies.push(...createdEnemies);

  }
  render() {
    this.renderEntities();
  }
  renderEntities() {
    this.enemies.forEach(function (enemy) {
      enemy.render();
    });
    player.render();
  }
  checkIsDaed(){
    this.lock = true;
    player.die();
    player.decreaseLives();
    return (player.getLives()===0) ? true : false;
  }

  update(dt) {
    this.updateEntities(dt);
    if(!this.lock) {
      if (this.checkCollision()) {
        if(this.checkIsDaed()) {
          this.loseGame();
        }else{
          this.resetRound();
        }
      } else if (this.checkGoal()) {
        if(level.getLevel() === this.maxLevel) {
          this.winGame();
        } else {
          this.increaseLevel();
        }
      }
    }
  }
  updateEntities(dt) {
    this.enemies.forEach(function (enemy) {
      enemy.update(dt);
    });
    player.update();
  }
  increaseLevel(){
    //this.enemies.forEach((enemy) => { enemy.stop(); });
    this.lock = true;
    level.update();
    this.enemies.forEach((enemy) => {
      const speedRange = this.calculateEnemiesSpeed(level.getLevel());
      enemy.increaseSpeed(this.getRandomInt(speedRange[0], speedRange[1]));
    });
    this.resetRound();
  }
  loseGame(){
    this.enemies.forEach((enemy) => { enemy.stop(); });
    gamePanel.displayModal('lose');
  }
  startGame(){}
  winGame(){
    this.enemies.forEach((enemy) => { enemy.stop(); });
    gamePanel.displayModal('win');
  }


  checkCollision() {
    for(const enemy of this.enemies){
      if (player.getEdge('left') <= enemy.getEdge('right')
        && player.getEdge('right') >= enemy.getEdge('left')
        && player.getEdge('top') <= enemy.getEdge('bottom')
        && player.getEdge('bottom') >= enemy.getEdge('top')) {
        return true;
      }
    }
    return false;
  }

  checkGoal() {
    if (player.y == player.minY) {
      return true;
    }
  }
  resetRound() {
    setTimeout(() => {
      game.createEnemies(level.getLevel());
      player.reset();
      this.lock = false;
    }, 500);
  }
}

class Level {
  constructor() {
    let level = 1;
    this.getLevel = function() {
      return level;
    };
    this.setLevel = function() {
      level = (level < 12) ? level+1 : 12;
    };
  }
  update() {
    this.setLevel();
  }
}

class GamePanel {
  constructor(){
    this.winModal = document.querySelector('.win-backdrop');
    this.loseModal =  document.querySelector('.lose-backdrop')
    const startModal = document.querySelector('.start-backdrop');
    const levelUI = document.querySelector('.level');
    const timeUI = document.querySelector('.time');
    const pointsUI = document.querySelector('.points');
  }
  render(){
    ctx.font = "20px Ubuntu";
    ctx.fillStyle = "white";
    ctx.fillText(`Level ${level.getLevel()}/12`,10,30);
    ctx.fillText(`Lives ${player.getLives()}`,200,30);
  }
  displayModal(modal){
    const modalName = modal + 'Modal';
    this[modalName].classList.add('show-modal');
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called this.enemies
// Place the player object in a variable called player
const level = new Level();
const game = new Game();
//let this.enemies = game.createEnemies(level.getLevel());
const player = new Player('img/char-boy.png');
const gamePanel = new GamePanel();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(event) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[event.keyCode]);
});
