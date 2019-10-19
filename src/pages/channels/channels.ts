import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesPage } from '../messages/messages';
import * as firebase from 'firebase'


@IonicPage()
@Component({
  selector: 'page-channels',
  templateUrl: 'channels.html',
})
export class ChannelsPage {
  dbRequest = firebase.firestore().collection('Request');
  dbUser = firebase.firestore().collection('Users');
  dbChat = firebase.firestore().collection('chat_msg');
  uid = firebase.auth().currentUser.uid;
  dat = {} as builderProfile;
  builder;
  respond = [];
  user;
  docID;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.dbRequest.doc(this.uid).onSnapshot((res) => {


      this.dbChat.doc(this.uid).collection(res.data().builderUID).onSnapshot((result) => {
        for (let i = 0; i < result.docs.length; i++) {
          this.dbUser.doc(res.data().builderUID).onSnapshot((userDoc) => {
            this.respond.push({ id: result.docs[i].id, data: result.docs[i].data(), user: userDoc.data() })
          })
        }
      })
    })
    console.log('Info>>>>>>', this.respond);
  }
  gotoMessages(id, name, img) {
    this.navCtrl.push(MessagesPage, { id, name, img });
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
