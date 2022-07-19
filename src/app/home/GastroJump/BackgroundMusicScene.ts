import { Global } from './global'
import CONFIG from 'src/app/home/GastroJump/config'
var gameOverCalled;
var currentlyRunning;
var backgroundMusicScene;



export class BackgroundMusicScene extends Phaser.Scene {
      constructor(config) {
        super("BackgroundMusicScene");
      }
    preload(){
    // Audio
      this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic/happy_theme.ogg')
      this.load.audio('gameOverMusic', 'assets/audio/backgroundMusic/sad_theme.ogg')


    
      }
    create(){
        backgroundMusicScene = this.scene.get("BackgroundMusicScene");
        Global.currentBackgroundMusic = backgroundMusicScene.sound.add('backgroundMusic', {loop: true, volume: 0});

      }
    
    update(){ 
      }
      
    }

    export function startMusic(){
        if (Global.backgroundMusic){
            backgroundMusicScene.sound.remove(Global.currentBackgroundMusic);
            if (!Global.gameOver){
                Global.currentBackgroundMusic = backgroundMusicScene.sound.add('backgroundMusic', {loop: true, volume: 0.35});
            }
            else{
                Global.currentBackgroundMusic = backgroundMusicScene.sound.add('gameOverMusic', {loop: true, volume: 0.35});
            }
            Global.currentBackgroundMusic.play();
        }
        

        

    }
    export function stopMusic(){
        backgroundMusicScene.sound.remove(Global.currentBackgroundMusic);
    }

    