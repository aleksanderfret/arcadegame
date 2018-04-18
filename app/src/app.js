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
  constructor() {
    super();
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = -101;
    this.y = 63 + (Math.floor(Math.random() * 3))*83;
    this.innerLeft = 0;
    this.innerRight = 101;
    this.innerTop = 74;
    this.innerBottom = 146;
    this.speed = (Math.floor(Math.random() * 71))+30;
    this.sprite = 'img/enemy-bug.png';
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < 606) {
      this.x += this.speed*dt;
    } else {
      this.x = -101;
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
  constructor() {
    super();
    this.reset();
    this.minX = 0;
    this.minY = -10;
    this.maxX = 404;
    this.maxY = 405;
    this.stepY = 83;
    this.stepX = 101;
    this.sprite = 'img/char-boy.png';
    this.innerLeft = 10;
    this.innerRight = 91;
    this.innerTop = 60;
    this.innerBottom = 143;
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
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy(),new Enemy(),new Enemy(),];
const player = new Player();


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
