import { Component, OnInit } from '@angular/core';

import Phaser from 'phaser';

import { StartScene } from "src/app/home/GastroJump/StartScene"
import { UIScene } from "src/app/home/GastroJump/UIScene"
import { GameScene} from "src/app/home/GastroJump/GameScene"
import { PauseScene } from "src/app/home/GastroJump/PauseScene"
import { GameOverScene } from "src/app/home/GastroJump/GameOverScene"
import { SettingsScene } from "src/app/home/GastroJump/SettingsScene"
import { LeaderboardScene } from "src/app/home/GastroJump/LeaderboardScene"
import { InfoScene } from "src/app/home/GastroJump/InfoScene"
import { BackgroundScene } from "src/app/home/GastroJump/BackgroundScene"
import { BackgroundMusicScene } from "src/app/home/GastroJump/BackgroundMusicScene"
import CONFIG from 'src/app/home/GastroJump/config'
import { Global } from './GastroJump/global'

// Phaser config 

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
    phaserGame: Phaser.Game;
    config: Phaser.Types.Core.GameConfig;

    calculateBestRatio(){
      var ratioWidth = window.innerWidth / CONFIG.DEFAULT_WIDTH;
      var ratioHeight = window.innerHeight / CONFIG.DEFAULT_HEIGHT;
          
      if (ratioHeight < ratioWidth) {
        var baseWidth = ratioHeight*CONFIG.DEFAULT_WIDTH;
        var baseHeight = ratioHeight*CONFIG.DEFAULT_HEIGHT;
        }
      else{
        var baseWidth = ratioWidth*CONFIG.DEFAULT_WIDTH;
        var baseHeight = ratioWidth*CONFIG.DEFAULT_HEIGHT;
        }
      return [baseWidth, baseHeight];
    }
    
    constructor() {

      var baseSize = this.calculateBestRatio();
      
      this.config = {
            type: Phaser.CANVAS,
            backgroundColor: '#8bcbfc',
            pixelArt: true,
            physics: {
                default: 'arcade',
                arcade:{
                  gravity: { y: CONFIG.DEFAULT_GRAVITY},
                  debug: false
                }
            },
            scale:{
              mode: Phaser.Scale.FIT,
              autoCenter: Phaser.Scale.CENTER_BOTH,
              width: CONFIG.DEFAULT_WIDTH,
              height: CONFIG.DEFAULT_HEIGHT,
              min: {
                width: baseSize[0],
                height:  baseSize[1]
              },
              max: {
                width: 0,
                height: 0
              },
              parent: 'game',

            }, 
            scene: [StartScene, GameScene, PauseScene, UIScene, GameOverScene, SettingsScene, LeaderboardScene, InfoScene, BackgroundScene, BackgroundMusicScene],
        };
    }
    ngOnInit(): void {
        this.phaserGame = new Phaser.Game(this.config);
    }
}


