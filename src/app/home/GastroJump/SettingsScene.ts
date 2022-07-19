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

export class SettingsScene extends Phaser.Scene {
      constructor(config) {
        super("SettingsScene");
      }
    preload(){
        this.load.image('titleSettings', 'assets/settingsScene/title_settings.png')
        this.load.image('buttonBack', 'assets/settingsScene/button_back.png')
        this.load.image('buttonBackgroundMusic', 'assets/settingsScene/button_background_music.png')
        this.load.image('buttonSoundEffects', 'assets/settingsScene/button_sound_effects.png')
        this.load.image('buttonBackgroundMusicOff', 'assets/settingsScene/button_background_music_off.png')
        this.load.image('buttonSoundEffectsOff', 'assets/settingsScene/button_sound_effects_off.png')
        this.load.image('buttonTouch', 'assets/settingsScene/button_touch.png')
        this.load.image('buttonTouchSelected', 'assets/settingsScene/button_touch_selected.png')
        this.load.image('buttonMotion', 'assets/settingsScene/button_motion.png')
        this.load.image('buttonMotionSelected', 'assets/settingsScene/button_motion_selected.png')
      }
    create(){
        var titleSettings = this.add.sprite(0, -20, 'titleSettings').setOrigin(0,0);
        var buttonBack = this.add.sprite(0, 760, 'buttonBack').setOrigin(0,0).setInteractive();

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

        buttonBack.on('pointerup', function (pointer){
          newVisit = true;
          this.scene.pause();
          this.scene.setVisible(false);

          this.scene.run('StartScene');
          this.scene.get('StartScene').scene.setVisible(true);
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