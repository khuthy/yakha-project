import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuotationFormPage } from './quotation-form';
import { ReactiveFormsModule } from '@angular/forms';

3

@NgModule({
  declarations: [
    QuotationFormPage,
  ],
  imports: [
    IonicPageModule.forChild(QuotationFormPage),
    ReactiveFormsModule
  ],
})
export class QuotationFormPageModule {}
