import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BuilderquotesPage } from '../builderquotes/builderquotes';

/**
 * Generated class for the ViewmessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewmessage',
  templateUrl: 'viewmessage.html',
})
export class ViewmessagePage {
  messages = {
    active: false,
    inactive: true
  }
  more = false;

  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewmessagePage');
  }
  togglePanel(){
    
    this.messages = { 
      active: true,
      inactive: !this.messages.inactive
    }
  }
  showMore(){
    this.more = !this.more;
  }

  quotesForm() {
    this.navCtrl.push(BuilderquotesPage);
  }

}
