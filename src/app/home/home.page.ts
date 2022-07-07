import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import CONFIG from 'src/config'
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { ControlContainer } from '@angular/forms';
import { BaseScene } from "phaser-utility/scenes/BaseScene";





// GameConfigs

var gameWidth = CONFIG.DEFAULT_WIDTH;
var gameHeight = CONFIG.DEFAULT_HEIGHT;


// Set control type
// 0: keybaord arrows (desktop)
// 1: gyroscope (phone)
// 2: touch/mouse (desktop and phone)
// 3: advanced gyroscope (phone)
var controlType = 0;


// Player
var player;
var playerStartPositionY = gameHeight * 0.8;
var playerStartPositionX = gameWidth/2;
var highestPlayerBodyPosition = playerStartPositionY;


// Tracking 
var cursors;
var lastX = 0;
var lastY = playerStartPositionY;

var stageTracker = 1;
var score = 0;
var scoreText;
var gameOverText;
var gameOverCapsText;
var gameOverImage;
var highestReachedDistance = 0;
var playerPositionY;
var gameOver = false;

var changeDirectionTimer = 0;




var highestYPos;
var firstY = true;
var stageEnd;

// gameObjects
var camera;
var redo;

var ground;



var gameOverTextCalled;
var black_screen;
var touchingDrop;
var endScreenCountdown = 0;

var scoreBonus = 0;


// Platforms
var solidPlatforms;
var movingPlatforms;
var droppingPlatforms;

var solidPlatformNumbs = 0;
var movingPlatformNumbs = 0;
var droppingPlatformNumbs = 0;

var solidPlatformList = [];
var movingPlatformList = [];
var newMovingPlatformList = [];
var droppingPlatformList = [];



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
var rotationText;
var accelerationText;
var alphaRot = 0;
var betaRot = 0;
var gammaRot = 0;
var alphaAcc = 0;
var betaAcc = 0;
var gammaAcc = 0;
var gammaRotNeutral = 0;

var firstTime = true;

var startGame;
var pauseButton
var paused;

var touchButton;
var motionButton;

var uiGameScene

var bigBackgroundsPlaced

var startGameScene = false;
var launchUI = true;

class StartScene extends Phaser.Scene {
  constructor(config) {
      super("StartScene");
  }
  preload(){
    this.load.image('startGame', 'assets/gameObjects/startGameButton.png')
    this.load.image('home_screen', 'assets/gameObjects/home_screen.png')
    this.load.image('touchButton', 'assets/gameObjects/touch_button.png')
    this.load.image('motionButton', 'assets/gameObjects/motion_button.png')
    this.load.image('touchButtonRed', 'assets/gameObjects/touch_button_red.png')
    this.load.image('motionButtonRed', 'assets/gameObjects/motion_button_red.png')
   
  }
  create(){
    this.scene.launch('GameScene');
    this.scene.bringToTop();


    
    console.log("Width:" + this.sys.game.canvas.width + " Height:" + this.sys.game.canvas.height);
    var runningGameScene = this.scene.get("GameScene");
    var pausingGameScene = this.scene.get("PauseScene");

    //this.add.image(0, 0, 'home_screen').setOrigin(0,0);


    touchButton = this.add.sprite(gameWidth*0.1, gameHeight*0.55, 'touchButton').setOrigin(0,0).setInteractive();
    motionButton = this.add.sprite(gameWidth*0.1, gameHeight*0.75, 'motionButton').setOrigin(0,0).setInteractive();
    touchButton.on('pointerdown', function (pointer){
      touchButton.setTexture('touchButtonRed')
      motionButton.setTexture('motionButton')
      console.log("Touch");
      controlType = 2;
    });
    motionButton.on('pointerdown', function (pointer){
      touchButton.setTexture('touchButton')
      motionButton.setTexture('motionButtonRed')
      console.log("Motion");
      controlType = 3;
    });




    startGame = this.add.sprite(100, 350, "startGame").setOrigin(0, 0).setInteractive();
    startGame.on('pointerdown', function (pointer){
      console.log(runningGameScene.scale.orientation);
      runningGameScene.scale.lockOrientation('portrait-primary');
      console.log(pausingGameScene.scale.orientation);
      pausingGameScene.scale.lockOrientation('portrait-primary');
      
      this.scene.pause();
      this.scene.setVisible(false);
      startGameScene = true;
      //this.scene.launch('GameScene');

    }, this);
    

  }
}

class PauseScene extends Phaser.Scene {
  constructor(config) {
    super("PauseScene");
  }
preload(){
  this.load.image('gamePaused', 'assets/gameObjects/game_paused.png')
  this.load.image('colourOverlay', 'assets/gameObjects/colour_overlay.png')
  }
create(){
  this.add.image(0, 0, 'colourOverlay').setOrigin(0,0);
  this.add.image(100, 200, 'gamePaused').setOrigin(0,0);
  touchButton = this.add.sprite(10, 600, 'touchButton').setOrigin(0,0).setInteractive().setScale(0.5);
  motionButton = this.add.sprite(210, 600, 'motionButton').setOrigin(0,0).setInteractive().setScale(0.5);
  touchButton.on('pointerdown', function (pointer){
    touchButton.setTexture('touchButtonRed')
    motionButton.setTexture('motionButton')
    console.log("Touch");
    controlType = 2;
    });
  motionButton.on('pointerdown', function (pointer){
    touchButton.setTexture('touchButton')
    motionButton.setTexture('motionButtonRed')
    console.log("Motion");
    controlType = 3;
    });
  }
update(){
    
  }
}

class UIScene extends Phaser.Scene {
  constructor(config) {
    super("UIScene");
  }
  preload(){
    this.load.image('pauseButton', 'assets/gameObjects/pause_button.png');  
    this.load.image('resumeButton', 'assets/gameObjects/resume_button.png');  
  }
  create(){
    this.scene.bringToTop();

    // Create UI
    scoreText = this.add.text(16, 20, 'Score: 0');
    //rotationText = this.add.text(16, 60, '0, 0, 0');
    //accelerationText = this.add.text(16, 100, '0, 0, 0');
    pauseButton = this.add.sprite(gameWidth-50, 10, 'pauseButton').setOrigin(0,0).setInteractive().setScale(0.8);


    // Game Pausing and Resuming
    var runningGameScene = this.scene.get("GameScene");
    var pausingGameScene = this.scene.get("PauseScene");

    pauseButton.on('pointerdown', function (pointer){
      if (!paused){
        pauseButton.setTexture('resumeButton');
        runningGameScene.scene.pause();
        this.scene.launch('PauseScene');
        this.scene.resume("PauseScene");
        pausingGameScene.scene.setActive(true).setVisible(true);
        pausingGameScene.scene.bringToTop();
        paused = true;
      }
      else{
        pauseButton.setTexture('pauseButton');
        pausingGameScene.scene.pause();
        pausingGameScene.scene.setActive(false).setVisible(false);
        runningGameScene.scene.bringToTop();
        this.scene.resume("GameScene");
        paused = false;
      }
      this.scene.bringToTop();
    }, this);

    
    
  }
  update(){

    // UI updating 
    scoreText.setText("Score: " + (highestReachedDistance + scoreBonus));
    //rotationText.setText(alphaRot + ", " + betaRot +", " + gammaRot);
    //accelerationText.setText(alphaAcc + ", " + betaAcc +", " + gammaAcc);
 
      
  }
}
class GameOverScene extends Phaser.Scene {
  constructor(config) {
    super("GameOverScene");
  }
preload(){
  this.load.image('blackScreen', 'assets/gameObjects/black_screen.png');
  this.load.image('redo', 'assets/gameObjects/redo.png');
  this.load.image('gameOver', 'assets/gameObjects/game_over.png') 

  }
create(){
  var xPlacement = this.cameras.main.width / 2;
  var yPlacement = this.cameras.main.height / 2;

  this.scene.setActive(true).setVisible(true);
  this.scene.bringToTop();
  black_screen = this.add.image(0, 0, "blackScreen").setOrigin(0,0);
  gameOverImage = this.add.image(0, 0 , "gameOver");
  gameOverImage.setPosition(xPlacement, yPlacement * 0.3); 
  gameOverText = this.add.text(0, 0, 'Thank you \nfor playing!\n\nYou achieved\na score of\n' + highestReachedDistance, { fontSize: '32px'});
  gameOverText.setPosition(xPlacement-(gameOverText.width / 2), yPlacement); 
  redo = this.add.sprite(0, 0, "redo").setInteractive();
  redo.setPosition(xPlacement-(redo.width / 2), yPlacement*1.6); 
  redo.on('pointerdown', function (pointer){
    uiGameScene.scene.setActive(true).setVisible(true);
    this.scene.setActive(false).setVisible(false);
    //this.scene.remove("GameOverScene");
    restartGame();
    }, this);
  }
update(){
    
  }
}


class GameScene extends Phaser.Scene {
    constructor(config) {
      super("GameScene");
    }


    preload() {

      // Background
      this.load.image('background', 'assets/gameObjects/background_stage_1.png');
      
      // Player
      this.load.spritesheet('dude', 'assets/gameObjects/dude.png', { frameWidth: 32, frameHeight: 48 });
      this.load.image('gastroGator', 'assets/gameObjects/GastroGator.png')


      // Enemies
      this.load.image('basicEnemy', 'assets/gameObjects/enemy_basic.png')

      // Power Ups
      this.load.image('burgerPowerUp', 'assets/gameObjects/burger_powerup.png')

      //Collectibles
      this.load.image('dollarCollectible', 'assets/gameObjects/dollar.png');

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
      ground.create(0, gameHeight * 0.95, "ground").setOrigin(0,0).setScale(2).refreshBody();
    

      solidPlatforms = this.physics.add.group({
        allowGravity: false
      });
      droppingPlatforms = this.physics.add.group({
        allowGravity: false
      });
      movingPlatforms = this.physics.add.group({
        allowGravity: false
      });



      // Create Player


      
      player = this.physics.add.sprite(gameWidth/2, gameHeight*0.8, 'gastroGator').refreshBody();
      player.setBounce(0.2);
      player.body.setGravityY(300)
      
/*
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
          key: 'turn',
          frames: [ { key: 'dude', frame: 4 } ],
          frameRate: 20
      });

      this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
          frameRate: 10,
          repeat: -1
      });
*/

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
      this.physics.add.collider(player, solidPlatforms);
      this.physics.add.collider(player, movingPlatforms);
      this.physics.add.collider(player, droppingPlatforms, dropPlayer);
      this.physics.add.collider(player, enemy_basic, killPlayer);
      this.physics.add.collider(player, jumpPowerUp, superJumpPlayer);
      this.physics.add.overlap(player, dollarCollectible, increaseScore);


      


      // Camera

      camera = this.cameras.main;
      camera.zoom = 1;
      camera.setBounds(0, 0, gameWidth, gameHeight);
      if (startGameScene){
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

      
      // Create UI
      if (startGameScene && launchUI){
        this.scene.launch('UIScene');
        launchUI = false;
      }
 
      // Player position correction
      // (this workaround is needed because coordinates are weirdly defined)
      // The players starts at 1000, goes to 0, then goes to -1000
      
      playerPositionY = ~~((playerStartPositionY - player.body.position.y))/1


      // Player Controls

      if (controlType == 0){
        if (cursors.left.isDown && !gameOver)
        {
          player.setVelocityX(-250);
          player.anims.play('left', true);
        }

      else if (cursors.right.isDown && !gameOver)
        {
          player.setVelocityX(250);
          player.anims.play('right', true);
        }

      else
        {
          player.setVelocityX(0);
          player.anims.play('turn');
        }

      } 
      else if (controlType == 1){
        if (gammaRot <= 0 && !gameOver)  
        { 
          player.setVelocityX(-250);
          player.anims.play('left', true);
        }

      else if (gammaRot > 0 && !gameOver)
        {
          player.setVelocityX(250);
          player.anims.play('right', true);
        }

      else
        {
          player.setVelocityX(0);
          player.anims.play('turn');
          pointerLocX = 0;
        }

      }
      else if (controlType == 2){
        this.input.on('pointerdown', function (pointer) {
          pointerLocX = pointer.x;
          console.log(pointerLocX);
        }, this);
        this.input.on('pointerup', function (pointer) {
          pointerLocX = 0;
        }, this);
  
        if (pointerLocX <= (player.x) && pointerLocX != 0 && !gameOver)  
          { 
            player.setVelocityX(-250);
            player.anims.play('left', true);
          }
  
        else if (pointerLocX > (player.x) && pointerLocX != 0 && !gameOver)
          {
            player.setVelocityX(250);
            
            player.anims.play('right', true);
          }
  
        else
          {
            player.setVelocityX(0);
            player.anims.play('turn');
            pointerLocX = 0;
          }
        
      }
      else if (controlType == 3 && !gameOver){
        if ((gammaRot >= gammaRotNeutral- 5) && (gammaRot <= gammaRotNeutral + 5)){
          player.setVelocityX(0);
          player.anims.play('turn');
        }
        else if (!gameOver){
          var playerVelocity = (gammaRot - gammaRotNeutral) * 10;
          player.setVelocityX(playerVelocity);  
          if (gammaRot < gammaRotNeutral)  
          { 
            player.anims.play('left', true);
          }

          else if (gammaRot > gammaRotNeutral)
            {
              player.anims.play('right', true);
            }
          else
            {
              player.anims.play('turn');
            }

        }
        else {
          player.setVelocityX(0);
          player.anims.play('turn');
        }
        

      }
      
      

      


      // Permanent Jumping

      if (player.body.touching.down && !gameOver && startGameScene)
        {
          if (touchingDrop && player.body.velocity.y > 0){
            player.setVelocityY(400);
            touchingDrop = false;
          }
          else{
            player.setVelocityY(-750);
          }
        }

      
      // Wrap around

      if (player.body.position.x < 0){
        player.setPosition(gameWidth-(player.width*0.2), player.body.position.y);
      }

      if (player.body.position.x > gameWidth){
        player.setPosition(player.width*0.5, player.body.position.y);
      }
      

      // Camera tracking
      if (startGameScene){
        if (player.body.position.y < highestPlayerBodyPosition){
          highestPlayerBodyPosition = player.body.position.y;
        }
        camera.setBounds(0, (highestPlayerBodyPosition - (gameHeight/2)), gameWidth, gameHeight);
      }
    
     


      // Highest Reached Distance / Highscore 

      if (highestReachedDistance < playerPositionY){
        highestReachedDistance = playerPositionY;
      }  


      // Game Over

      if (playerPositionY <= highestReachedDistance -  (gameHeight/2) && gameOver == false && startGameScene){
        killPlayer();
      }

      if (gameOver && !gameOverTextCalled){
        
        if  (endScreenCountdown > 30){
          gameOverTextCalled = true;
          this.scene.launch("GameOverScene");
          //var gameOverGameScene = this.scene.get("GameOverScene");
          //gameOverGameScene.scene.bringToTop();

          
          uiGameScene = this.scene.get("UIScene");
          uiGameScene.scene.setActive(false).setVisible(false);
          
          
        }
        endScreenCountdown++;
        
      }

      
    


      // Check for deletion

      for (let i = 0; i < solidPlatformNumbs; i++) {
        if ((highestReachedDistance-(gameHeight/2)) > (playerStartPositionY - solidPlatformList[i].y)){
          solidPlatformList[i].destroy();
        }
      }
      
      for (let i = 0; i < droppingPlatformNumbs; i++) {
        if ((highestReachedDistance-(gameHeight/2)) > (playerStartPositionY - droppingPlatformList[i].y)){
          droppingPlatformList[i].destroy();
        }
      }
      for (let i = 0; i < movingPlatformNumbs; i++) {
        if ((highestReachedDistance-(gameHeight/2)) > (playerStartPositionY - movingPlatformList[i].y)){
          movingPlatformList[i].destroy();
        }
        else{
          newMovingPlatformList.push(movingPlatformList[i]);

        }
      }
      movingPlatformList = [];
      movingPlatformList = newMovingPlatformList;
      newMovingPlatformList = [];
      movingPlatformNumbs = movingPlatformList.length;

      for (let i = 0; i < basicEnemyNumbs; i++) {
        if ((highestReachedDistance-(gameHeight/2)) > (playerStartPositionY - basicEnemyList[i].y)){
          basicEnemyList[i].destroy();
        }
      }
      for (let i = 0; i < jumpPowerUpNumbs; i++) {
        if ((highestReachedDistance-(gameHeight/2)) > (playerStartPositionY - jumpPowerUpList[i].y)){
          jumpPowerUpList[i].destroy();
        }
      }
      for (let i = 0; i < collectibleNumbs; i++) {
        if ((highestReachedDistance-(gameHeight/2)) > (playerStartPositionY - collectibleList[i].y)){
          collectibleList[i].destroy();
        }
      }
      for (let i = 0; i < collectibleTextNumbs; i++) {
        if ((highestReachedDistance-(gameHeight/2)) > (playerStartPositionY - collectibleTextList[i].y)){
          collectibleTextList[i].destroy();
        }
      }


      

      // Moving Platforms

      if (changeDirectionTimer <= 100){
        for (let i = 0; i < movingPlatformList.length; i++) {
          movingPlatformList[i].setVelocityX(getRandom(50, 150));
        }
      }
      else {
        for (let i = 0; i < movingPlatformList.length; i++) {
          movingPlatformList[i].setVelocityX(getRandom(-50, -150));
          }
        }
      changeDirectionTimer++;
      if (changeDirectionTimer >= 200){
        changeDirectionTimer = 0;
      }


      // New Stage Creation

      if (((highestReachedDistance > (1000 * stageTracker)) || firstTime) && startGameScene){
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
       
            lastX = getRandomPosition(gameWidth*0.1, gameWidth*0.7);
            lastY = getRandomPosition(lastY-40, lastY-120);
            var platformDecision = getRandom(0, 10);
            var enemyDecision = getRandom(0, 20);
            var powerUpDecision = getRandom(0, 8);
            var collectibleDecision = getRandom(0, 10);
            var lastSolidPlatform = false;
            if (platformDecision == 0){
              makeMovingPlaforms(lastX, lastY);
            }
            else if (platformDecision == 1){
              makeDroppingPlaforms(lastX, lastY); 
            }
            else if (platformDecision == 2){
              makeSolidPlaforms(lastX, lastY);
              makeSolidPlaforms((lastX +30), lastY);
              makeSolidPlaforms(lastX + getRandom(-20, 20), lastY + getRandom(-40, 40));
              lastSolidPlatform = true;
            }
            else if (platformDecision == 3){
              makeSolidPlaforms(lastX, lastY);
              makeSolidPlaforms(lastX + getRandom(-20, 20), lastY + getRandom(-40, 40));
              makeSolidPlaforms(lastX + getRandom(-20, 20), lastY + getRandom(-40, 40));
              lastSolidPlatform = true;
            }
            else{
              makeSolidPlaforms(lastX, lastY);
              makeSolidPlaforms(lastX + getRandom(-20, 20), lastY + getRandom(-80, 80));
              lastSolidPlatform = true;
            }
            if (enemyDecision == 0 && lastSolidPlatform){
              basicEnemyList[basicEnemyNumbs] = enemy_basic.create(lastX+20, lastY-50, "basicEnemy").setOrigin(0,0).setScale(1);
              basicEnemyList[basicEnemyNumbs].setImmovable(true);
              lastSolidPlatform = false;
              basicEnemyNumbs ++;

            }
            if (powerUpDecision == 0 && lastSolidPlatform && enemyDecision != 0){
              jumpPowerUpList[jumpPowerUpNumbs] = jumpPowerUp.create(lastX+20, lastY-21, "burgerPowerUp").setOrigin(0,0).setScale(1);
              jumpPowerUpList[jumpPowerUpNumbs].body.checkCollision.down = false;
              jumpPowerUpList[jumpPowerUpNumbs].body.checkCollision.left = false;
              jumpPowerUpList[jumpPowerUpNumbs].body.checkCollision.right = false;
              jumpPowerUpList[jumpPowerUpNumbs].setImmovable(true);

              lastSolidPlatform = false;
              jumpPowerUpNumbs ++;

            }
            if (collectibleDecision == 0 && lastSolidPlatform){
              collectibleList[collectibleNumbs] = dollarCollectible.create(getRandomPosition(30, 250), getRandomPosition(lastY-20, lastY-120), 'dollarCollectible').setOrigin(0,0).setScale(1);
              collectibleList[collectibleNumbs].setImmovable(true);

              lastSolidPlatform = false;
              collectibleNumbs ++;


          }
          
      }
      stageTracker++;
      highestYPos = lastY;
    }

    if (collectibleCollected){
      collectibleTextList[collectibleTextNumbs] = this.add.text(player.body.position.x, player.body.position.y, '+500', { fontSize: '32px'});
      collectibleCollected = false;
      collectibleTextNumbs ++;
    }



  
  }
}



// Random number generator function

function getRandomPosition(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max){
  var value = Math.floor(Math.random() * (max - min) + min);
  return value;
}


// Platform creation
// Solid Platform: No movement, safe
// Moving Platforms: Moving from left to right, safe
// Dropping Platforms: No movement, drop down with player when touched

function makeSolidPlaforms(x, y){
  solidPlatformList[solidPlatformNumbs] = solidPlatforms.create(lastX, lastY, "solidPlatform").setOrigin(0,0).setScale(1.5).refreshBody();
  solidPlatformList[solidPlatformNumbs].setImmovable(true);
  solidPlatformList[solidPlatformNumbs].body.moves = false;
  solidPlatformList[solidPlatformNumbs].body.checkCollision.down = false;
  solidPlatformList[solidPlatformNumbs].body.checkCollision.left = false;
  solidPlatformList[solidPlatformNumbs].body.checkCollision.right = false;
  solidPlatformNumbs++;
}

function makeMovingPlaforms(x, y){

  movingPlatformList[movingPlatformNumbs] = movingPlatforms.create(lastX, lastY, "movingPlatform").setOrigin(0,0).setScale(1.5).refreshBody();
  movingPlatformList[movingPlatformNumbs].body.checkCollision.down = false;
  movingPlatformList[movingPlatformNumbs].body.checkCollision.left = false;
  movingPlatformList[movingPlatformNumbs].body.checkCollision.right = false;
  movingPlatformList[movingPlatformNumbs].setImmovable(true);
  movingPlatformNumbs++;
}

function makeDroppingPlaforms(x, y){

  droppingPlatformList[droppingPlatformNumbs] = droppingPlatforms.create(lastX, lastY, "droppingPlatform").setOrigin(0,0).setScale(1.5).refreshBody();
  droppingPlatformList[droppingPlatformNumbs].body.checkCollision.down = false;
  droppingPlatformList[droppingPlatformNumbs].body.checkCollision.left = false;
  droppingPlatformList[droppingPlatformNumbs].body.checkCollision.right = false;
  droppingPlatformNumbs++;
}

function killPlayer(){
  gameOver = true;
  player.setImmovable(true);
  player.body.moves = false;
  player.setTint(0xff0000);
}

function dropPlayer(){
  touchingDrop = true;
}

function superJumpPlayer(player_character, powerUp){
  powerUp.destroy();
  player.body.setVelocityY(-1200);
}

function increaseScore(player_character, collectibleItem){
  collectibleItem.destroy();
  scoreBonus = scoreBonus + 500;
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

function restartGame(){

  player.setPosition(playerStartPositionX, playerStartPositionY);
  player.setImmovable(false);
  player.body.moves = true;
  player.clearTint();
  player.setVelocityY(-650);


  gameOver = false;
  highestReachedDistance = 0;
  lastY = playerStartPositionY;
  firstTime = true;
  endScreenCountdown = 0;
  gameOverTextCalled = false;
  stageTracker = 1;
  scoreBonus = 0;
  highestPlayerBodyPosition = playerStartPositionY

  for (let i = 0; i < solidPlatformNumbs; i++) {
    solidPlatformList[i].destroy();
  }
  solidPlatformNumbs = 0;
  
  for (let i = 0; i < droppingPlatformNumbs; i++) {
    droppingPlatformList[i].destroy();
  }
  droppingPlatformNumbs = 0;

  for (let i = 0; i < movingPlatformNumbs; i++) {
    movingPlatformList[i].destroy();
  }
  movingPlatformNumbs = 0;

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

  for (let i = 0; i < collectibleTextNumbs; i++) {
    collectibleTextList[i].destroy();
  }
  collectibleTextNumbs = 0;
  
}

// Phaser config 

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    phaserGame: Phaser.Game;
    config: Phaser.Types.Core.GameConfig;

    
    constructor() {
      var baseWidth;
      var baseHeight;
      var maxWidth = window.innerWidth;
      var maxHeight = window.innerHeight;
      var ratioWidth = maxWidth / CONFIG.DEFAULT_WIDTH;
      var ratioHeight = maxHeight / CONFIG.DEFAULT_HEIGHT;
      

      if (ratioHeight < ratioWidth) {
        baseWidth = ratioHeight*CONFIG.DEFAULT_WIDTH;
        baseHeight = ratioHeight*CONFIG.DEFAULT_HEIGHT;
      }
      else{
        baseWidth = ratioWidth*CONFIG.DEFAULT_WIDTH;
        baseHeight = ratioWidth*CONFIG.DEFAULT_HEIGHT;
      }
      this.config = {
            type: Phaser.CANVAS,
            backgroundColor: '#8bcbfc',
            physics: {
                default: 'arcade',
                arcade:{
                  gravity: { y:300},
                  debug: false
                }
            },
            scale:{
              mode: Phaser.Scale.FIT,
              autoCenter: Phaser.Scale.CENTER_BOTH,
              width: CONFIG.DEFAULT_WIDTH,
              height: CONFIG.DEFAULT_HEIGHT,
              min: {
                width: baseWidth,
                height:  baseHeight
              },
              max: {
                width: 0,
                height: 0
              },
              parent: 'game',

            }, 
            scene: [StartScene, GameScene, PauseScene, UIScene, GameOverScene],
        };
    }
    ngOnInit(): void {
        this.phaserGame = new Phaser.Game(this.config);
    }
    }