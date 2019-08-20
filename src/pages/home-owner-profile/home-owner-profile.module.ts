import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeOwnerProfilePage } from './home-owner-profile';

@NgModule({
  declarations: [
    HomeOwnerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(HomeOwnerProfilePage),
  ],
})
export class HomeOwnerProfilePageModule {}
