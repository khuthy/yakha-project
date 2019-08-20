import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BaccountSetupPage } from './baccount-setup';

@NgModule({
  declarations: [
    BaccountSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(BaccountSetupPage),
  ],
})
export class BaccountSetupPageModule {}
