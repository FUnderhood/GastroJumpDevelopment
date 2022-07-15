import { Global } from './global'
import CONFIG from 'src/app/home/GastroJump/config'

var gameWidth = CONFIG.DEFAULT_WIDTH;
var gameHeight = CONFIG.DEFAULT_HEIGHT;

export class InfoScene extends Phaser.Scene {
      constructor(config) {
        super("InfoScene");
      }
    preload(){
        this.load.image('titleAbout', 'assets/infoScene/title_about.png')
        this.load.image('buttonBack', 'assets/infoScene/button_back.png')
      }
    create(){
        var titleAbout = this.add.sprite(0, -20, 'titleAbout').setOrigin(0,0);
        var buttonBack = this.add.sprite(0, 760, 'buttonBack').setOrigin(0,0).setInteractive();
        var placeholderText = this.add.text(50, 250, "ABOUT PAGE:\nCredits\nSitePoint Link\nAnna's Twitter :)\nResources (Sounds/Fonts)\nPhaser");

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