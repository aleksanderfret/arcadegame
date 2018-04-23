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

  addExtension(string){
    const exetension = '.png'
    return string+extension;
  }

  getEdge(edge) {
    const coord = (['left', 'right'].includes(edge)) ? 'x' : 'y';
    return this[coord] + this.edges[edge];
  }
}


class Enemy extends GameEntity {
  constructor(track, speed, startEdge = 'left') {
    super();

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

  update(dt) {
    if (this.startEdge === 'left') {
      if (this.x < 606) {
        this.x += this.speed * dt;
      } else {
        this.x = -101;
      }
    } else {
      if (this.x > -101) {
        this.x -= this.speed * dt;
      } else {
        this.x = 707;
      }
    }
  }

  increaseSpeed(speed) {
    this.speed = (this.speed >= speed) ? this.speed + 10 : speed;
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  stop() {
    this.speed = 0;
  }

  setStartPosition(startEdge, track) {
    const initialPosition = 63;
    if (this.startEdge === 'left') {
      this.sprite = 'img/enemy-bug.png';
      this.x = -101;
    } else {
      this.sprite = 'img/enemy-bug2.png';
      this.x = 707;
    }
    switch (track) {
      case 1:
        this.y = initialPosition;
        break;
      case 2:
        this.y = initialPosition + this.stepY;
        break;
      case 3:
        this.y = initialPosition + this.stepY * 2;
        break;
      default:
        null;
    }
  }
}


// This class requires an update()
class Player extends GameEntity {
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
      lives = (lives > 0) ? lives - 1 : lives;
    }
    document.addEventListener('keyup', (event) => {
      const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      };
      this.movementHandlerInput(allowedKeys[event.keyCode]);
    });

  }

  reset() {
    this.isDead = false;
    this.x = 202;
    this.y = 405;
  }

  update() {}

  die() {
    this.isDead = true;
  }

  spriteAnimetion(result) {
    let interval;
    const spriteNormal = this.sprite.normal;
    const spriteAnimated = (result === 'win') ? this.sprite.win : this.sprite.lose;
    interval = setInterval(() => {
      this.sprite.normal = (this.sprite.normal === spriteAnimated) ? spriteNormal : spriteAnimated;
    }, 100);
    setTimeout(()=> {
      clearInterval(interval);
      this.sprite.normal = spriteNormal;
    }, 750);
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite.normal), this.x, this.y);
  }

  movementHandlerInput(direction) {
    if (this.isDead) {
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
    this.gamePanel = new GamePanel();
    this.startIntro();
    this.enemies = [];
    this.maxLevel = 3;
    this.isLock = false;
    this.isStarted = false;
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createEnemies() {
    const createdEnemies = [];
    const enemiesNumberRange = this.level.getEnemiesNumberRange();
    const enemiesSpeedRange = this.level.getEnemiesSpeedRange();
    const enemiesNum = this.getRandomInt(enemiesNumberRange[0], enemiesNumberRange[1]);
    const newEnemiesNum = enemiesNum - this.enemies.length;
    let isOppositeEnemy = 0;
    let enemyTrack;
    let enemySpeed;
    for (let i = 1; i <= newEnemiesNum; i++) {
      if (this.enemies.length >= 4) {
        isOppositeEnemy = this.getRandomInt(0, 1);
      }
      enemySpeed = this.getRandomInt(enemiesSpeedRange[0], enemiesSpeedRange[1]);

      if (this.enemies.length === 0 && i <= 3) {
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
    if(this.isStarted){
      this.renderEntities();
      this.gamePanel.render(this.level.getLevel(), this.player.getLives());
    }
  }
  renderEntities() {
    this.enemies.forEach(function (enemy) {
      enemy.render();
    });
    this.player.render();
  }
  checkIsDaed() {
    let isDead = false;
    this.player.die();
    this.player.decreaseLives();

    if (this.player.getLives() === 0 ) {
      isDead = true;
    } else {
      this.player.spriteAnimetion('lose');
    }
    return isDead;
  }

  update(dt) {
    if(!this.isStarted){
      return;
    }
    this.updateEntities(dt);
    if (this.isLock) {
      return
    }
    if (this.checkCollision()) {
      this.isLock = true;
      if (this.checkIsDaed()) {
        this.loseGame();
      } else {
        this.resetRound();
      }
    } else if (this.checkGoal()) {
      this.isLock = true;
      if (this.level.getLevel() === this.maxLevel) {
        this.winGame();
      } else {
        this.increaseLevel();
      }
    }
  }
  updateEntities(dt) {
    this.enemies.forEach((enemy) => {
      enemy.update(dt);
    });
    this.player.update();
  }
  increaseLevel() {
    this.level.update();
    this.enemies.forEach((enemy) => {
      const speedRange = this.level.getEnemiesNumberRange();
      enemy.increaseSpeed(this.getRandomInt(speedRange[0], speedRange[1]));
    });
    this.player.spriteAnimetion('win');
    this.resetRound();
  }
  loseGame() {
    this.enemies.forEach((enemy) => {
      enemy.stop();
    });
    this.player.spriteAnimetion('lose');
    setTimeout(()=>{
      this.gamePanel.displayResultModal(false, this.level.getLevel(), this.player.getLives(), 0, 0);
      this.stop();
    }, 1000);

  }
  winGame() {
    this.enemies.forEach((enemy) => {
      enemy.stop();
    });
    this.player.spriteAnimetion('win');
    setTimeout(()=>{
      this.gamePanel.displayResultModal(true, this.level.getLevel(), this.player.getLives(), 0, 0);
      this.stop();
    }, 1000);
  }
  start(sprite) {
    this.level = new Level();
    this.createEnemies();
    this.player = new Player(sprite);
    this.isStarted = true;
    this.isLock = false;
  }
  stop() {
    this.isStarted = false;
    this.enemies = [];
    this.player = null;
    this.level = null;
  }
  startIntro(){
    this.gamePanel.displayIntro();
  }

  checkCollision() {
    for (const enemy of this.enemies) {
      if (this.player.getEdge('left') <= enemy.getEdge('right') &&
        this.player.getEdge('right') >= enemy.getEdge('left') &&
        this.player.getEdge('top') <= enemy.getEdge('bottom') &&
        this.player.getEdge('bottom') >= enemy.getEdge('top')) {
        return true;
      }
    }
    return false;
  }

  checkGoal() {
    if (this.player.y == this.player.minY) {
      return true;
    }
  }
  resetRound() {
    setTimeout(() => {
      this.createEnemies();
      this.player.reset();
      this.isLock = false;
    }, 1000);
  }
}

class Level {
  constructor() {
    let level = 1;
    let enemiesNumberRange = this.calculateEnemiesNumber(level);
    let enemiesSpeedRange = this.calculateEnemiesSpeed(level);
    this.getLevel = () => level;
    this.setLevel = () => {
      level++;
      enemiesNumberRange = this.calculateEnemiesNumber(level);
      enemiesSpeedRange = this.calculateEnemiesSpeed(level);
    };
    this.getEnemiesNumberRange = () => enemiesNumberRange;
    this.getEnemiesSpeedRange = () => enemiesSpeedRange;
  }
  update() {
    this.setLevel();
  }
  calculateEnemiesNumber(level) {
    const enemiesNumberRange = [];
    let min;
    let max;
    if (level <= 2) {
      min = 3;
      max = 3;
    } else if (level <= 4) {
      min = 4;
      max = 5;
    } else if (level <= 6) {
      min = 5;
      max = 7;
    } else if (level <= 8) {
      min = 6;
      max = 8;
    } else if (level <= 10) {
      min = 7;
      max = 10;
    } else {
      min = 8;
      max = 12;
    }
    enemiesNumberRange.push(min, max);
    return enemiesNumberRange;
  }
  calculateEnemiesSpeed(level) {
    const enemiesSpeedRange = [];
    let min;
    let max;
    if (level <= 2) {
      min = 30;
      max = 100;
    } else if (level <= 4) {
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
}

class GamePanel {
  constructor() {
    this.resultModal = document.querySelector('#result-modal');
    this.introModal = document.querySelector('#intro-modal');
    this.title = document.querySelector('.title');
    this.levelResult = document.querySelector('.level-result');
    this.livesResult = document.querySelector('.lives-result');
    this.spriteImages = document.querySelectorAll('.sprite img');
    this.spriteIndex = 0;
    this.sprites = [
      {
        normal: 'img/char-boy.png',
        lose: 'img/char-boy-lose.png',
        win: 'img/char-boy-win.png',
      },
      {
        normal: 'img/char-cat-girl.png',
        lose: 'img/char-cat-girl-lose.png',
        win: 'img/char-cat-girl-win.png',
      },
      {
        normal: 'img/char-horn-girl.png',
        lose: 'img/char-horn-girl-lose.png',
        win: 'img/char-horn-girl-win.png',
      },
      {
        normal: 'img/char-pink-girl.png',
        lose: 'img/char-pink-girl-lose.png',
        win: 'img/char-pink-girl-win.png',
      },
      {
        normal: 'img/char-princess-girl.png',
        lose: 'img/char-princess-girl-lose.png',
        win: 'img/char-princess-girl-win.png',
      }];
    this.setSpriteSrc(this.sprites[this.spriteIndex].normal);

    document.addEventListener('keyup', (event) => {
      const allowedKeys = {
        32: 'space',
        13: 'enter'
      };
      this.startOptionsHandler(allowedKeys[event.keyCode]);
    });
  }
  setSpriteSrc(url){
    this.spriteImages.forEach((spriteImage)=>{
      spriteImage.setAttribute('src', url);
    });
  }
  startOptionsHandler(key) {
    if(key === 'enter') {
      this.introModal.classList.remove('show-modal');
      this.resultModal.classList.remove('show-modal');
      game.start(this.sprites[this.spriteIndex]);
    } else if (key === 'space') {
      const index = (this.spriteIndex === this.sprites.length-1) ? 0 : this.spriteIndex+1;
      this.setSpriteSrc(this.sprites[index].normal);
      this.spriteIndex = index;
    }
  }

  render(level, lives) {
    ctx.font = "20px Ubuntu";
    ctx.fillStyle = "white";
    ctx.fillText(`Level: ${level}/12`, 10, 33);
    ctx.fillText(`Lives:`, 150, 33);
    const step = 35;
    for(let i=0; i<lives; i++) {
      ctx.drawImage(Resources.get('img/Heart.png'), 205+step*i, 0, 30,50);
    }
  }
  displayResultModal(success, level, lives, gems, points) {
    const title = (success) ? 'Congratulations, you won!' : 'Unfortunately, you lost!';
    this.title.textContent = title;
    this.levelResult.textContent = level;
    this.livesResult.textContent = lives;
    this.resultModal.classList.add('show-modal');
  }
  displayIntro(){
    this.introModal.classList.add('show-modal');
  }
}

const game = new Game();