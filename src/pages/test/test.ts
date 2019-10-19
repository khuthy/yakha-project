import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  imageBuilder: string;
  dbChat = firebase.firestore().collection('chat_msg');
  uid = firebase.auth().currentUser.uid;
  chatMessage: any;
  myMsg: any;
  messages = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.imageBuilder = this.navParams.data.img;
    console.log('Nav params', this.navParams.data);
    this.messages = [];
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad TestPage', docID: , uid:);
    
    this.dbChat.doc(this.navParams.data.uid).collection(this.uid).orderBy("date").onSnapshot((res) => {
      this.messages=[];
      for (let i = 0; i < res.docs.length; i++) {
        this.messages.push(res.docs[i].data())
      }
    })
  }
  getChats() {
    this.dbChat.doc(this.navParams.data.uid).collection(this.uid).add({ chat: this.chatMessage, date: Date(), builder: true }).then((res) => {
      res.onSnapshot((doc) => {
        this.chatMessage = '';
        this.myMsg = doc.data().chat
        console.log('This is what I sent now...', doc.data());
      })

    })
  }
  getProfileImageStyle() {
    return 'url(' + this.imageBuilder + ')'
  }
}
