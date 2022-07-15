import { Global } from './global'
import CONFIG from 'src/app/home/GastroJump/config'

var gameWidth = CONFIG.DEFAULT_WIDTH;
var gameHeight = CONFIG.DEFAULT_HEIGHT;

export class LeaderboardScene extends Phaser.Scene {
      constructor(config) {
        super("LeaderboardScene");
      }
    preload(){
        this.load.image('titleScores', 'assets/leaderboardScene/title_scores.png')
        this.load.image('buttonBack', 'assets/leaderboardScene/button_back.png')
        this.load.image('placeholder', 'assets/placeholder.png')
      }
    create(){
        var placeholder = this.add.sprite(0, 0, 'placeholder').setOrigin(0,0).setInteractive();

        var titleScores = this.add.sprite(0, -20, 'titleScores').setOrigin(0,0);
        var buttonBack = this.add.sprite(0, 760, 'buttonBack').setOrigin(0,0).setInteractive();

        buttonBack.on('pointerup', function (pointer){
            this.scene.pause();
            this.scene.setVisible(false);
  
            this.scene.run('StartScene');
            this.scene.get('StartScene').scene.setVisible(true);
          }, this);  
      }
    update(){        
      }
    }