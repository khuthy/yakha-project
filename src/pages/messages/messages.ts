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

 /*  ionViewDidLoad() {
    setTimeout(()=> {
      // this.getOwners();
     let colors = ['rgba(197, 101, 66, 0.966)', '#3c7f8b', 'white', '']
      let cards = this.elementref.nativeElement.children[1].children[1].children[0].children.length;
      for(var i = 0; i < cards; i++) {
        console.log('for running');
        
       let background = i % 2;
       
       let cards = this.elementref.nativeElement.children[1].children[1].children[0].children[i];
       let randomColor = Math.floor((Math.random() * colors.length));
       if(background) {
         console.log(cards);
         
         this.renderer.setStyle(cards, 'background', colors[randomColor])
       } else {
         console.log(cards);
         this.renderer.setStyle(cards, 'background', colors[randomColor])
       }
     }
     console.log('for done');
     console.log(cards);
     }, 500)
  // console.log(this.honwerUID);
  
  } */
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
