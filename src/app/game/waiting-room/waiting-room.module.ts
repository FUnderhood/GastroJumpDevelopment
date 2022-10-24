import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomPageRoutingModule } from './waiting-room-routing.module';

import { WaitingRoomPage } from './waiting-room.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomPageRoutingModule
  ],
  declarations: [WaitingRoomPage]
})
export class WaitingRoomPageModule {}
