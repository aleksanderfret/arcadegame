class GameEntity {
  constructor() {
    this.x;
    this.y;
    this.innerLeft;
    this.innerRight;
    this.innerTop;
    this.innerBottom;
    this.verticalStep = 83;
    this.horizontalStep = 101;
  }

  getEdge(edge){
    let edgeValue;
    switch(edge) {
      case 'left':
        edgeValue = this.x + this.innerLeft;
        break;
      case 'right':
        edgeValue = this.x + this.innerRight;
        break;
      case 'top':
        edgeValue = this.y + this.innerTop;
        break;
      case 'bottom':
        edgeValue = this.y + this.innerBottom;
        break;
      default:
        null;
    }
    return edgeValue;
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
    this.innerLeft = 0;
    this.innerRight = 101;
    this.innerTop = 74;
    this.innerBottom = 146;
    this.startEdge = startEdge;;
    this.speed = speed;
    this.setStartPosition(startEdge, track);
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
        this.y = initialPosition + this.verticalStep;
        break;
      case 3:
        this.y = initialPosition + this.verticalStep*2;
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
    this.stepY = 83;
    this.stepX = 101;
    this.innerLeft = 20;
    this.innerRight = 81;
    this.innerTop = 60;
    this.innerBottom = 143;
    this.sprite = sprite;
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
    this.lock = false;
    this.winModal = document.querySelector('.win-backdrop');
    this.loseModal =  document.querySelector('.lose-backdrop')
    this.startModal = document.querySelector('.start-backdrop');
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  calculateEnemiesNumber(level) {
    const enemiesNumberInterval = [];
    let min;
    let max;
    if (level <= 2) {
      min = 3;
      max = 3;
    } else if (level <=4) {
      min = 4;
      max = (level < 4 ) ? 4 : 5;
    } else if (level <=6) {
      min = 5;
      max = this.getRandomInt(min, level+1);
    } else if (level <=8) {
      min = 6;
      max = this.getRandomInt(min, level+1);
    } else {
      min = 7;
      max = this.getRandomInt(min, level);
    }
    enemiesNumberInterval.push(min, max);
    return enemiesNumberInterval;
  }
  //this.speed = (Math.floor(Math.random() * 71))+30;

  calculateEnemiesSpeed(level){
    const enemiesSpeedInterval = [];
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
    enemiesSpeedInterval.push(min, max);
    return enemiesSpeedInterval;

  }
  createEnemies(level){
    const enemies = [];
    let oppositeBugs;
    let enemyTrack;
    const enemiesNumberInterval = this.calculateEnemiesNumber(level);
    const enemiesSpeedInterval = this.calculateEnemiesSpeed(level);
    const enemiesNum = this.getRandomInt(enemiesNumberInterval[0], enemiesNumberInterval[1]);
    let enemySpeed;
    if (enemiesNum >= 5) {
      oppositeBugs = this.getRandomInt(2, Math.floor(enemiesNum/2));
    }
    for(let i=1; i<=enemiesNum; i++) {
      enemySpeed = this.getRandomInt(enemiesSpeedInterval[0], enemiesSpeedInterval[1]);
      if(i<=3){
        enemyTrack = i;
      } else {
        enemyTrack = this.getRandomInt(1, 3);
      }
      if(oppositeBugs && i<=oppositeBugs) {
        enemies.push(new Enemy(enemyTrack, enemySpeed,'right'));
      } else {
        enemies.push(new Enemy(enemyTrack, enemySpeed));
      }
    }
    return enemies;
  }
  winGame(){
    allEnemies.forEach((enemy) => { enemy.stop(); });
    this.lock = true;
    level.update();
    //this.winModal.classList.add('show-modal');
    this.resetRound();
  }
  loseGame(){
    player.die();
    allEnemies.forEach((enemy) => { enemy.stop(); });
    this.lock = true;
    //this.loseModal.classList.add('show-modal');
    this.resetRound();
  }
  startGame(){

  }
  checkCollision(){

  }
  resetRound() {
    setTimeout(() => {
      allEnemies = game.createEnemies(level.getLevel());
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const game = new Game();
const level = new Level();
let allEnemies = game.createEnemies(level.getLevel());
const player = new Player('img/char-boy.png');


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