import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPlacesPage } from './new-places';

@NgModule({
  declarations: [
    NewPlacesPage,
  ],
  imports: [
    IonicPageModule.forChild(NewPlacesPage),
  ],
})
export class NewPlacesPageModule {}
