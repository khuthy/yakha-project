import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBricklayerPage } from './add-bricklayer';

@NgModule({
  declarations: [
    AddBricklayerPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBricklayerPage),
  ],
})
export class AddBricklayerPageModule {}
