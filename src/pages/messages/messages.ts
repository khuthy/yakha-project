import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';

/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  dbMessage = firebase.firestore().collection('responseQuotation');
  messages = [];
  qDoc;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fileOpener: FileOpener) {
    this.dbMessage.where('hOwnerUID','==', firebase.auth().currentUser.uid).get().then((res)=>{
      res.forEach((doc)=>{
        this.messages.push(doc.data());
        this.qDoc = doc.data().doc;
      })
    }).catch((error)=>{
      console.log(error.code + 'Message='+error.message);
      
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }
  downloadPDF(){
    this.fileOpener.open(this.qDoc, 'application/pdf')
    .then(() => console.log('File is opened'))
    .catch(e => console.log('Error opening file', e));
}

  viewMessages() {
    this.navCtrl.push(ViewmessagePage);
  }
  

}
