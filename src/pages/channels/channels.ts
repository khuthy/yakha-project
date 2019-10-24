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
    this.dbRequest.doc(this.uid).onSnapshot((res)=>{
      this.respond = [];
        let data = {id:{}, data:{}, user:{}}
        this.dbChat.doc(this.uid).collection(res.data().builderUID).onSnapshot((result) => {
          for (let i = 0; i < result.docs.length; i++) {
            data.id = res.id;
            data.data = result.docs[i].data();
            this.dbUser.doc(res.data().builderUID).onSnapshot((userDoc) => {
              data.user = userDoc.data();
            })
          }
        })
        this.respond.push(data);
    })
  }
  gotoMessages(id, name) {
 /*  firebase.firestore().collection('Respond').doc(id).update('viewed',true).then(val=>{
}) */
    this.navCtrl.push(MessagesPage, { id, name });
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
