import { Global } from './global'
import CONFIG from 'src/app/home/GastroJump/config'
import { startMusic } from 'src/app/home/GastroJump/BackgroundMusicScene'
import { stopMusic } from 'src/app/home/GastroJump/BackgroundMusicScene'

var gameWidth = CONFIG.DEFAULT_WIDTH;
var gameHeight = CONFIG.DEFAULT_HEIGHT;
var newVisit = true;
var buttonBackgroundMusic;
var buttonSoundEffects;
var buttonTouch;
var buttonMotion;

export class PauseScene extends Phaser.Scene {
      constructor(config) {
        super("PauseScene");
      }
      preload(){
        this.load.image('titlePaused', 'assets/pauseScene/title_paused.png')
        this.load.image('backgroundOrangeTransparent', 'assets/pauseScene/background_orange_transparent.png')
        this.load.image('buttonBackgroundMusic', 'assets/pauseScene/button_background_music.png')
        this.load.image('buttonBackgroundMusicOff', 'assets/pauseScene/button_background_music_off.png')
        this.load.image('buttonSoundEffects', 'assets/pauseScene/button_sound_effects.png')
        this.load.image('buttonSoundEffectsOff', 'assets/pauseScene/button_sound_effects_off.png')
        this.load.image('buttonTouch', 'assets/pauseScene/button_touch.png')
        this.load.image('buttonTouchSelected', 'assets/pauseScene/button_touch_selected.png')
        this.load.image('buttonMotion', 'assets/pauseScene/button_motion.png')
        this.load.image('buttonMotionSelected', 'assets/pauseScene/button_motion_selected.png')
        this.load.image('buttonResume', 'assets/pauseScene/button_resume.png')

      }
    create(){
        var backgroundOrangeTransparent = this.add.sprite(0, 0, 'backgroundOrangeTransparent').setOrigin(0,0);
        var titlePaused = this.add.sprite(0, -20, 'titlePaused').setOrigin(0,0);
        var buttonResume = this.add.sprite(117, 700, 'buttonResume').setOrigin(0,0).setInteractive();

        if (Global.backgroundMusic == true){
          buttonBackgroundMusic = this.add.sprite(5, 230, 'buttonBackgroundMusic').setOrigin(0,0).setInteractive();
        }
        else{
          buttonBackgroundMusic = this.add.sprite(5, 230, 'buttonBackgroundMusicOff').setOrigin(0,0).setInteractive();
        }

        if (Global.soundEffects == true){
          buttonSoundEffects = this.add.sprite(190, 230, 'buttonSoundEffects').setOrigin(0,0).setInteractive();
        }
        else{
          buttonSoundEffects = this.add.sprite(190, 230, 'buttonSoundEffectsOff').setOrigin(0,0).setInteractive();
        }

        if (Global.controlType == CONFIG.GYROSCOPE_CONTROL_TYPE){
          buttonMotion = this.add.sprite(0, 360, 'buttonMotionSelected').setOrigin(0,0).setInteractive();
          buttonTouch = this.add.sprite(0, 460, 'buttonTouch').setOrigin(0,0).setInteractive();
        }
        else if (Global.controlType == CONFIG.TOUCH_CONTROL_TYPE){
          buttonMotion = this.add.sprite(0, 360, 'buttonMotion').setOrigin(0,0).setInteractive();
          buttonTouch = this.add.sprite(0, 460, 'buttonTouchSelected').setOrigin(0,0).setInteractive();
        }
        else{
          buttonMotion = this.add.sprite(0, 360, 'buttonMotion').setOrigin(0,0).setInteractive();
          buttonTouch = this.add.sprite(0, 460, 'buttonTouch').setOrigin(0,0).setInteractive();
        }

        buttonTouch.on('pointerdown', function (pointer){
          buttonTouch.setTexture('buttonTouchSelected');
          buttonTouch.setPosition(0, 466);
          buttonMotion.setTexture('buttonMotion');
          buttonMotion.setPosition(0, 360);
          Global.controlType = CONFIG.TOUCH_CONTROL_TYPE;
        });

        buttonMotion.on('pointerdown', function (pointer){
          buttonMotion.setTexture('buttonMotionSelected');
          buttonMotion.setPosition(0, 365);
          buttonTouch.setTexture('buttonTouch');
          buttonTouch.setPosition(0, 460);
          Global.controlType = CONFIG.GYROSCOPE_CONTROL_TYPE;
        });

        buttonSoundEffects.on('pointerdown', function (pointer){
          if (Global.soundEffects){
            buttonSoundEffects.setTexture('buttonSoundEffectsOff');
            Global.soundEffects = false;
          }
          else{
            buttonSoundEffects.setTexture('buttonSoundEffects');
            Global.soundEffects = true;
          }
        });

        buttonBackgroundMusic.on('pointerdown', function (pointer){
          if (Global.backgroundMusic){
            buttonBackgroundMusic.setTexture('buttonBackgroundMusicOff');
            Global.backgroundMusic= false;
            stopMusic();
          }
          else{
            buttonBackgroundMusic.setTexture('buttonBackgroundMusic');
            Global.backgroundMusic = true;
            startMusic();
          }
        });

        buttonResume.on('pointerup', function (pointer){
          this.scene.run('GameScene');
          this.scene.get('GameScene').scene.bringToTop();
          Global.paused = false;
          newVisit = true;
          this.scene.setActive(false).setVisible(false);
          this.scene.get('UIScene').scene.setVisible(true);
          this.scene.get('UIScene').scene.bringToTop();
          this.scene.pause();
          
        }, this);
      }
    update(){
      if (newVisit){
        if (Global.backgroundMusic == true){
          buttonBackgroundMusic.setTexture('buttonBackgroundMusic');
        }
        else{
          buttonBackgroundMusic.setTexture('buttonBackgroundMusicOff');
        }
  
        if (Global.soundEffects == true){
          buttonSoundEffects.setTexture('buttonSoundEffects');
        }
        else{
          buttonSoundEffects.setTexture('buttonSoundEffectsOff');
        }
  
        if (Global.controlType == CONFIG.GYROSCOPE_CONTROL_TYPE){
          buttonMotion.setTexture('buttonMotionSelected');
          buttonTouch.setTexture('buttonTouch');
        }
        else if (Global.controlType == CONFIG.TOUCH_CONTROL_TYPE){
          buttonMotion.setTexture('buttonMotion');
          buttonTouch.setTexture('buttonTouchSelected');
        }
        else{
          buttonMotion.setTexture('buttonMotion');
          buttonTouch.setTexture('buttonTouch');
        }
        newVisit = false;
      }
        
      }
    }