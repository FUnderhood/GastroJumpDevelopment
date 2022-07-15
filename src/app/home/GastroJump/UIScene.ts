import { Global } from './global'
import CONFIG from 'src/app/home/GastroJump/config'
import { loadFont } from 'src/app/home/GastroJump/global'



var scoreText;
var pauseButton;
var gameWidth = CONFIG.DEFAULT_WIDTH;
var gameHeight = CONFIG.DEFAULT_HEIGHT;

export class UIScene extends Phaser.Scene {

    constructor(config) {
      super("UIScene");
    }

    preload(){
      this.load.image('pauseIcon', 'assets/uiScene/pause_icon.png');  
      loadFont('wendyOne', 'assets/fonts/wendyOne.ttf');

    }

    create(){
      this.scene.bringToTop();
  
      scoreText = this.add.text(20, 35, '0',  { fontFamily: 'wendyOne', fontSize: '30px' });
      pauseButton = this.add.sprite(320, 20, 'pauseIcon').setOrigin(0,0).setInteractive().setScale(0.4);
  
      // Game Pausing and Resuming
      var runningGameScene = this.scene.get("GameScene");
      var pausingGameScene = this.scene.get("PauseScene");
  
      pauseButton.on('pointerdown', function (pointer){
        if (!Global.paused){
          runningGameScene.scene.pause();
          this.scene.run('PauseScene');
          this.scene.setVisible(false);
          pausingGameScene.scene.setActive(true).setVisible(true);
          pausingGameScene.scene.bringToTop();
          Global.paused = true;
        }

      }, this);
  
    }
    update(){
      scoreText.setText((Global.highestReachedDistance));
    }
  }