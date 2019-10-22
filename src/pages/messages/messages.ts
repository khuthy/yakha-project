import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Slides } from 'ionic-angular';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { OneSignal } from '@ionic-native/onesignal';
import { PopoverPage } from '../popover/popover';
import { CallNumber } from '@ionic-native/call-number';

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
  db = firebase.firestore();
  @ViewChild('slides') slides: Slides;
  dbMessage = firebase.firestore().collection('Request');
  dbIncoming = firebase.firestore().collection('Respond');
  dbProfile = firebase.firestore().collection('Users');
  dbFeed = firebase.firestore().collection('Feedback');
  dbChat = firebase.firestore().collection('chat_msg');
  dbChatting = firebase.firestore().collection('chatting');
  uid = firebase.auth().currentUser.uid;
  hideRev;
  slidesPerView: number = 1;
  messages = [];
  incomingRes = [];
  qDoc;
  honwerUID;
  hownerName;
  homebuilder: boolean; //testing if the css is working
  icon = 'arrow-dropdown';
  toggle = false;
  msg: any;
  /* testing */
  autoUid: any;
  homeOwner: any;
  homeDetails: any;
  homeUid;
  projectRequirement = {
    brickType: '',
    wallType: '',
    date: '',
    comment: '',
    startDate: '',
    endDate: '',

    extras: []

  }
  imageBuilder;
  personalNumber ='';
  builderName = '';
  msgSent = [];
  builder = [];
  footer: boolean;
  chatMessage: string;
  myMsg = '';
  manageUser: boolean;
  chatting = [];
  msgRespond = [];
  //imageBuilder;
  currentUid = '';
  chat: number = Date.now();
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fileOpener: FileOpener,
    public elementref: ElementRef,
    public renderer: Renderer2,
    public authServes: AuthServiceProvider,
    public oneSignal: OneSignal,
    public popoverCtrl: PopoverController,
    private callNumber: CallNumber
  ) {
    this.autoUid = this.navParams.data;
    console.log('DATA=>', this.autoUid, '', this.autoUid.img);
    this.builderName = this.autoUid.name;
    this.imageBuilder = this.autoUid.img;
    this. personalNumber = this.autoUid. personalNumber;

  }

  open() {
    if (this.toggle == true) {
      this.toggle = false;
      this.icon = 'ios-arrow-down';
      this.footer = false;
    } else {
      this.icon = 'ios-arrow-up';
      this.toggle = true;
      this.footer = true;
    }

  }
  /* Tesing if chats works */
  chats = [];
slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.currentUid = this.msgSent[currentIndex].id;
   // let curr = this.messages[currentIndex];
    this.dbChatting.doc(this.uid).collection(this.navParams.data.name.builderUID).where('id','==',this.msgSent[currentIndex].id).orderBy('date').onSnapshot((res) => {
      this.messages=[];
      for (let i = 0; i < res.docs.length; i++) {
        this.messages.push(res.docs[i].data())
      }
      console.log('Message...', this.messages);
      
    })
  }


  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.currentUid = this.msgSent[currentIndex].id;
   // let curr = this.messages[currentIndex];
    this.dbChatting.doc(this.uid).collection(this.navParams.data.name.builderUID).where('id','==',this.msgSent[currentIndex].id).orderBy('date').onSnapshot((res) => {
      this.messages=[];
      for (let i = 0; i < res.docs.length; i++) {
        this.messages.push(res.docs[i].data())
      }
    //  console.log('Message...', this.messages);
      
    })
  }


  /* Ends here */
  acceptQoute(data, uid) {
    //  console.log('doc id.................', data);

    this.dbIncoming.doc(data).update({ msgStatus: "Accepted" }).then((res) => {
      document.getElementById('accept').style.display = "none";
      // this.messages = [];
      //  console.log('Updated document results',res);
      this.dbProfile.doc(uid).onSnapshot((msg) => {
        var notificationObj = {
          contents: { en: "Hey " + msg.data().fullName + " ," + "your qoutation response has been accepted" },
          include_player_ids: [msg.data().tokenID],
        };
        this.oneSignal.postNotification(notificationObj).then(res => {
          // console.log('After push notifcation sent: ' +res);

        });
      })
    });
  }
  declineQoute(data, uid) {
    //console.log('data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data);

    this.dbIncoming.doc(data).update({ msgStatus: "Declined" }).then((res) => {
      // this.messages = [];
      // console.log('Declined document results',res) 
      this.dbProfile.doc(uid).onSnapshot((msg) => {
        var notificationObj = {
          contents: { en: "Hey " + msg.data().fullName + " ," + "your qoutation response has been declined" },
          include_player_ids: [msg.data().tokenID],
        };
        this.oneSignal.postNotification(notificationObj).then(res => {
          // console.log('After push notifcation sent: ' +res);

        });
      })
    });
  }
  ionViewDidLoad() {
    //get Requests
    this.dbIncoming.where('builderUID','==',this.uid).onSnapshot((res)=>{
      res.forEach((doc)=>{
        console.log('Response....', doc.data());
        
      })
    })
    this.dbMessage.where('hOwnerUid','==',this.uid).onSnapshot((res) => {
      // console.log('This doc ', doc.data());
      res.forEach((doc) => {
        this.msgSent.push({data:doc.data(), id: doc.id})
      })

    })
  
  }
  brick = 'Engineering brick' //demo
  getChats() {
    this.dbChatting.doc(this.uid).collection(this.navParams.data.name.builderUID).add({ chat: this.chatMessage, date: Date(), builder: false, id: this.currentUid }).then((res) => {
      res.onSnapshot((doc) => {
        this.chatMessage = '';
        this.myMsg = doc.data().chat
        //  console.log('This is what I sent now...', doc.data());
        //  this.chatMessage = doc.data().chat
      })
    })
  }
  presentPopover(uid) {
    const popover = this.popoverCtrl.create(PopoverPage, { key1: uid });
    popover.present();
  }
  downloadPDF(file) {
    this.fileOpener.open(file, 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    // console.log(file);

  }
  getProfileImageStyle() {
    return 'url(' + this.imageBuilder + ')';
  }
  callJoint(personalNumber) {
    console.log(personalNumber);
    
    // this.callNumber.callNumber(personalNumber, true);
  }


  // viewMessages() {
  //   this.navCtrl.push(ViewmessagePage);
  // }
  itemSelected(item) {
    this.navCtrl.push(ViewmessagePage, item);
  }
  userProfile() {

    console.log(this.hownerName);
  }

}
