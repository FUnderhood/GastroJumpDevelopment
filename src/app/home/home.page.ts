import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { ControlContainer } from '@angular/forms';



// GameConfigs
var width = 393;
var height = 851;
var playerStartPositionY = 715;
var playerStartPositionX = 200;

// set control type
// 0: keybaord arrows (desktop)
// 1: touch/mouse (desktop and phone)
// 2: gyroscope (phone)

var controlType = 0;

// Tracking 

var cursors;
var lastX = 0;
var lastY = playerStartPositionY;

var stageTracker = 1;
var score = 0;
var scoreText;
var gameOverText;
var gameOverCapsText;
var highestReachedDistance = 0;
var playerPositionY;
var gameOver = false;

var movingPlatformRight = false;
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

// Player
var player;

// Power Ups
var jumpPowerUp;
var jumpPowerUpNumbs = 0;
var jumpPowerUpList = [];

// collectibles
var dollarCollectible;
var collectibleNumbs = 0;
var collectibleList = [];
var collectibleCollected = false;

// collectibleText

var collectibleTextNumbs = 0;
var collectibleTextList = [];

// Enemies
var enemy_basic;
var basicEnemyNumbs = 0;
var basicEnemyList = [];

// Game Over



// Score

var pointerLocX;

var rotationText;
var alpha = 0;
var beta = 0;
var gamma = 0;
var accelerationText;
var alpha2 = 0;
var beta2 = 0;
var gamma2 = 0;

var firstTime = true;






class GameScene extends Phaser.Scene {
    constructor(config) {
        super(config);
    }


    preload() {

      // Background
      this.load.image('background', 'assets/gameObjects/background.png')
      
      // Player
      this.load.spritesheet('dude', 'assets/gameObjects/dude.png', { frameWidth: 32, frameHeight: 48 });

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

      // Other
      this.load.image('blackScreen', 'assets/gameObjects/black_screen.png');
      this.load.image('redo', 'assets/gameObjects/redo.png');


    }

    create() {

      // Controlls

     



      // Create Level
      this.add.image(0, 0, 'background').setOrigin(0,0);

      ground = this.physics.add.staticGroup();
      ground.create(0, 811, "ground").setOrigin(0,0).setScale(2).refreshBody();

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


      
      player = this.physics.add.sprite(200, 763, 'dude').setScale(2).refreshBody();
      player.setBounce(0.2);
      player.body.setGravityY(300)
      

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


      // Create UI

      scoreText = this.add.text(16, (player.body.position.y - 680), 'Score: 0');

      rotationText = this.add.text(16, (player.body.position.y - 600), '0, 0, 0');

      accelerationText = this.add.text(16, (player.body.position.y - 520), '0, 0, 0');


      // Camera

      camera = this.cameras.main;
      camera.zoom = 1;
      camera.setBounds(0, 0, width, height);
      camera.startFollow(player);
      camera.setFollowOffset(0, 100);


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

      //console.log(this.scene);
    


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
        if (gamma <= 0 && !gameOver)  
        { 
          player.setVelocityX(-250);
          player.anims.play('left', true);
        }

      else if (gamma > 0 && !gameOver)
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
        }, this);
        this.input.on('pointerup', function (pointer) {
          pointerLocX = 0;
        }, this);
  
        if (pointerLocX <= (width/2) && pointerLocX != 0 && !gameOver)  
          { 
            player.setVelocityX(-250);
            player.anims.play('left', true);
          }
  
        else if (pointerLocX > (width/2) && pointerLocX != 0 && !gameOver)
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
      
      

      


      // Permanent Jumping

      if (player.body.touching.down && !gameOver)
        {
          if (touchingDrop && player.body.velocity.y > 0){
            player.setVelocityY(400);
            touchingDrop = false;
          }
          else{
            player.setVelocityY(-650);
          }
        }

      
      // Wraparound

      if (player.body.position.x <= -1){
        player.setPosition(383, player.body.position.y+40);
      }

      if (player.body.position.x >= 394){
        player.setPosition(35, player.body.position.y+40);
      }


      // Camera tracking

      camera.setBounds(0, (player.body.position.y - 550), width, height);

     


      // Highest Reached Distance / Highscore 

      if (highestReachedDistance < playerPositionY){
        highestReachedDistance = playerPositionY;
      }  

      // UI updating 

      scoreText.setText("Score: " + (highestReachedDistance + scoreBonus));
      scoreText.setPosition(16, (player.body.position.y - 530));
      rotationText.setText(alpha + ", " + beta +", " + gamma);
      rotationText.setPosition(16, (player.body.position.y - 500));
      accelerationText.setText(alpha2 + ", " + beta2 +", " + gamma2);
      accelerationText.setPosition(16, (player.body.position.y - 470));





      // Game Over

      if (playerPositionY <= highestReachedDistance - 500 && gameOver == false){
        killPlayer();
      }

      if (gameOver && !gameOverTextCalled){
        
        if  (endScreenCountdown > 30){
          gameOverTextCalled = true;
          black_screen = this.add.image(0, (player.body.position.y - 562), "blackScreen").setOrigin(0, 0).setScale(1.3);
          gameOverText = this.add.text(10, (player.body.position.y - 380), 'GAME OVER', { fontSize: '70px'});
          gameOverCapsText = this.add.text(80, (player.body.position.y - 280), 'Thank you \nfor playing!\n\nYou reached\na score of\n' + highestReachedDistance, { fontSize: '32px'});
          redo = this.add.sprite(120, (player.body.position.y - 40), "redo").setOrigin(0, 0).setScale(2).setInteractive();
          redo.on('pointerdown', function (pointer){
            gameOverCapsText.setActive(true).setVisible(true);
            gameOverText.setActive(true).setVisible(true);
            black_screen.setActive(true).setVisible(true);
            redo.setActive(true).setVisible(true);
            redo.setTint(0xff0000);
            console.log('redo');
            restartGame();
            
           
          });
          
        }
        endScreenCountdown++;
        
      }

      
    


      // Check for deletion

      for (let i = 0; i < solidPlatformNumbs; i++) {
        if ((highestReachedDistance-300) > (playerStartPositionY - solidPlatformList[i].y)){
          solidPlatformList[i].destroy();
        }
      }
      
      for (let i = 0; i < droppingPlatformNumbs; i++) {
        if ((highestReachedDistance-300) > (playerStartPositionY - droppingPlatformList[i].y)){
          droppingPlatformList[i].destroy();
        }
      }
      for (let i = 0; i < movingPlatformNumbs; i++) {
        if ((highestReachedDistance-300) > (playerStartPositionY - movingPlatformList[i].y)){
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
        if ((highestReachedDistance-280) > (playerStartPositionY - basicEnemyList[i].y)){
          basicEnemyList[i].destroy();
        }
      }
      for (let i = 0; i < jumpPowerUpNumbs; i++) {
        if ((highestReachedDistance-280) > (playerStartPositionY - jumpPowerUpList[i].y)){
          jumpPowerUpList[i].destroy();
        }
      }
      for (let i = 0; i < collectibleNumbs; i++) {
        if ((highestReachedDistance-280) > (playerStartPositionY - collectibleList[i].y)){
          collectibleList[i].destroy();
        }
      }
      for (let i = 0; i < collectibleTextNumbs; i++) {
        if ((highestReachedDistance-280) > (playerStartPositionY - collectibleTextList[i].y)){
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

      if ((highestReachedDistance > (1000 * stageTracker)) || firstTime){
        console.log("FirstTime" + firstTime);
        if (!firstTime){
          lastY = highestYPos;
          stageEnd = lastY - 1400;
        }
        else{
          stageEnd = -2000
          firstTime = false;
        }

        while (lastY > stageEnd){
        lastX = getRandomPosition(20, 300);
        lastY = getRandomPosition(lastY-20, lastY-80);
        var platformDecision = getRandom(0, 10);
        var enemyDecision = getRandom(0, 20);
        var powerUpDecision = getRandom(0, 15);
        var collectibleDecision = getRandom(0, 10);
        var lastSolidPlatform = false;
        if (platformDecision == 0){
          makeMovingPlaforms(lastX, lastY);
        }
        else if (platformDecision == 1){
          makeDroppingPlaforms(lastX, lastY); 
        }
        else {
          makeSolidPlaforms(lastX, lastY);
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
  console.log("Magnetometer: "
      + event.alpha + ", "
      + event.beta + ", "
      + event.gamma
  );
  alpha = event.alpha;
  beta = event.bet;
  gamma = event.gamma;
}

function motion(event){
  console.log("Accelerometer: "
    + event.accelerationIncludingGravity.x + ", "
    + event.accelerationIncludingGravity.y + ", "
    + event.accelerationIncludingGravity.z
  );
  alpha2 = event.accelerationIncludingGravity.x;
  beta2 = event.accelerationIncludingGravity.y;
  gamma2 = event.accelerationIncludingGravity.z;
}

function restartGame(){
  gameOverText.setActive(false).setVisible(false);
  black_screen.setActive(false).setVisible(false);
  redo.setActive(false).setVisible(false);
  gameOverCapsText.setActive(false).setVisible(false);

  
  
  player.setPosition(playerStartPositionX, playerStartPositionY);
  player.setImmovable(false);
  player.body.moves = true;
  player.clearTint();
  gameOver = false;
  highestReachedDistance = 0;
  lastY = playerStartPositionY;
  firstTime = true;
  endScreenCountdown = 0;
  gameOverTextCalled = false;
  stageTracker = 1;
  scoreBonus = 0;
  player.setVelocityY(-650);
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
        this.config = {
            type: Phaser.AUTO,
            width: 393,
            height: 851,
            backgroundColor: '#8bcbfc',
            physics: {
                default: 'arcade',
                arcade:{
                  gravity: { y:300},
                  debug: false
                }
            },
            parent: 'game',
            scene: GameScene
        };
    }

    ngOnInit(): void {
        this.phaserGame = new Phaser.Game(this.config);
    }

    
}

