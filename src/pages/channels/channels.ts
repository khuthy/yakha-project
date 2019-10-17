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
  dbRequest = firebase.firestore().collection('Request');
  dbUser = firebase.firestore().collection('Users');
  uid = firebase.auth().currentUser.uid;
  dat = {} as builderProfile;
  builder;
  respond = [];
  user;
  docID;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    /*  this.dat = this.navParams.data; */

    // console.log('Document ', this.respond);


  }

  ionViewDidLoad() {
   firebase.firestore().collectionGroup('Request').where('fullName', '==', 'ysvBbHJI9FMcHQV').onSnapshot((res)=>{
   //  console.log(res.docs);
     
   })
    this.dbRequest.where('hOwnerUid', '==', this.uid).onSnapshot((res) => {
        for (let i = 0; i < res.docs.length; i++) {
          this.dbUser.doc(res.docs[i].data().builderUID).onSnapshot((result) => {
           this.respond.push({user:result.data(), id:res.docs[i].id});
          })
        }
      })
  }
  gotoMessages(id, name, img) {
    this.navCtrl.push(MessagesPage, {id,name,img});
   // console.log(id);
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
