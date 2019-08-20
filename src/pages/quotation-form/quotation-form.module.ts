import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuotationFormPage } from './quotation-form';

@NgModule({
  declarations: [
    QuotationFormPage,
  ],
  imports: [
    IonicPageModule.forChild(QuotationFormPage),
  ],
})
export class QuotationFormPageModule {}
