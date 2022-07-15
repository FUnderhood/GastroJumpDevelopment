import { Global } from './global'
import CONFIG from 'src/app/home/GastroJump/config'

var gameWidth = CONFIG.DEFAULT_WIDTH;
var gameHeight = CONFIG.DEFAULT_HEIGHT;

export class StartScene extends Phaser.Scene {
  constructor(config) {
      super("StartScene");
  }

  preload(){
    this.load.image('titleGastroJump', 'assets/startScene/title_gastro_jump.png')
    this.load.image('buttonPlay', 'assets/startScene/button_play.png')
    this.load.image('buttonPractice', 'assets/startScene/button_practice.png')
    this.load.image('buttonScore', 'assets/startScene/button_score.png')
    this.load.image('buttonSettings', 'assets/startScene/button_settings.png')
    this.load.image('iconInfo', 'assets/startScene/icon_info.png')
  }

  create(){
    this.scene.launch('BackgroundScene')
    this.scene.sendToBack('BackgroundScene');
    this.scene.launch('GameScene');
    this.scene.bringToTop();

    var titleGastroJump = this.add.sprite(0, -20, 'titleGastroJump').setOrigin(0,0);
    var buttonPlay = this.add.sprite(0, 260, 'buttonPlay').setOrigin(0,0).setInteractive();
    var buttonPractice = this.add.sprite(0, 360, 'buttonPractice').setOrigin(0,0).setInteractive();
    var buttonScore = this.add.sprite(0, 460, 'buttonScore').setOrigin(0,0).setInteractive();
    var buttonSettings = this.add.sprite(0, 560, 'buttonSettings').setOrigin(0,0).setInteractive();
    var iconInfo = this.add.sprite(335, 800, 'iconInfo').setOrigin(0,0).setInteractive().setScale(0.7);
    iconInfo.alpha = 0.6; 

    buttonPlay.on('pointerup', function (pointer){
      this.scene.pause();
      this.scene.setVisible(false).setActive(false);
      Global.startGameScene = true;
      this.scene.run('UIScene');
      this.scene.get('UIScene').scene.bringToTop();
    }, this);

    buttonPractice.on('pointerup', function (pointer){
      this.scene.pause();
      this.scene.setVisible(false).setActive(false);
      Global.startGameScene = true;
      this.scene.run('UIScene');
      this.scene.get('UIScene').scene.bringToTop();
    }, this);

    buttonScore.on('pointerup', function (pointer){
      this.scene.pause();
      this.scene.setVisible(false);

      this.scene.run('LeaderboardScene');
      this.scene.get('LeaderboardScene').scene.setVisible(true);
    }, this);

    buttonSettings.on('pointerup', function (pointer){
      this.scene.pause();
      this.scene.setVisible(false);

      this.scene.run('SettingsScene');
      this.scene.get('SettingsScene').scene.setVisible(true);
    }, this);

    iconInfo.on('pointerup', function (pointer){
      this.scene.pause();
      this.scene.setVisible(false);

      this.scene.run('InfoScene');
      this.scene.get('InfoScene').scene.setVisible(true);
    }, this);
  }
}