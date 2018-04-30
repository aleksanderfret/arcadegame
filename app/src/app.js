/**
 * @description GameEntity holds Entity class returned by IIFE (for encapsulation)
 * @return {function}
 */
const GameEntity = (() => {
  let protectedMembers; // for sharing protected props with subclasses
  const priv = new WeakMap(); // holds private props of instances of Entity class

  // private "methods" for Entity class
  /**
   * @description returns private properties of the instance
   * @param {object} instance
   * @return {object}
   */
  const _ = instance => priv.get(instance);

  /**
   * @description sets x property
   * @param {object} instance
   * @param {number} x
   */
  const setX = (instance, x) => {
    _(instance).x = x;
  };

  /**
   * @description sets y property
   * @param {object} instance
   * @param {number} y
   */
  const setY = (instance, y) => {
    _(instance).y = y;
  };

  /**
   * @description sets edges property
   * @param {object} instance
   * @param {number} left
   * @param {number} right
   * @param {number} top
   * @param {number} bottom
   */
  const setEdges = (instance, left, right, top, bottom) => {
    _(instance).edges.left = left;
    _(instance).edges.right = right;
    _(instance).edges.top = top;
    _(instance).edges.bottom = bottom;
  };

  /**
   * @description sets sprite property
   * @param {object} instance
   * @param {string} sprite
   */
  const setSprite = (instance, sprite) => {
    _(instance).sprite = sprite;
  };

  class Entity {
    /**
     * @param {object} startEdge
     */
    constructor(protect) {
      const privateProps = { // private properties for Entity class
        x: 0,
        y: 0,
        edges: { // to detect collision
          left: 0,
          right: 101,
          top: 0,
          bottom: 171,
        },
        sprite: '',
      };
      priv.set(this, privateProps); // stores private properties for class instance

      // sets the props/methods available in child classes
      protectedMembers = protect || {};
      protectedMembers.setX = setX;
      protectedMembers.setY = setY;
      protectedMembers.setSprite = setSprite;
      protectedMembers.setEdges = setEdges;
    }

    // getters for private properties
    get x() {
      return _(this).x;
    }
    get y() {
      return _(this).y;
    }
    get sprite() {
      return _(this).sprite;
    }
    get edges() {
      return _(this).edges;
    }

    // public methods
    /**
     * @description gets inner coords of entity edges
     * @param {string} edge
     * @return {number}
     */
    getEdge(edge) {
      const coord = (['left', 'right'].includes(edge)) ? 'x' : 'y';
      return this[coord] + this.edges[edge];
    }

    /**
     * @description rednders entity object
     */
    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  }
  return Entity;
})();

/**
 * @description GameEnemy holds Enemy class returned by IIFE (for encapsulation)
 * @param {number} track
 * @param {number} speed
 * @param {string} startEdge
 * @return {function}
 */
const GameEnemy = (() => {
  const priv = new WeakMap(); // holds private props of instances of Enemy class
  const parent = {}; // holds protected parents props/methods

  // private "methods" for Enemy class
  /**
   * @description returns private properties of the instance
   * @param {object} instance
   * @return {object}
   */
  const _ = instance => priv.get(instance);

  /**
   * @description sets speed property
   * @param {object} instance
   * @param {number} speed
   */
  const setSpeed = (instance, speed) => {
    _(instance).speed = speed;
  };

  /**
   * @description sets start position (coords: x & y) and proper image of enemy
   * @param {object} instance
   * @param {object} startEdge
   * @param {number} track
   */
  const setStartPosition = (instance, startEdge, track) => {
    const initialPosition = 63;
    const positionShift = 83;
    const rightPosition = 707;
    const leftPosition = -101;
    if (startEdge === 'right') {
      parent.setX(instance, rightPosition);
      parent.setSprite(instance, 'img/enemy-bug2.png');
    } else {
      parent.setX(instance, leftPosition);
      parent.setSprite(instance, 'img/enemy-bug.png');
    }
    switch (track) {
      case 1:
        parent.setY(instance, initialPosition);
        break;
      case 2:
        parent.setY(instance, initialPosition + positionShift);
        break;
      case 3:
        parent.setY(instance, initialPosition + (positionShift * 2));
        break;
      default:
        break;
    }
  };
  class Enemy extends GameEntity {
    /**
     * @param {number} track
     * @param {number} speed
     * @param {string} startEdge
     */
    constructor(track, speed, startEdge = 'left') {
      super(parent);
      const privateProps = { // private properties for Enemy class
        speed,
        startEdge, // startEdge to set direction of movements
      };

      // stores private properies for class instance
      priv.set(this, privateProps);
      setStartPosition(this, startEdge, track);
      parent.setEdges(this, 0, 101, 74, 146);
    }

    // getters for private properties
    get startEdge() {
      return _(this).startEdge;
    }
    get speed() {
      return _(this).speed;
    }

    // public methods
    /**
     * @description updates enemy object
     * @param {number} dt
     */
    update(dt) {
      let { x } = this;
      const { speed, startEdge } = this;
      if (startEdge === 'left') {
        if (x < 606) {
          x += speed * dt;
        } else {
          x = -101;
        }
      } else {
        if (x > -101) { // eslint-disable-line no-lonely-if
          x -= speed * dt;
        } else {
          x = 707;
        }
      }
      parent.setX(this, x);
    }

    /**
     * @description increases speed of enemy object
     * @param {number} speed
     */
    increaseSpeed(speed) {
      const newSpeed = (this.speed >= speed) ? this.speed + 10 : speed;
      setSpeed(this, newSpeed);
    }

    /**
     * @description stops enemy
     */
    stop() {
      setSpeed(this, 0);
    }
  }
  return Enemy;
})();

/**
 * @description GamePlayer holds Player class returned by IIFE (for encapsulation)
 * @param {object} sprite
 * @return {function}
 */
const GamePlayer = (() => {
  const priv = new WeakMap(); // holds private properties of instances of Player class
  const parent = {}; // holds protected parents props/methods

  // private "methods" for Player class
  /**
   * @description returns private properties of the instance
   * @param {object} instance
   * @return {object}
   */
  const _ = instance => priv.get(instance);

  /**
   * @description sets lives property (add lives for future increase lives)
   * @param {object} instance
   * @param {number} modLives // value to add to lives
   */
  const setLives = (instance, modLives) => {
    const { lives, maxLives } = _(instance);
    _(instance).lives =
      ((modLives < 0 && lives > 0)
      || (modLives > 0 && lives < maxLives))
        ? lives + modLives : lives;
  };

  /**
   * @description sets isDead property
   * @param {object} instance
   * @param {boolean} isDead
   */
  const setIsDead = (instance, isDead) => {
    _(instance).isDead = isDead;
  };

  /**
   * @description sets coords x & y of the player
   * @param {object} instance
   * @param {string} direction
   */
  const movementHandlerInput = (instance, direction) => {
    const { steps, maxCoords, isDead } = _(instance);
    const { x, y } = instance;
    if (isDead || game.isLocked) { // eslint-disable-line no-use-before-define
      return;
    }

    switch (direction) {
      case 'left':
        parent.setX(instance, Math.max((x - steps.x), maxCoords.minX));
        break;
      case 'right':
        parent.setX(instance, Math.min((x + steps.x), maxCoords.maxX));
        break;
      case 'up':
        parent.setY(instance, Math.max((y - steps.y), maxCoords.minY));
        break;
      case 'down':
        parent.setY(instance, Math.min((y + steps.y), maxCoords.maxY));
        break;
      default:
        break;
    }
  };

  class Player extends GameEntity {
    /**
     * @param {object} sprite
     */
    constructor(sprite) {
      super(parent);
      const privateProps = { // private properties for Player class
        maxLives: 3,
        lives: 3,
        isDead: false,
        maxCoords: { // to limit area of player movement
          minX: 0,
          minY: -10,
          maxX: 404,
          maxY: 405,
        },
        steps: { // for player movements
          x: 101,
          y: 83,
        },
        spriteAnimate: { // object with the player images
          win: sprite.win,
          lose: sprite.lose,
        },
      };
      // stores private properties for class instance
      priv.set(this, privateProps);
      parent.setSprite(this, sprite.normal);
      parent.setEdges(this, 20, 81, 60, 143);
      this.reset();

      // adds listener for arrow keyup event to manage movement of the player
      document.addEventListener('keyup', (event) => {
        const allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down',
        };
        movementHandlerInput(this, allowedKeys[event.keyCode]);
      });
    }

    // getters for private properties
    get lives() {
      return _(this).lives;
    }
    get isDead() {
      return _(this).isDead;
    }
    get maxCoords() {
      return _(this).maxCoords;
    }
    get steps() {
      return _(this).steps;
    }
    get spriteAnimate() {
      return _(this).spriteAnimate;
    }

    // public methods
    /**
     * @description resets coords and isDead property for each game round (stage)
     */
    reset() {
      setIsDead(this, false);
      parent.setX(this, 202);
      parent.setY(this, 405);
    }

    /**
     * @description sets property isDead to true
     */
    die() {
      setIsDead(this, true);
    }

    /**
     * @description changes player images to simulate animation
     * @param {string} result
     */
    spriteAnimetion(result) {
      // saves standard player image
      const { sprite } = this;
      // chooses which image will be used in animation
      const spriteAnimated =
        (result === 'win') ? this.spriteAnimate.win : this.spriteAnimate.lose;

      // starts animation
      const interval = setInterval(() => {
        parent.setSprite(
          this,
          (this.sprite === spriteAnimated) ? sprite : spriteAnimated,
        );
      }, 100);

      setTimeout(() => {
        // stops animation
        clearInterval(interval);
        // sets a standard image back
        parent.setSprite(this, sprite);
      }, 750);
    }

    update() {} // eslint-disable-line class-methods-use-this

    /**
     * @description reduces the number of lives
     */
    decreaseLives() {
      setLives(this, -1);
    }
  }
  return Player;
})();

/**
 * @description GameLevel holds Level class returned by IIFE (for encapsulation)
 * @return {function}
 */
const GameLevel = (() => {
  // holds private properties of instances of Level class
  const priv = new WeakMap();

  // private "methods" for Level class
  /**
   * @description returns private properties of the instance
   * @param {object} instance
   * @return {object}
   */
  const _ = instance => priv.get(instance);

  /**
   * @description sets level property
   * @param {object} instance
   */
  const setLevel = (instance) => {
    _(instance).level += 1;
  };

  /**
   * @description sets enemiesNumberRange property
   * @param {object} instance
   * @param {array} numberRange
   */
  const setEnemiesNumberRange = (instance, numberRange) => {
    _(instance).enemiesNumberRange = numberRange;
  };

  /**
   * @description sets enemiesSpeedRange property
   * @param {object} instance
   * @param {array} speedRange
   */
  const setEnemiesSpeedRange = (instance, speedRange) => {
    _(instance).enemiesSpeedRange = speedRange;
  };

  /**
   * @description determines the numerical range of number of enemies
   * @param {object} instance
   * @param {number} level
   */
  const calculateEnemiesNumberRange = (level) => {
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

  /**
   * @description determines the numerical range of enemy speed
   * @param {object} instance
   * @param {number} level
   */
  const calculateEnemiesSpeedRange = (level) => {
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
      // private properties for Level class
      const privateProps = {
        level: initLevel,
        enemiesNumberRange: calculateEnemiesNumberRange(initLevel),
        enemiesSpeedRange: calculateEnemiesSpeedRange(initLevel),
      };

      // stores private properties for class instance
      priv.set(this, privateProps);
    }

    // getters for private properties
    get level() {
      return _(this).level;
    }
    get enemiesNumberRange() {
      return _(this).enemiesNumberRange;
    }
    get enemiesSpeedRange() {
      return _(this).enemiesSpeedRange;
    }

    // public methods
    /**
     * @description updates the level object
     */
    update() {
      setLevel(this);
      setEnemiesNumberRange(this, calculateEnemiesNumberRange(this.level));
      setEnemiesSpeedRange(this, calculateEnemiesSpeedRange(this.level));
    }
  }
  return Level;
})();

/**
 * @description GamePanel holds Panel class returned by IIFE (for encapsulation)
 * @return {function}
 */
const GamePanel = (() => {
  // holds private properties of instances of Panel class
  const priv = new WeakMap();

  // private "methods" for Panel class
  /**
   * @description returns private properties of the instance
   * @param {object} instance
   * @return {object}
   */
  const _ = instance => priv.get(instance);

  /**
   * @description sets url for src attribute of img
   * @param {object} instance
   * @param {string} url
   */
  const setSpriteSrc = (instance, url) => {
    _(instance).spriteImages.forEach((spriteImage) => {
      spriteImage.setAttribute('src', url);
    });
  };

  /**
   * @description sets spriteIndex property - for choosing player avatar from array
   * @param {object} instance
   * @param {number} index
   */
  const setSpriteIndex = (instance, index) => {
    _(instance).spriteIndex = index;
  };

  /**
   * @description closes modal and removes listener for keyup event
   * @param {object} instance
   */
  const closeModal = (instance) => {
    _(instance).introModal.classList.remove('show-modal');
    _(instance).resultModal.classList.remove('show-modal');
    document.removeEventListener('keyup', _(instance).modalKeyHandler);
  };

  /**
   * @description changes player avatar or starts game depends on pressed key
   * @param {object} instance
   * @param {string} key
   */
  const startOptionsHandler = (instance, key) => {
    const { sprites, spriteIndex } = _(instance);
    if (key === 'enter') {
      closeModal(instance);
      game.startGame(sprites[spriteIndex]); // eslint-disable-line no-use-before-define
    } else if (key === 'space') {
      const index = (spriteIndex === sprites.length - 1) ? 0 : spriteIndex + 1;
      setSpriteSrc(instance, sprites[index].normal);
      setSpriteIndex(instance, index);
    }
  };

  class Panel {
    constructor() {
      // private properties for Panel class
      const privateProps = {
        // DOM elements for modals managment
        resultModal: document.querySelector('#result-modal'),
        introModal: document.querySelector('#intro-modal'),
        title: document.querySelector('.title'),
        levelResult: document.querySelector('.level-result'),
        livesResult: document.querySelector('.lives-result'),
        spriteImages: document.querySelectorAll('.sprite img'),

        sprites: [{ // sprites - images urls for the players
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
        },
        ],
        spriteIndex: 0,
      };

      // stores private properties for class instance
      priv.set(this, privateProps);

      // listener for enter/space keyup event
      this.modalKeyHandler = (event) => {
        const allowedKeys = {
          32: 'space',
          13: 'enter',
        };
        startOptionsHandler(this, allowedKeys[event.keyCode]);
      };
    }

    // getters for private properties
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

    // public methods
    /**
     * @description render current level and number of players lives on game canvas
     * @param {number} level
     * @param {number} lives
     */
    render(level, lives) { // eslint-disable-line class-methods-use-this
      ctx.font = '20px Ubuntu';
      ctx.fillStyle = 'white';
      ctx.fillText(`Level: ${level}/12`, 10, 33);
      ctx.fillText('Lives:', 150, 33);
      const step = 35;
      for (let i = 0; i < lives; i++) {
        ctx.drawImage(
          Resources.get('img/Heart.png'),
          205 + (step * i),
          0,
          30,
          50,
        );
      }
    }

    /**
     * @description handles modal for game end (victory or defeat)
     * @param {boolean} success
     * @param {number} level
     * @param {number} lives
     * @param {object} gems // TODO for future use
     * @param {number} points // TODO for future use
     */
    displayResultModal(success, level, lives, gems, points) { // eslint-disable-line no-unused-vars
      document.addEventListener('keyup', this.modalKeyHandler);
      const title = (success)
        ? 'Congratulations, you won!' : 'Unfortunately, you lost!';
      this.title.textContent = title;
      this.levelResult.textContent = level;
      this.livesResult.textContent = lives;
      this.resultModal.classList.add('show-modal');
    }

    /**
     * @description displays intro modal
     */
    displayIntroModal() {
      document.addEventListener('keyup', this.modalKeyHandler);
      this.introModal.classList.add('show-modal');
    }
  }
  return Panel;
})();

/**
 * @description ArcadeGame holds Game class returned by IIFE (for encapsulation)
 * @return {function}
 */
const ArcadeGame = (() => {
  // holds private properties of instances of Game class
  const priv = new WeakMap();

  // private "methods" for Game class
  /**
   * @description returns private properties of the instance
   * @param {object} instance
   * @return {object}
   */
  const _ = instance => priv.get(instance);

  // TODO consider to use it instead of multiple private setters
  // const setPrivProp = (instance, propertyName, value) => {
  //   _(instance)[propertyName] = value;
  // };

  /**
   * @description sets isLocked property
   * @param {object} instance
   * @param {boolean} locked
   */
  const setIsLocked = (instance, locked) => {
    _(instance).isLocked = locked;
  };

  /**
   * @description sets isStarted property
   * @param {object} instance
   * @param {boolean} started
   */
  const setIsStarted = (instance, started) => {
    _(instance).isStarted = started;
  };

  /**
   * @description sets player property
   * @param {object} instance
   * @param {object} player
   */
  const setPlayer = (instance, player) => {
    _(instance).player = player;
  };

  /**
   * @description sets level property
   * @param {object} instance
   * @param {object} level
   */
  const setLevel = (instance, level) => {
    _(instance).level = level;
  };

  /**
   * @description sets enemies property
   * @param {object} instance
   * @param {array} enemies
   */
  const setEnemies = (instance, enemies) => {
    _(instance).enemies = enemies;
  };

  /**
   * @description gets random integer
   * @param {number} min
   * @param {number} max
   */
  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;


  /**
   * @description renders game entities (player and enemies)
   * @param {object} instance
   */
  const renderEntities = (instance) => {
    _(instance).enemies.forEach((enemy) => {
      enemy.render();
    });
    _(instance).player.render();
  };

  /**
   * @description updates game entities
   * @param {object} instance
   */
  const updateEntities = (instance, dt) => {
    _(instance).enemies.forEach((enemy) => {
      enemy.update(dt);
    });
    _(instance).player.update();
  };

  /**
   * @description creates enemies
   * @param {object} instance
   */
  const createEnemies = (instance) => {
    const { enemies, level } = _(instance);
    const createdEnemies = [];
    const { enemiesNumberRange, enemiesSpeedRange } = level; // used for drawing speed and number of enemies
    const enemiesNumber = getRandomInt(
      enemiesNumberRange[0],
      enemiesNumberRange[1],
    );
    const newEnemiesNum = enemiesNumber - enemies.length; // number of new enemies which must be added
    let hasOppositeDirection = false; // used for setting direction of movement
    let enemyTrack; // used for setting track of movement
    let enemySpeed;

    // creates new enemies, first determining values of constructor params
    for (let i = 1; i <= newEnemiesNum; i++) {
      if (enemies.length >= 4) {
        hasOppositeDirection = Boolean(getRandomInt(0, 1));
      }
      enemySpeed = getRandomInt(enemiesSpeedRange[0], enemiesSpeedRange[1]);

      if (enemies.length === 0 && i <= 3) {
        enemyTrack = i;
      } else {
        enemyTrack = getRandomInt(1, 3);
      }

      const startEdge = hasOppositeDirection ? 'right' : 'left';

      createdEnemies.push(new GameEnemy(enemyTrack, enemySpeed, startEdge));
    }

    // stores all enemies (old and new ones) in the private enemies property
    setEnemies(instance, [...enemies, ...createdEnemies]);
  };

  /**
   * @description checks if there is a collision between the player and the enemies
   * @param {object} instance
   */
  const checkCollision = (instance) => {
    const { player, enemies } = _(instance);
    for (const enemy of enemies) { // eslint-disable-line no-restricted-syntax
      if (player.getEdge('left') <= enemy.getEdge('right') &&
        player.getEdge('right') >= enemy.getEdge('left') &&
        player.getEdge('top') <= enemy.getEdge('bottom') &&
        player.getEdge('bottom') >= enemy.getEdge('top')) {
        return true;
      }
    }
    return false;
  };

  /**
   * @description checks if player is dead or lost life only ;-)
   * @param {object} instance
   */
  const checkIsDaed = (instance) => {
    let isDead = false;
    const { player } = _(instance);
    player.die();
    player.decreaseLives();

    if (player.lives === 0) {
      isDead = true;
    } else {
      player.spriteAnimetion('lose');
    }
    return isDead;
  };

  /**
   * @description checks if the player has reached the goal
   * @param {object} instance
   */
  const checkGoal = (instance) => {
    const { player } = _(instance);
    let isGoal = false;
    if (player.y === player.maxCoords.minY) {
      isGoal = true;
    }
    return isGoal;
  };

  /**
   * @description increases the level
   * @param {object} instance
   */
  const increaseLevel = (instance) => {
    const { level, player, enemies } = _(instance);
    level.update();

    // increases speed of existing enemies
    enemies.forEach((enemy) => {
      const speedRange = level.enemiesNumberRange;
      enemy.increaseSpeed(getRandomInt(speedRange[0], speedRange[1]));
    });

    // animates the player
    player.spriteAnimetion('win');
    resetRound(instance, true); // eslint-disable-line no-use-before-define
  };

  /**
   * @description resets game round (stage)
   * @param {object} instance
   * @param {boolean} isLevelIncreased
   */
  const resetRound = (instance, isLevelIncreased) => {
    setTimeout(() => {
      if (isLevelIncreased) {
        // creates new enemies
        createEnemies(instance);
      }

      // resets the player position
      _(instance).player.reset();

      // unlocks the game
      setIsLocked(instance, false);
    }, 1000);
  };

  /**
   * @description displays game intro to show game tutorial and enable game start
   * @param {object} instance
   */
  const startIntro = (instance) => {
    _(instance).panel.displayIntroModal();
  };

  /**
   * @description stops the game and resets its props
   * @param {object} instance
   */
  const stopGame = (instance) => {
    setIsStarted(instance, false);
    setEnemies(instance, []);
    setPlayer(instance, null);
    setLevel(instance, null);
  };

  /**
   * @description ends game when player win or lose
   * @param {object} instance
   */
  const endGame = (instance, result) => {
    const { enemies, player, level, panel } = _(instance);
    // const success = (result === 'win') ? true : false;
    const success = result === 'win';
    enemies.forEach((enemy) => {
      enemy.stop();
    });
    player.spriteAnimetion(result);
    setTimeout(() => {
      panel.displayResultModal(success, level.level, player.lives, 0, 0);
      stopGame(instance);
    }, 1000);
  };

  class Game {
    constructor() {
      // private properties for Game class
      const privateProps = {
        panel: new GamePanel(),
        isStarted: false,
        isLocked: false,
        level: null,
        player: null,
        maxLevel: 12,
        enemies: [],
      };
      // stores private properties for class instance
      priv.set(this, privateProps);
      // turns on the modal with game tutorial
      startIntro(this);
    }

    // getters for private properties
    get isStarted() {
      return _(this).isStarted;
    }
    get isLocked() {
      return _(this).isLocked;
    }
    get panel() {
      return _(this).panel;
    }
    get level() {
      return _(this).level;
    }
    get player() {
      return _(this).player;
    }
    get enemies() {
      return [..._(this).enemies];
    }
    get maxLevel() {
      return _(this).maxLevel;
    }

    // public methods
    /**
     * @description rednders game entities and game info (level, lives)
     */
    render() {
      if (this.isStarted) {
        renderEntities(this);
        this.panel.render(this.level.level, this.player.lives);
      }
    }

    /**
     * @description updates game entities
     *   and checks the game's incidents: collision or pass the level
     */
    update(dt) {
      if (!this.isStarted) {
        return;
      }
      updateEntities(this, dt);
      if (this.isLocked) {
        return;
      }
      if (checkCollision(this)) {
        setIsLocked(this, true);
        if (checkIsDaed(this)) {
          endGame(this, 'lose');
        } else {
          resetRound(this, false);
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

    /**
     * @description starts the game
     * @param {object} instance
     */
    startGame(sprite) {
      setLevel(this, new GameLevel());
      createEnemies(this);
      setPlayer(this, new GamePlayer(sprite));
      setIsStarted(this, true);
      setIsLocked(this, false);
    }
  }
  return Game;
})();
// creates game instance - it controls game initialization itself
const game = new ArcadeGame();
