import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  readonly NICKNAME = "You are fail to enter your Nickname";
  readonly GENDER = "Please choose your Gender";

  games = new Array();

  gameName: string;
  gameRoutingName: string;
  gameId: string;
  nickname: string;
  gender: string;

  constructor(private toastCtrl: ToastController) { }

  resetData(){
    this.gameName = "";
    this.gameRoutingName = "";
    this.gameId = "";
    this.nickname = "";
    this.gender = ""
  }

  createGame(gameName: string, nickname: string, gender: string){
    var gameId = new Date().getTime().toString() + Math.floor(Math.random());

    this.games.push({
      "gamename" : this.gameName,
      "nickname" : nickname,
      "gender" : gender,
      "id": gameId
    })
  }

  generateToast(message: string){
    this.presentToast(message);
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: "light",
      cssClass: "toast",
    });
    toast.present();
  }



}
