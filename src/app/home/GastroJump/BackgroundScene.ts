import { Global } from './global'
import CONFIG from 'src/app/home/GastroJump/config'

var gameWidth = CONFIG.DEFAULT_WIDTH;
var gameHeight = CONFIG.DEFAULT_HEIGHT;
var backgroundImage; 
var camera;
var lastPositionY = 0;
var stage1reached = false;
var stage2reached = false;
var stage3reached = false;
var stage4reached = false;



export class BackgroundScene extends Phaser.Scene {
      constructor(config) {
        super("BackgroundScene");
      }
    preload(){

        // Background
        this.load.image('stage0Background', 'assets/backgroundScene/backgroundTextures/stage_0_background.png');
        this.load.image('stage1Background', 'assets/backgroundScene/backgroundTextures/stage_1_background.png');
        this.load.image('stage2Background', 'assets/backgroundScene/backgroundTextures/stage_2_background.png');
        this.load.image('stage3Background', 'assets/backgroundScene/backgroundTextures/stage_3_background.png');
        this.load.image('stage4Background', 'assets/backgroundScene/backgroundTextures/stage_4_background.png');
      }
    create(){
        backgroundImage = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'stage0Background').setOrigin(0,0);
      }
    update(){  
        if (Global.highestReachedDistance < CONFIG.STAGE_1_START){
            backgroundImage.setTexture('stage0Background');
            stage1reached = false;
            stage2reached = false;
            stage3reached = false;
            stage4reached = false;
            
        }
        if (Global.highestReachedDistance >= CONFIG.STAGE_1_START && !stage1reached){
            backgroundImage.setTexture('stage1Background');
            stage1reached = true;
        }
        if (Global.highestReachedDistance >= CONFIG.STAGE_2_START && !stage2reached){
            backgroundImage.setTexture('stage2Background');
            stage2reached = true;
        }
        if (Global.highestReachedDistance >= CONFIG.STAGE_3_START && !stage3reached){
            backgroundImage.setTexture('stage3Background');
            stage3reached = true;
        }
        if (Global.highestReachedDistance >= CONFIG.STAGE_4_START && !stage4reached){
            backgroundImage.setTexture('stage4Background')
            stage4reached = true;
        }
        
        
        // Background Creation
    
      }
    }