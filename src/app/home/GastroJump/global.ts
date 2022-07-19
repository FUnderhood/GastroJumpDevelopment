import CONFIG from 'src/app/home/GastroJump/config'


export namespace Global {

  export var controlType: number = CONFIG.DEFAULT_CONTROL_TYPE;
  export var highestReachedDistance: number = 0;
  export var scoreBonus: number = 0;
  export var startGameScene: boolean = false;
  export var backgroundMusic: boolean = CONFIG.DEFAULT_BACKGROUNDMUSIC;
  export var soundEffects: boolean = CONFIG.DEFAULT_SOUNDEFFECTS;
  export var paused: boolean = false;
  export var currentBackgroundMusic;
  export var gameOver: boolean = false;

}

export function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
      (document as any).fonts.add(loaded);
  }).catch(function (error) {
      return error;
  });
}