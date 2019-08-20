import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuilderProfileviewPage } from './builder-profileview';

@NgModule({
  declarations: [
    BuilderProfileviewPage,
  ],
  imports: [
    IonicPageModule.forChild(BuilderProfileviewPage),
  ],
})
export class BuilderProfileviewPageModule {}
