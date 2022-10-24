import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements OnInit {



  readonly NICKNAME = "You are fail to enter your Nickname";

  loadedGames = new Array();

  nickname: string;

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit() {
    this.loadedGames = this.gameService.games
  }

  ionViewWillEnter(){
    this.nickname = "";
    this.gameService.resetData();
    this.resetButtons();
  }

  checkUserData(){
    if(this.gameService.nickname == "" || this.gameService.gender == ""){
      return false;
    }
    return true;   
  }

  infoToGameService(game: any){
    this.gameService.nickname = this.nickname;
    this.gameService.gameName = game.gamename;
    this.gameService.gameId = game.id;
  }

  setGender(gender: string) {
    var btns = document.getElementsByClassName("genderButton");

    for(var i = 0; i < btns.length; i++){
      if(btns[i].getAttribute("id") == gender){
        btns[i].setAttribute("color","danger");
        this.gameService.gender = gender;
      }else{
        btns[i].setAttribute("color","light");
      }
    }
  }

  resetButtons(){
    this.setGender("");
  }

  navToCreateGame(){
    this.gameService.nickname = this.nickname;
    console.log(this.gameService.nickname, this.gameService.gender);

    if(!this.checkUserData()){
      this.gameService.generateToast(this.NICKNAME);
      return;
    }
    this.router.navigateByUrl('/game/tabs/create-game');
  }

  joinGame() {
    this.router.navigateByUrl('/home');
  }


}
