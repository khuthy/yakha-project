import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { LocalNotifications } from '@ionic-native/local-notifications';

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

  dbMessage = firebase.firestore().collection('Request');
  dbProfile = firebase.firestore().collection('Users');
  slidesPerView : number = 1;
  messages = [];
  qDoc;
  honwerUID;
  hownerName;
  homebuilder =  true;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
      private fileOpener: FileOpener,
      public elementref: ElementRef,
      public renderer: Renderer2,
      ) {
    this.dbMessage.where('hOwnerUid','==', firebase.auth().currentUser.uid).onSnapshot((res)=>{
      res.forEach((doc)=>{
        this.messages.push(doc.data());
        this.qDoc = doc.id;
        console.log(this.messages);

        //this.honwerUID = doc.data().uid;
        console.log(doc.data().hOwnerUid);
        
        this.dbProfile.doc(doc.data().hOwnerUid).onSnapshot((res)=>{
          this.hownerName = res.data().fullName;
          console.log(this.hownerName);
          
        })
      })
    })
  }

  ionViewDidLoad() {
    
  }
    
  downloadPDF(){
    this.fileOpener.open(this.qDoc, 'application/pdf')
    .then(() => console.log('File is opened'))
    .catch(e => console.log('Error opening file', e));
}


  // viewMessages() {
  //   this.navCtrl.push(ViewmessagePage);
  // }
  itemSelected(item){
    this.navCtrl.push(ViewmessagePage, item);
  }
  userProfile(){
   
    console.log(this.hownerName);
  }

}
