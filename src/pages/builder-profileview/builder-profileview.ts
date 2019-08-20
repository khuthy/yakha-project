import { QuotationFormPage } from './../quotation-form/quotation-form';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BuilderProfileviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-builder-profileview',
  templateUrl: 'builder-profileview.html',
})
export class BuilderProfileviewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuilderProfileviewPage');
  }
next(){
  this.navCtrl.push(QuotationFormPage);
}
}
