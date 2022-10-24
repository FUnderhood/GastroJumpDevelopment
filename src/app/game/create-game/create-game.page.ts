import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.page.html',
  styleUrls: ['./create-game.page.scss'],
})
export class CreateGamePage implements OnInit {

  readonly MSG_FAIL = "Das Spiel konnte nicht erstellt werden";

  private nickname: string;


  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit() {
  }

  setGameId(gameId: string){
    this.gameService.gameId = gameId;

    if(this.gameService.nickname == "" || this.gameService.gender == ""){
      return false;
    }

    
  }

  sendGameCreation(game: string) {
    this.gameService.gameName = game;

    this.gameService.createGame(game, this.gameService.nickname, this.gameService.gender);
    console.log(this.gameService.games);
    this.router.navigateByUrl('/game/tabs/waiting-room');
  }

}
