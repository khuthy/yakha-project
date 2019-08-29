import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { state, trigger, style, transition, animate } from '@angular/animations';


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
  animations: [
    trigger('slideDown', [
      state('visible', style({height: 'auto'})),
      state('invisible', style({height: 0, padding: '0%', overflow: 'hidden'})),
      transition('* => *', animate('.4s'))
    ]),
    
  ]
})
export class ViewmessagePage {
  messages = {
    active: false,
    inactive: true
  }
  more = false;

  stateSlideDown = 'visible'

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewmessagePage');
  }
  togglePanel(){
    this.stateSlideDown = (this.stateSlideDown == 'visible') ? 'invisible' : 'visible';
    
   
  }
  showMore(){
    this.more = !this.more;
  }

  quotesForm() {
    this.navCtrl.push(BuilderquotesPage);
  }

}
