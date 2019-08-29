import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { state, trigger, style, transition, animate } from '@angular/animations';
import * as firebase from 'firebase';


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
  db = firebase.firestore();
  request =[];
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
    this.getRequest();
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
  getRequest(){
    this.db.collection('HomeOwnerQuotation').get().then(snapshot => {
      this.request = [];
      snapshot.forEach(doc => {
        this.request.push(doc.data());
      });
      console.log('Requests: ', this.request);
    
    });
  }

}
