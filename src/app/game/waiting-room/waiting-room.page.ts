import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.page.html',
  styleUrls: ['./waiting-room.page.scss'],
})
export class WaitingRoomPage implements OnInit {

  game: string;
  nickname: string;

 constructor(private gameService: GameService, private router: Router) { }

 ngOnInit() {
 }

 ionViewWillEnter(){
   this.nickname = this.gameService.nickname;
   this.game = this.gameService.gameName;
 }

 navToLobby(){
   this.router.navigateByUrl('/game/tabs/lobby');
 }

}
