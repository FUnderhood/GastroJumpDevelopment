import { Global } from './global'
import CONFIG from 'src/app/home/GastroJump/config'
import { platform } from 'process';

// GameConfigs

var gameWidth = CONFIG.DEFAULT_WIDTH;
var gameHeight = CONFIG.DEFAULT_HEIGHT;

// Player
var player;
var playerStartPositionY = gameHeight * 0.872;
var playerStartPositionX = gameWidth/2;
var highestPlayerBodyPosition = playerStartPositionY;


// Tracking 
var cursors;
var lastX = 0;
var lastY = playerStartPositionY;

var stageTracker = 1;
var playerPositionY;
var gameOver = false;

var changeDirectionTimer = 0;




var highestYPos;
var stageEnd;

// gameObjects
var camera;
var ground;

var gameOverTextCalled;
var touchingDrop;
var endScreenCountdown = 0;

// Platforms


var movingPlatformList = [];
var movingPlatformStartPositionList = [];
var newMovingPlatformStartPositionList = [];
var movingPlatformCounter = 0;
var newMovingPlatformList = [];



// Power Ups
var jumpPowerUp;
var jumpPowerUpNumbs = 0;
var jumpPowerUpList = [];

// Collectibles
var dollarCollectible;
var collectibleNumbs = 0;
var collectibleList = [];
var collectibleCollected = false;
var collectibleTextNumbs = 0;
var collectibleTextList = [];

// Enemies
var enemy_basic;
var basicEnemyNumbs = 0;
var basicEnemyList = [];

// Game Over



// Score

var pointerLocX;


// Gyroscope and Acceleration
var alphaRot = 0;
var betaRot = 0;
var gammaRot = 0;
var alphaAcc = 0;
var betaAcc = 0;
var gammaAcc = 0;
var gammaRotNeutral = 0;

var firstTime = true;

var platformCounter = 0;
var platformList = [];
var platforms;

var originalPlayerX = 0;

var currentStage = 0;


export class GameScene extends Phaser.Scene {
    constructor(config) {
      super("GameScene");
    }


    preload() {

      // Background
      this.load.image('background', 'assets/gameObjects/background_stage_1.png');
      
      // Player
      this.load.image('gastroGator', 'assets/gameObjects/GastroGator.png')

      // Enemies
      this.load.image('basicEnemy', 'assets/gameObjects/enemy_basic.png')

      // Power Ups
      this.load.image('burgerPowerUp', 'assets/gameObjects/burger_powerup.png')

      //Collectibles
      this.load.image('dollarCollectible', 'assets/gameObjects/dollar.png');
      this.load.image('plus500', 'assets/gameObjects/plus_500.png');

      // Platforms
      this.load.image('solidPlatform', 'assets/gameObjects/solid_platform.png');
      this.load.image('movingPlatform', 'assets/gameObjects/moving_platform.png');
      this.load.image('droppingPlatform', 'assets/gameObjects/dropping_platform.png');
      
      // World
      this.load.image('ground', 'assets/gameObjects/ground.png');

    }

    create() {


      // get Gyroscope direction
      gammaRotNeutral = gammaRot;
  
      //Create Level
      
      ground = this.physics.add.staticGroup();
      ground.create(0, gameHeight * 0.93, "ground").setOrigin(0,0).setScale(2).refreshBody();

      platforms = this.physics.add.group({
        allowGravity: false
      });

      // Create Player


      
      player = this.physics.add.sprite(playerStartPositionX, playerStartPositionY, 'gastroGator').refreshBody();
      player.setBounce(0.2);
      player.body.setGravityY(300)

      // Create Enemy

      enemy_basic = this.physics.add.group({
        allowGravity: false
      });

      // Create PowerUp

      jumpPowerUp = this.physics.add.group({
        allowGravity: false
      });

      // Create Collectibles

      dollarCollectible = this.physics.add.group({
        allowGravity: false
      })


      // Collider and Overlap

      this.physics.add.collider(player, ground);
      this.physics.add.collider(player, platforms, dropPlayer);
      this.physics.add.collider(player, enemy_basic, enemyInteraction);
      this.physics.add.collider(player, jumpPowerUp, superJumpPlayer);
      this.physics.add.overlap(player, dollarCollectible, increaseScore);

      // Camera

      camera = this.cameras.main;
      camera.zoom = 1;
      camera.setBounds(0, 0, gameWidth, gameHeight);
      if (Global.startGameScene){
        camera.startFollow(player);
      }
      camera.setFollowOffset(0, gameHeight*0.1);


      // Input  

      cursors = this.input.keyboard.createCursorKeys();
      if(window.DeviceOrientationEvent){
        window.addEventListener("deviceorientation", orientation, false);
      }else{
        console.log("DeviceOrientationEvent is not supported");
      }
      if(window.DeviceMotionEvent){
        window.addEventListener("devicemotion", motion, false);
      }else{
        console.log("DeviceMotionEvent is not supported");
      }
    }

    


    update() {

      // Check current stage
      if (Global.highestReachedDistance < CONFIG.STAGE_1_START){
        currentStage = 0
      }
      else if (Global.highestReachedDistance > CONFIG.STAGE_1_START && Global.highestReachedDistance > CONFIG.STAGE_2_START){
        currentStage = 1
      }
      else if (Global.highestReachedDistance < CONFIG.STAGE_2_START && Global.highestReachedDistance > CONFIG.STAGE_3_START){
        currentStage = 2
      }
      else if (Global.highestReachedDistance < CONFIG.STAGE_3_START && Global.highestReachedDistance > CONFIG.STAGE_4_START){
        currentStage = 3
      }
      else if (Global.highestReachedDistance < CONFIG.STAGE_4_START){
        currentStage = 4
      }

 
      // Player position correction
      // (this workaround is needed because coordinates are weirdly defined)
      // The players starts at 1000, goes to 0, then goes to -1000
      
      playerPositionY = ~~((playerStartPositionY - player.body.position.y))/1


      // Player Controls

      if (Global.controlType == CONFIG.DEFAULT_CONTROL_TYPE){
        if (cursors.left.isDown && !gameOver)
        {
          player.setVelocityX(-250);
        }

      else if (cursors.right.isDown && !gameOver)
        {
          player.setVelocityX(250);
        }

      else
        {
          player.setVelocityX(0);
        }

      } 
      if (Global.controlType == CONFIG.TOUCH_CONTROL_TYPE){
        
        this.input.on('pointerdown', function (pointer) {
          pointerLocX = pointer.x;
          originalPlayerX = player.x;
          if (pointerLocX < (originalPlayerX -20) && pointerLocX != 0 && !gameOver)  
          { 
            player.setVelocityX(-250);
          }
  
          else if (pointerLocX > (originalPlayerX +20) && pointerLocX != 0 && !gameOver)
          {
            player.setVelocityX(250);
          }
          else
          {
            player.setVelocityX(0);
            pointerLocX = 0;
          }
        
        }, this);
        this.input.on('pointerup', function (pointer) {
          player.setDamping(true).setDrag(0.7)
        }, this);
        if (player.body.velocity.x <= 80 && player.body.velocity.x >= -80){
          player.setVelocityX(0);
        }

  
      }
      if (Global.controlType == CONFIG.GYROSCOPE_CONTROL_TYPE && !gameOver){
        if ((gammaRot >= gammaRotNeutral- 5) && (gammaRot <= gammaRotNeutral + 5)){
          player.setVelocityX(0);
        }
        else if (!gameOver){
          var playerVelocity = (gammaRot - gammaRotNeutral) * 10;
          player.setVelocityX(playerVelocity);  
        }

      }
      
      // Permanent Jumping
      if (player.body.touching.down && !gameOver && Global.startGameScene)
        {
            player.setVelocityY(-650);
        }

      
      // Wrap around

      if (player.body.position.x < 0){
        player.setPosition(gameWidth-(player.width*0.2), player.body.position.y);
      }

      if (player.body.position.x > gameWidth){
        player.setPosition(player.width*0.5, player.body.position.y);
      }
      

      // Camera tracking
      if (Global.startGameScene){
        if (player.body.position.y < highestPlayerBodyPosition){
          highestPlayerBodyPosition = player.body.position.y;
        }
        if (highestPlayerBodyPosition - (gameHeight/2) > 0){
          camera.setBounds(0, 0, gameWidth, gameHeight);
        }
        else{
          camera.setBounds(0, (highestPlayerBodyPosition - (gameHeight/2)), gameWidth, gameHeight);
        }
      }
    
     


      // Highest Reached Distance / Highscore 

      if (Global.highestReachedDistance < playerPositionY){
        Global.highestReachedDistance = playerPositionY;
      }  


      // Game Over

      if (playerPositionY <= Global.highestReachedDistance -  (gameHeight/2) && gameOver == false && Global.startGameScene){
        killPlayer();
      }

      if (gameOver && !gameOverTextCalled){
        
        if  (endScreenCountdown > 30){
          gameOverTextCalled = true;
          this.scene.run("GameOverScene");
          //var gameOverGameScene = this.scene.get("GameOverScene");
          this.scene.get("GameOverScene").scene.bringToTop();
          this.scene.get("GameOverScene").scene.setVisible(true).setActive(true);

          

          this.scene.get("UIScene").scene.setActive(false).setVisible(false);
          
          
        }
        endScreenCountdown++;
      }

      
      // Check for deletion
      var deletionHeight = Global.highestReachedDistance-(gameHeight/2)

      for (let i = 0; i < platformCounter; i++) {
        if (deletionHeight > (playerStartPositionY - platformList[i].y)){
          platformList[i].destroy();
        }
      }
     
      for (let i = 0; i < movingPlatformCounter; i++) {
        if (deletionHeight > (playerStartPositionY - movingPlatformList[i].y)){
          movingPlatformList[i].destroy();
          movingPlatformStartPositionList.shift();
          
        }
        else{
          newMovingPlatformList.push(movingPlatformList[i]);
          newMovingPlatformStartPositionList.push(movingPlatformStartPositionList[i]);

        }
      }
      movingPlatformList = [];
      movingPlatformList = newMovingPlatformList;
      newMovingPlatformList = [];
      movingPlatformCounter = movingPlatformList.length;
      movingPlatformStartPositionList = [];
      movingPlatformStartPositionList = newMovingPlatformStartPositionList;
      newMovingPlatformStartPositionList = [];

      for (let i = 0; i < basicEnemyNumbs; i++) {
        if (deletionHeight > (playerStartPositionY - basicEnemyList[i].y)){
          basicEnemyList[i].destroy();
        }
      }
      for (let i = 0; i < jumpPowerUpNumbs; i++) {
        if (deletionHeight > (playerStartPositionY - jumpPowerUpList[i].y)){
          jumpPowerUpList[i].destroy();
        }
      }
      for (let i = 0; i < collectibleNumbs; i++) {
        if (deletionHeight > (playerStartPositionY - collectibleList[i].y)){
          collectibleList[i].destroy();
        }
      }
      for (let i = 0; i < collectibleTextNumbs; i++) {
        if (deletionHeight > (playerStartPositionY - collectibleTextList[i].y)){
          collectibleTextList[i].destroy();
        }
      }


      

      // Moving Platforms
     
        for (let i = 0; i < movingPlatformList.length; i++) {
          var movingPlatformVelocity = movingPlatformList[i].body.velocity.x 
          if (movingPlatformVelocity == 0){
            if (getRandom(0,1) == 0){
              movingPlatformList[i].setVelocityX(getRandom(50, 150));
            }
            else{
              movingPlatformList[i].setVelocityX(getRandom(-150, -50));
            }
          }
          if (movingPlatformList[i].x > movingPlatformStartPositionList[i] + 100 || movingPlatformList[i].x > 0.8 * gameWidth){
            movingPlatformList[i].setVelocityX((-1) * Math.abs(movingPlatformVelocity));
          }
          else if (movingPlatformList[i].x < movingPlatformStartPositionList[i] - 100 || movingPlatformList[i].x < 0.1 * gameWidth ){
            movingPlatformList[i].setVelocityX(Math.abs(movingPlatformVelocity));
          }
        }
        


      // New Stage Creation

      if (((Global.highestReachedDistance > (1000 * stageTracker)) || firstTime) && Global.startGameScene){
        //this.add.image(0, gameHeight-(1000*stageTracker), 'background').setOrigin(0,0).setScale(2);
        //this.add.image(0, gameHeight-400-(1000*stageTracker), 'background').setOrigin(0,0).setScale(2);
        //this.add.image(0, gameHeight-800-(1000*stageTracker), 'background').setOrigin(0,0).setScale(2);

        if (!firstTime){
          lastY = highestYPos;
          stageEnd = lastY - 1400;
        }
        else{
          stageEnd = -2000
          firstTime = false;
        }


        while (lastY > stageEnd){
          lastX = 0;
       
            lastX = getRandom(gameWidth*0.1, gameWidth*0.7);
            lastY = getRandom(lastY-90, lastY-120);
            var platformDecision = getRandom(0, 100);
            var enemyDecision = getRandom(0, 100);
            var powerUpDecision = getRandom(0, 100);
            var collectibleDecision = getRandom(0, 100);
            var lastSolidPlatform = false;
            
            if (platformDecision < CONFIG.PLATFORM_MOVING_SPAWNRATE[currentStage]){
              makePlatform(lastX, lastY, CONFIG.MOVING_PLATFORM_TYPE);
            }
            else if (platformDecision > CONFIG.PLATFORM_MOVING_SPAWNRATE[currentStage] && platformDecision < (CONFIG.PLATFORM_DROPPING_SPAWNRATE[currentStage] + CONFIG.PLATFORM_MOVING_SPAWNRATE[currentStage])){
              makePlatform(lastX, lastY, CONFIG.DROPPING_PLATFORM_TYPE); 
            }
            else{
              makePlatform(lastX, lastY, CONFIG.SOLID_PLATFORM_TYPE);
              lastSolidPlatform = true;
            }
            if (enemyDecision < CONFIG.ENEMY_BELLPEPPER_SPAWNRATE[currentStage] && lastSolidPlatform){
              basicEnemyList[basicEnemyNumbs] = enemy_basic.create(lastX+20, lastY-50, "basicEnemy").setOrigin(0,0).setScale(1);
              basicEnemyList[basicEnemyNumbs].setImmovable(true);
              lastSolidPlatform = false;
              basicEnemyNumbs ++;

            }
            if (powerUpDecision < CONFIG.POWER_UP_BURGER_SPAWNRATE[currentStage] && lastSolidPlatform && enemyDecision > CONFIG.ENEMY_BELLPEPPER_SPAWNRATE[currentStage]){
              jumpPowerUpList[jumpPowerUpNumbs] = jumpPowerUp.create(lastX+20, lastY-21, "burgerPowerUp").setOrigin(0,0).setScale(1);
              jumpPowerUpList[jumpPowerUpNumbs].setImmovable(true);

              lastSolidPlatform = false;
              jumpPowerUpNumbs ++;

            }
            if (collectibleDecision < CONFIG.COLLECTIBLE_1DOLLAR_SPAWNRATE[currentStage] && lastSolidPlatform){
              collectibleList[collectibleNumbs] = dollarCollectible.create(getRandom(30, 250), getRandom(lastY-20, lastY-120), 'dollarCollectible').setOrigin(0,0).setScale(1);
              collectibleList[collectibleNumbs].setImmovable(true);

              lastSolidPlatform = false;
              collectibleNumbs ++;


          }
          
      }
      stageTracker++;
      highestYPos = lastY;
    }
    if (collectibleCollected){
      var scoreImage = this.add.image(player.body.position.x, player.body.position.y, 'plus500').setScale(0.2);
      collectibleCollected = false;
      setInterval(() => {
        scoreImage.destroy();
      }, 1000);
    }
  
  }
  
}





// Random number generator function
// Retruns random integer numbers between min (including) and max (including)
function getRandom(min, max){
    var value = Math.floor(Math.random() * (max - min + 1) + min);
    return value;
  }
  
  
  // Platform creation
  // Solid Platform: No movement, safe
  // Moving Platforms: Moving from left to right, safe
  // Dropping Platforms: No movement, drop down with player when touched

function makePlatform(x, y, type){  
  
    platformList[platformCounter] = platforms.create(x, y, CONFIG.PLATFORM_IMG_TYPES[type]).setOrigin(0,0).setScale(1.5).refreshBody();
    platformList[platformCounter].body.checkCollision.down = false;
    platformList[platformCounter].body.checkCollision.left = false;
    platformList[platformCounter].body.checkCollision.right = false;

    if (type == CONFIG.SOLID_PLATFORM_TYPE){
      platformList[platformCounter].body.moves = false;
      platformList[platformCounter].setImmovable(true);
    }
    else if (type == CONFIG.MOVING_PLATFORM_TYPE){
      platformList[platformCounter].setImmovable(true);
      movingPlatformList.push(platformList[platformCounter])
      movingPlatformStartPositionList[movingPlatformCounter] = movingPlatformList[movingPlatformCounter].x;
      movingPlatformCounter++;

    }
    else if (type == CONFIG.DROPPING_PLATFORM_TYPE){
    }
    platformCounter++;

}

  function enemyInteraction(player_character, interacted_enemy){
    if (interacted_enemy.body.touching.up){
      interacted_enemy.destroy()
    }
    else{
      killPlayer();
    }
  }
  
  function killPlayer(){
    gameOver = true;
    player.setImmovable(true);
    player.body.moves = false;
    player.setTint(0xff0000);
  }
  
  function dropPlayer(player_character, touched_platform){
    if (touched_platform.texture.key == "droppingPlatform" && touched_platform.body.touching.up){
      touched_platform.destroy();
    }
  }
  
  function superJumpPlayer(player_character, powerUp){
    powerUp.destroy();
    player.body.setVelocityY(-1000);
  }
  
  function increaseScore(player_character, collectibleItem){
    collectibleItem.destroy();
    Global.scoreBonus =+ 500;
    collectibleCollected = true;
  }
  
  
  function orientation(event){
    alphaRot = event.alpha;
    betaRot = event.bet;
    gammaRot = event.gamma;
  }
  
  function motion(event){
    alphaAcc = event.accelerationIncludingGravity.x;
    betaAcc = event.accelerationIncludingGravity.y;
    gammaAcc = event.accelerationIncludingGravity.z;
  }

  



export function restartGame(){

    player.setPosition(playerStartPositionX, playerStartPositionY);
    player.setImmovable(false);
    player.body.moves = true;
    player.clearTint();
    player.setVelocityY(-650);
  
  
    gameOver = false;
    Global.highestReachedDistance = 0;
    lastY = playerStartPositionY;
    firstTime = true;
    endScreenCountdown = 0;
    gameOverTextCalled = false;
    stageTracker = 1;
    Global.scoreBonus = 0;
    highestPlayerBodyPosition = playerStartPositionY
    currentStage = 0;
  
    for (let i = 0; i < basicEnemyNumbs; i++) {
      basicEnemyList[i].destroy();
    }
    basicEnemyNumbs = 0;
  
    for (let i = 0; i < jumpPowerUpNumbs; i++) {
      jumpPowerUpList[i].destroy();
    }
    jumpPowerUpNumbs = 0;
  
    for (let i = 0; i < collectibleNumbs; i++) {
      collectibleList[i].destroy();
    }
    collectibleNumbs = 0;
  
    

    for (let i = 0; i < platformCounter; i++) {
        platformList[i].destroy();
    }
    platformCounter = 0;
    for (let i = 0; i < movingPlatformCounter; i++) {
      movingPlatformList[i].destroy();
  }
  movingPlatformCounter = 0;
    
  }
