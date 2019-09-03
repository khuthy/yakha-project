import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
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
  userDetails;
  hOwnerUID;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController) {
    this.userDetails = this.navParams.data;
    this.hOwnerUID = this.userDetails.uid;
    console.log(this.userDetails);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewmessagePage');
    this.menuCtrl.swipeEnable(true);
    this.getRequest();
  }
  togglePanel(){
    this.stateSlideDown = (this.stateSlideDown == 'visible') ? 'invisible' : 'visible';
    
   
  }
  showMore(){
    this.more = !this.more;
  }

  quotesForm() {
    this.navCtrl.push(BuilderquotesPage, this.hOwnerUID);
  }
  getRequest(){
    this.db.collection('HomeOwnerQuotation').where('builderUID', '==', firebase.auth().currentUser.uid).get().then(snapshot => {
      this.request = [];
      snapshot.forEach(doc => {
        this.request.push(doc.data());
      });
      console.log('Requests: ', this.request);
    
    });
  }

}
