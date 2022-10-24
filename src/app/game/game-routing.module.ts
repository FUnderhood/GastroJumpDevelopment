import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamePage } from './game.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: GamePage,
    children: [
      {
        path:"lobby",
        loadChildren: () => import('./lobby/lobby.module').then( m => m.LobbyPageModule)
      },
      {
        path: 'create-game',
        loadChildren: () => import('./create-game/create-game.module').then( m => m.CreateGamePageModule)
      },
      {
        path: 'waiting-room',
        loadChildren: () => import('./waiting-room/waiting-room.module').then( m => m.WaitingRoomPageModule)
      },
      {
        path:'',
        redirectTo: '/game/tabs/lobby',
        pathMatch: 'full'
      }
    ]
  },
  {
    path:'',
    redirectTo: '/game/tabs/lobby',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamePageRoutingModule {}
