const gameEnemy = ((track, speed, startEdge) => {
  "Use strict";
  const priv = new WeakMap();
  const _= (instance) => priv.get(instance);
  const setX = (instance, x) => {
    _(instance).x = x;
  };
  const setY = (instance, y) => {
    _(instance).y = y;
  };
  const setSpeed = (instance, speed) => {
    _(instance).speed = speed;
  };
  const setStartPosition = (instance, startEdge, track) => {
    const initialPosition = 63;
    const positionShift = 83;
    const rightPosition = 707;
    if (startEdge === 'right') {
      setX(instance, rightPosition);
      _(instance).sprite = 'img/enemy-bug2.png';
    }
    switch (track) {
      case 1:
        setY(instance, initialPosition);
        break;
      case 2:
        setY(instance, initialPosition + positionShift);
        break;
      case 3:
        setY(instance, initialPosition + positionShift*2);
        break;
      default:
        null;
    }
  };
  class Enemy {
    constructor(track, speed, startEdge = 'left') {
      const privateProps = {
        edges: {
          left: 0,
          right: 101,
          top: 74,
          bottom: 146,
        },
        x: -101,
        y: 63,
        speed: speed,
        startEdge: startEdge,
        sprite: 'img/enemy-bug.png',
      };
      priv.set(this, privateProps);
      setStartPosition(this, startEdge, track);
    }
    get startEdge() {
      return _(this).startEdge;
    }
    get x() {
      return _(this).x;
    }
    get y() {
      return _(this).y;
    }
    get speed() {
      return _(this).speed;
    }
    get sprite() {
      return _(this).sprite;
    }
    get edges() {
      return _(this).edges;
    }
    update(dt) {
      let x = this.x;
      const speed = this.speed;
      const start = this.startEdge;
      if (start === 'left') {
        if (x < 606) {
          x += speed * dt;
        } else {
          x = -101;
        }
      } else {
        if (x > -101) {
          x -= speed * dt;
        } else {
          x = 707;
        }
      }
      setX(this, x);
    }
    increaseSpeed(speed) {
      const newSpeed = (this.speed >= speed) ? this.speed + 10 : speed;
      setSpeed(this, newSpeed);
    }
    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    stop() {
      setSpeed(this, 0);
    }
    getEdge(edge) {
      const coord = (['left', 'right'].includes(edge)) ? 'x' : 'y';
      return this[coord] + this.edges[edge];
    }
  }
  return Enemy;
})();

const gamePlayer = ((sprite) => {
  "Use strict";
  const priv = new WeakMap();
  const _= (instance) => priv.get(instance);
  const setLives = (instance, modLives) => {
    const lives = _(instance).lives;
    const maxLives = _(instance).maxLives;
    _(instance).lives = (modLives < 0 && lives > 0 || modLives > 0 && lives < maxLives) ? lives+modLives : lives;
  };
  const setIsDead = (instance, isDead) => {
    _(instance).isDead = isDead;
  };
  const setCoords = (instance, x, y) => {
    _(instance).coords.x = x;
    _(instance).coords.y = y;
  };
  const setSpriteNormal = (instance, sprite) => {
    _(instance).sprite.normal = sprite;
  };
  const movementHandlerInput = (instance, direction) => {
    const steps = _(instance).steps;
    const maxCoords = _(instance).maxCoords;
    const coords = _(instance).coords;
    if (instance.isDead || game.isLocked) {
      return;
    }
    switch (direction) {
      case 'left':
        _(instance).coords.x = Math.max((coords.x - steps.x), maxCoords.minX);
        break;
      case 'right':
        _(instance).coords.x = Math.min((coords.x + steps.x), maxCoords.maxX);
        break;
      case 'up':
        _(instance).coords.y = Math.max((coords.y - steps.y), maxCoords.minY);
        break;
      case 'down':
        _(instance).coords.y = Math.min((coords.y + steps.y), maxCoords.maxY);
        break;
      default:
        null;
    }
  };
  class Player {
    constructor(sprite) {
      const privateProps = {
        maxLives: 3,
        lives: 3,
        isDead: false,
        maxCoords: {
          minX: 0,
          minY: -10,
          maxX: 404,
          maxY: 405,
        },
        edges: {
          left: 20,
          right: 81,
          top: 60,
          bottom: 143
        },
        steps: {
          x: 101,
          y: 83,
        },
        coords: {
          x: 202,
          y: 405,
        },
        sprite: sprite,
      }
      priv.set(this, privateProps);
      this.reset();
      document.addEventListener('keyup', (event) => {
        const allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
        };
        movementHandlerInput(this, allowedKeys[event.keyCode]);
      });

    }

    get lives() {
      return _(this).lives;
    }
    get isDead() {
      return _(this).isDead;
    }
    get maxCoords() {
      return _(this).maxCoords;
    }
    get edges() {
      return _(this).edges;
    }
    get steps() {
      return _(this).steps;
    }
    get coords() {
      return _(this).coords;
    }
    get sprite() {
      return _(this).sprite;
    }

    reset() {
      setIsDead(this, false);
      setCoords(this, 202, 405);
    }

    die() {
      setIsDead(this, true);
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
        setSpriteNormal(this, spriteNormal);
      }, 750);
    }
    update(){}
    render() {
      ctx.drawImage(Resources.get(this.sprite.normal), this.coords.x, this.coords.y);
    }

    getEdge(edge) {
      const coord = (['left', 'right'].includes(edge)) ? 'x' : 'y';
      return this.coords[coord] + this.edges[edge];
    }

    decreaseLives() {
        setLives(this, -1);
    }
  }
  return Player;
})();

const arcadeGame = (()=>{
  "Use strict";
  const priv = new WeakMap();
  const _= (instance) => priv.get(instance);
  const setIsLocked = (instance, locked) => {
    _(instance).isLocked = locked;
  };
  const setParam = (instance, property, value) => {
    _(instance)[property] = value;
  };
  const setIsStarted = (instance, started) => {
    _(instance).isStarted = started;
  };
  const setPlayer = (instance, player) => {
    _(instance).player = player;
  };
  const setLevel = (instance, level) => {
    _(instance).level = level;
  };
  const setEnemies = (instance, enemies) => {
    _(instance).enemies = enemies;
  };
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const renderEntities = (instance) => {
    _(instance).enemies.forEach(function (enemy) {
      enemy.render();
    });
    _(instance).player.render();
  };
  const updateEntities = (instance, dt) => {
    _(instance).enemies.forEach((enemy) => {
      enemy.update(dt);
    });
    _(instance).player.update();
  };
  const createEnemies = (instance) => {
    const enemies = _(instance).enemies;
    const level = _(instance).level;
    const createdEnemies = [];
    const enemiesNumberRange = level.enemiesNumberRange;
    const enemiesSpeedRange = level.enemiesSpeedRange;
    const enemiesNum = getRandomInt(enemiesNumberRange[0], enemiesNumberRange[1]);
    const newEnemiesNum = enemiesNum - enemies.length;
    let isOppositeEnemy = 0;
    let enemyTrack;
    let enemySpeed;
    for (let i = 1; i <= newEnemiesNum; i++) {
      if (enemies.length >= 4) {
        isOppositeEnemy = getRandomInt(0, 1);
      }
      enemySpeed = getRandomInt(enemiesSpeedRange[0], enemiesSpeedRange[1]);

      if (enemies.length === 0 && i <= 3) {
        enemyTrack = i;
      } else {
        enemyTrack = getRandomInt(1, 3);
      }

      const startEdge = isOppositeEnemy ? 'right' : 'left';
      createdEnemies.push(new gameEnemy(enemyTrack, enemySpeed, startEdge));
    }
    setEnemies(instance, [...enemies, ...createdEnemies]);
  };
  const checkCollision = (instance) => {
    const player = _(instance).player;
    const enemies = _(instance).enemies;
    for (const enemy of enemies) {
      if (player.getEdge('left') <= enemy.getEdge('right') &&
        player.getEdge('right') >= enemy.getEdge('left') &&
        player.getEdge('top') <= enemy.getEdge('bottom') &&
        player.getEdge('bottom') >= enemy.getEdge('top')) {
        return true;
      }
    }
    return false;
  };
  const checkIsDaed = (instance) => {
    let isDead = false;
    const player = _(instance).player;
    player.die();
    player.decreaseLives();

    if (player.lives === 0 ) {
      isDead = true;
    } else {
      player.spriteAnimetion('lose');
    }
    return isDead;
  };
  const checkGoal = (instance) => {
    const player = _(instance).player;
    if (player.coords.y === player.maxCoords.minY) {
      return true;
    }
  };
  const increaseLevel = (instance) => {
    const level = _(instance).level;
    const player = _(instance).player;
    const enemies = _(instance).enemies;
    level.update();
    enemies.forEach((enemy) => {
      const speedRange = level.enemiesNumberRange;
      enemy.increaseSpeed(getRandomInt(speedRange[0], speedRange[1]));
    });
    player.spriteAnimetion('win');
    resetRound(instance);
  };
  const resetRound= (instance) => {
    setTimeout(() => {
      createEnemies(instance);
      _(instance).player.reset();
      setIsLocked(instance, false);
    }, 1000);
  };
  const startIntro = (instance) => {
    _(instance).panel.displayIntroModal();
  };
  const stopGame = (instance) => {
    setIsStarted(instance, false);
    setEnemies(instance, []);
    setPlayer(instance, null);
    setLevel(instance, null);
  };
  const endGame = (instance, result) => {
    const enemies = _(instance).enemies;
    const player = _(instance).player;
    const level = _(instance).level;
    const panel = _(instance).panel;
    const success = (result === 'win') ? true : false;
    enemies.forEach((enemy) => {
      enemy.stop();
    });
    player.spriteAnimetion(result);
    setTimeout(()=>{
      panel.displayResultModal(success, level.level, player.lives, 0, 0);
      stopGame(instance);
    }, 1000);
  };

  class Game {
    constructor() {
      const privateProps = {
        panel: new gamePanel(),
        isStarted: false,
        isLocked: false,
        level: null,
        player: null,
        maxLevel: 3,
        enemies: [],
      }
      priv.set(this, privateProps);
      startIntro(this);
    }
    get isStarted(){
      return _(this).isStarted;
    }
    get isLocked(){
      return _(this).isLocked;
    }
    get panel (){
      return _(this).panel;
    }
    get level(){
      return _(this).level;
    }
    get player(){
      return _(this).player;
    }
    get enemies(){
      return [..._(this).enemies];
    }
    get maxLevel(){
      return _(this).maxLevel;
    }
    render() {
      if(this.isStarted){
        renderEntities(this);
        this.panel.render(this.level.level, this.player.lives);
      }
    }
    update(dt) {
      if(!this.isStarted){
        return;
      }
      updateEntities(this, dt);
      if (this.isLocked) {
        return
      }
      if (checkCollision(this)) {
        setIsLocked(this, true);
        if (checkIsDaed(this)) {
          endGame(this, 'lose');
        } else {
          resetRound(this);
        }
      } else if (checkGoal(this)) {
        setIsLocked(this, true);
        if (this.level.level === this.maxLevel) {
          endGame(this, 'win');
        } else {
          increaseLevel(this);
        }
      }
    }
    startGame(sprite) {
      setLevel(this, new gameLevel());
      createEnemies(this);
      setPlayer(this, new gamePlayer(sprite));
      setIsStarted(this, true);
      setIsLocked(this, false)
    }
  }
  return Game;
})();

const gameLevel = (() => {
  "Use strict";
  const priv = new WeakMap();
  const _= (instance) => priv.get(instance);
  const setLevel = (instance) => {
    _(instance).level++;
  };
  const setEnemiesNumberRange = (instance, numberRange) => {
    _(instance).enemiesNumberRange = numberRange;
  };
  const setEnemiesSpeedRange = (instance, speedRange) => {
    _(instance).enemiesSpeedRange = speedRange;
  };
  const calculateEnemiesNumber = (level) => {
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
  };
  const calculateEnemiesSpeed = (level) => {
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
  };

  class Level {
    constructor() {
      const initLevel = 1;
      const privateProps = {
        level: initLevel,
        enemiesNumberRange: calculateEnemiesNumber(initLevel),
        enemiesSpeedRange: calculateEnemiesSpeed(initLevel),
      }
      priv.set(this, privateProps);
    }

    get level(){
      return _(this).level;
    }
    get enemiesNumberRange(){
      return _(this).enemiesNumberRange;
    }
    get enemiesSpeedRange(){
      return _(this).enemiesSpeedRange;
    }

    update() {
      setLevel(this);
      setEnemiesNumberRange(this, calculateEnemiesNumber(this.level));
      setEnemiesSpeedRange(this, calculateEnemiesSpeed(this.level));
    }
  }
  return Level;
})();

const gamePanel= (() => {
  const priv = new WeakMap();
  const _= (instance) => priv.get(instance);
  const setSpriteSrc = (instance, url) => {
    _(instance).spriteImages.forEach((spriteImage)=>{
      spriteImage.setAttribute('src', url);
    });
  };
  const setSpriteIndex = (instance, index) => {
    _(instance).spriteIndex = index;
  };
  const closeModal = (instance) => {
    _(instance).introModal.classList.remove('show-modal');
    _(instance).resultModal.classList.remove('show-modal');
    document.removeEventListener('keyup', _(instance).modalKeyHandler);
  };

  const startOptionsHandler = (instance, key) => {
    const sprites = _(instance).sprites;
    const spriteIndex = _(instance).spriteIndex;
    if(key === 'enter') {
      closeModal(instance);
      game.startGame(sprites[spriteIndex]);
    } else if (key === 'space') {
      const index = (spriteIndex === sprites.length-1) ? 0 : spriteIndex+1;
      setSpriteSrc(instance, sprites[index].normal);
      setSpriteIndex(instance, index);
    }
  };

  class Panel {
    constructor() {
      const privateProps = {
        resultModal: document.querySelector('#result-modal'),
        introModal: document.querySelector('#intro-modal'),
        title: document.querySelector('.title'),
        levelResult: document.querySelector('.level-result'),
        livesResult: document.querySelector('.lives-result'),
        spriteImages: document.querySelectorAll('.sprite img'),
        spriteIndex: 0,
        sprites: [
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
          }],
      };
      priv.set(this, privateProps);
      this.modalKeyHandler = (event) => {
        const allowedKeys = {
          32: 'space',
          13: 'enter'
        };
        startOptionsHandler(this, allowedKeys[event.keyCode]);
      };
    }
    get sprites() {
      return _(this).sprites;
    }
    get spriteIndex() {
      return _(this).spriteIndex;
    }
    get spriteImages() {
      return _(this).spriteImages;
    }
    get resultModal() {
      return _(this).resultModal;
    }
    get introModal() {
      return _(this).introModal;
    }
    get title() {
      return _(this).title;
    }
    get levelResult() {
      return _(this).levelResult;
    }
    get livesResult() {
      return _(this).livesResult;
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
      document.addEventListener('keyup', this.modalKeyHandler);
      const title = (success) ? 'Congratulations, you won!' : 'Unfortunately, you lost!';
      this.title.textContent = title;
      this.levelResult.textContent = level;
      this.livesResult.textContent = lives;
      this.resultModal.classList.add('show-modal');
    }
    displayIntroModal(){
      document.addEventListener('keyup', this.modalKeyHandler);
      this.introModal.classList.add('show-modal');
    }
  }
  return Panel;
})();

const game = new arcadeGame();