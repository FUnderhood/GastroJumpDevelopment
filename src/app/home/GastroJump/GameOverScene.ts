import { Global } from './global'
import CONFIG from 'src/app/home/GastroJump/config'
import { restartGame } from 'src/app/home/GastroJump/GameScene'
import { loadFont } from 'src/app/home/GastroJump/global'



export class GameOverScene extends Phaser.Scene {
    constructor(config) {
      super("GameOverScene");
    }

    preload(){
        this.load.image('blackScreen', 'assets/gameObjects/black_screen.png');
        this.load.image('redo', 'assets/gameObjects/redo.png');
        this.load.image('gameOver', 'assets/gameObjects/game_over.png');
        this.load.image('titleGameOver', 'assets/gameOverScene/title_game_over.png')
        this.load.image('buttonRetry', 'assets/gameOverScene/button_retry.png')
        this.load.image('buttonBackToStart', 'assets/gameOverScene/button_back_to_start.png')
        this.load.image('backgroundGray', 'assets/gameOverScene/background_gray.png')
        this.load.image('textScoreElements', 'assets/gameOverScene/text_score_elements.png')
        loadFont('wendyOne', 'assets/fonts/wendyOne.ttf');

    }

    create(){
        var backgroundGray = this.add.sprite(0, 0, 'backgroundGray').setOrigin(0,0);
        var titleSettings = this.add.sprite(0, 30, 'titleGameOver').setOrigin(0,0);
        var buttonRetry = this.add.sprite(117, 570, 'buttonRetry').setOrigin(0,0).setInteractive();
        var buttonBackToStart = this.add.sprite(0, 710, 'buttonBackToStart').setOrigin(0,0).setInteractive();
        var textScoreElements = this.add.sprite(40, 260, 'textScoreElements').setOrigin(0,0);

    
        this.scene.setActive(true).setVisible(true);
        this.scene.bringToTop();

        
        var scoreHighestReachedDistance = this.add.text(220, 262, Global.highestReachedDistance.toString() , { fontFamily: 'wendyOne', fontSize: '40px' });
        var scoreScoreBonus = this.add.text(220, 366, Global.scoreBonus.toString() , { fontFamily: 'wendyOne', fontSize: '40px' });
        var scoreTotal = this.add.text(220, 464, (Global.highestReachedDistance + Global.scoreBonus).toString() , { fontFamily: 'wendyOne', fontSize: '40px' });
        buttonRetry.on('pointerdown', function (pointer){
            this.scene.get("UIScene").scene.setActive(true).setVisible(true);
            this.scene.setActive(false).setVisible(false);
            restartGame();
            } , this);

        buttonBackToStart.on('pointerdown', function (pointer){
            this.scene.setActive(false).setVisible(false);
            this.scene.get("UIScene").scene.setActive(true).setVisible(false);
            this.scene.run('StartScene');
            this.scene.get('StartScene').scene.setVisible(true).setActive(true);
            Global.startGameScene = false;
            restartGame();
            } , this);
    }

    update(){    
    } 
}
