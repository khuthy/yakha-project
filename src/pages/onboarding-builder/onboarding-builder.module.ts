import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingBuilderPage } from './onboarding-builder';

@NgModule({
  declarations: [
    OnboardingBuilderPage,
  ],
  imports: [
    IonicPageModule.forChild(OnboardingBuilderPage),
  ],
})
export class OnboardingBuilderPageModule {}
