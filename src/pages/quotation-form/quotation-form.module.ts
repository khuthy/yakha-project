import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuotationFormPage } from './quotation-form';

3

@NgModule({
  declarations: [
    QuotationFormPage,
  ],
  imports: [
    IonicPageModule.forChild(QuotationFormPage),
  ],
})
export class QuotationFormPageModule {}
