import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesPage } from '../messages/messages';
import * as firebase from 'firebase'

/**
 * Generated class for the ChannelsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-channels',
  templateUrl: 'channels.html',
})
export class ChannelsPage {
  db = firebase.firestore();
  uid = firebase.auth().currentUser.uid;
  dat = {} as builderProfile;
  builder;
  respond = [];
  user;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   /*  this.dat = this.navParams.data; */
   this.db.collection('Respond').where('hOwnerUID', '==', this.uid).onSnapshot((response) => {
      response.forEach(doc => {
        this.db.collection('Users').where('uid', '==', doc.data().uid).onSnapshot((userDetails) => {
          userDetails.forEach((users) => {
            this.respond.push({user: users.data(), autoId: doc.id});
            console.log('Users doc ', users.data());
            
          })
        })
       console.log('Response doc', doc.data());
       
      });
   })
   console.log('Document ', this.respond);
   
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChannelsPage');
   
  }
  gotoMessages(autoUid) {
  this.navCtrl.push(MessagesPage , autoUid);
  console.log(autoUid);
  
  }
  

}
export interface builderProfile {
  uid: '',
  image: '',
  fullName: '',
  certified: false,
  experiences: '',
  address: '',
  price: '',
  location: '',
  roof: '',
  gender: ''
}
