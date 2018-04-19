class GameEntity {
  constructor() {
    this.x;
    this.y;
    this.innerLeft;
    this.innerRight;
    this.innerTop;
    this.innerBottom;
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
  constructor(startEdge = 'left') {
    super();
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.y = 63 + (Math.floor(Math.random() * 3))*83;
    this.innerLeft = 0;
    this.innerRight = 101;
    this.innerTop = 74;
    this.innerBottom = 146;
    this.startEdge = startEdge;
    this.speed = (Math.floor(Math.random() * 71))+30;
    if(this.startEdge === 'left') {
      this.sprite = 'img/enemy-bug.png';
      this.x = -101;
    } else {
      this.sprite = 'img/enemy-bug2.png';
      this.x = 707;
    }
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
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  calculateEnemiesNumber(level) {
    const enemiesInterval = [];
    let min = 3;
    let max;
    if (level === 1) {
      max = 3;
    } else if (level <=4) {
      max = (level<4) ? 3 : 4;
    } else if (level <=8) {
      min = 4;
      max = this.getRandomInt(min, level);
    } else if (level <=12) {
      min = 6;
      max = this.getRandomInt(min, level-2);
    }
    enemiesInterval.push(min, max);
    return enemiesInterval;
  }

  createEnemies(level){
    const enemies = [];
    let oppositeBugs;
    const enemiesInterval = this.calculateEnemiesNumber(level);
    const enemiesNum = this.getRandomInt(enemiesInterval[0], enemiesInterval[1]);
    if (enemiesNum >= 5) {
      oppositeBugs = this.getRandomInt(2, Math.floor(enemiesNum/2));
    }
    for(let i=1; i<=enemiesNum; i++) {
      if(oppositeBugs && i<=oppositeBugs) {
        enemies.push(new Enemy('right'));
      } else {
        enemies.push(new Enemy());
      }
    }
    return enemies;
  }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const game = new Game();
let allEnemies = game.createEnemies(7);
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
