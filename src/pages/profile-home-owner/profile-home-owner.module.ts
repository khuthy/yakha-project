import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileHomeOwnerPage } from './profile-home-owner';

@NgModule({
  declarations: [
    ProfileHomeOwnerPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileHomeOwnerPage),
  ],
})
export class ProfileHomeOwnerPageModule {}
