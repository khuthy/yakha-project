import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
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
  getowners = {
    image: '',
    fullName: ''
  };
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.imageBuilder = this.navParams.data.img;
    console.log('Nav params', this.navParams.data);
    this.messages = [];
   
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad TestPage', docID: , uid:);
     setTimeout(() => {
      this.getOwnerDetails();
     }, 3000);
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
  getOwnerDetails() {
    firebase.firestore().collection('Users').doc(this.navParams.data.uid).get().then(owners => {
       this.getowners.image = owners.data().image;
      this.getowners.fullName = owners.data().fullName;
    })
  }
  getProfileImageStyle() {
    return 'url(' + this.getowners.image + ')'
  }

  createQuotes(){
    this.navCtrl.push(BuilderquotesPage);
  }
}
