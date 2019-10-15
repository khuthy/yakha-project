import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { OneSignal } from '@ionic-native/onesignal';

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
  dbIncoming = firebase.firestore().collection('Respond');
  dbProfile = firebase.firestore().collection('Users');
  slidesPerView : number = 1;
  messages = [];
  incomingRes=[];
  qDoc;
  honwerUID;
  hownerName;
  homebuilder: boolean; //testing if the css is working
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
      private fileOpener: FileOpener,
      public elementref: ElementRef,
      public renderer: Renderer2,
      public authServes: AuthServiceProvider,
      public oneSignal: OneSignal
      ) {
    this.dbMessage.where('hOwnerUid','==', firebase.auth().currentUser.uid).onSnapshot((res)=>{
      res.forEach((doc)=>{ 
        if(doc.data().viewed==false){
           this.dbIncoming.doc(doc.id).update({viewed: true})
        }
        this.dbIncoming.doc(doc.id).onSnapshot((info)=>{
          // this.qDoc = doc.id;
          // console.log(this.messages);
         // this.qDoc = info.data().pdfLink;
           //this.honwerUID = doc.data().uid;
         //  console.log(doc.data().hOwnerUid);
           this.dbProfile.doc(doc.data().builderUID).onSnapshot((builderData)=>{
           this.dbProfile.doc(doc.data().hOwnerUid).onSnapshot((res)=>{
             let msgData = {incoming:info.data(),incomingID: info.id, sent:doc.data(), user:res.data(), builder: builderData.data()}
             this.messages.push(msgData);
            // this.hownerName = ;
           //  console.log(this.messages);
           })
           })
           })
      })
    })
  }
  acceptQoute(data, uid){
    console.log('doc id.................', data);
    
    this.dbMessage.doc(data).update({msgStatus:true}).then((res)=>{
      console.log('Updated document results',res);
     this.dbProfile.doc(uid).onSnapshot((msg)=>{
      var notificationObj = {
        contents: { en: "Hey " + msg.data().fullName+" ," + "your qoutation response has been accepted"},
        include_player_ids: [msg.data().tokenID],
      };
      this.oneSignal.postNotification(notificationObj).then(res => {
        // console.log('After push notifcation sent: ' +res);
        
       });
     }) 
    });
  }
  declineQoute(data,uid){
    console.log('data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data);
    
    this.dbMessage.doc(data).delete().then((res)=>{
      console.log('Deleted document results',res); 
      this.dbProfile.doc(uid).onSnapshot((msg)=>{
        var notificationObj = {
          contents: { en: "Hey " + msg.data().fullName+" ," + "your qoutation response has been declined"},
          include_player_ids: [msg.data().tokenID],
        };
        this.oneSignal.postNotification(notificationObj).then(res => {
          // console.log('After push notifcation sent: ' +res);
          
         });
       }) 
    });
  }
  ionViewDidLoad() {
    this.homebuilder = this.authServes.manageUsers(); //testing if the css is working
  }
    
  downloadPDF(file){
    this.fileOpener.open(file, 'application/pdf')
    .then(() => console.log('File is opened'))
    .catch(e => console.log('Error opening file', e)); 
   // console.log(file);
    
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
