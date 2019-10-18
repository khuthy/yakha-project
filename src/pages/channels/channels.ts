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
  dbChat = firebase.firestore().collection('chat_msg');
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
    this.dbRequest.where('hOwnerUid', '==', this.uid).onSnapshot((res) => {
      for (let i = 0; i < res.docs.length; i++) {
        // console.log('Info>>>>>>',);
       
        this.dbChat.doc(this.uid).collection(res.docs[i].data().builderUID).onSnapshot((result) => {
          //  result.forEach((doc) => {
         // for (let i = 0; i < result.docs.length; i++) {
            //console.log("docs found............",result.docs[i].data())  
            firebase.firestore().collection('Users').doc(result.docs[i].data().builderUID).onSnapshot((userDoc) => {
              this.respond.push({ id: result.docs[i].id, data: result.docs[i].data(), user: userDoc.data() })
            // console.log('user doc...', this.owner);
            })
        //  }
          // console.log('>>>>>>>>>>>>>>>>>>>>',result.docs );


          // })
      //    console.log('Messages from home owners...', this.owner)
         // this.owner = []
        
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
