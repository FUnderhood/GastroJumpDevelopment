import CONFIG from 'src/app/home/GastroJump/config'


export namespace Global {

  export var controlType: number = CONFIG.DEFAULT_CONTROL_TYPE;
  export var highestReachedDistance: number = 0;
  export var scoreBonus: number = 0;
  export var startGameScene: boolean = false;
  export var backgroundMusic: boolean = true;
  export var soundEffects: boolean = true;
  export var paused: boolean = false;

}

export function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
      (document as any).fonts.add(loaded);
  }).catch(function (error) {
      return error;
  });
}