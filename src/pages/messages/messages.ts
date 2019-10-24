import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Slides, LoadingController } from 'ionic-angular';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { OneSignal } from '@ionic-native/onesignal';
import { PopoverPage } from '../popover/popover';
import { CallNumber } from '@ionic-native/call-number';
import { File } from '@ionic-native/file';
import pdfMake from 'pdfmake/build/pdfmake';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader';
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
  pdfObj = null;
  dbMessage = firebase.firestore().collection('Request');
  dbIncoming = firebase.firestore().collection('Respond');
  dbProfile = firebase.firestore().collection('Users');
  dbFeed = firebase.firestore().collection('Feedback');
  dbChat = firebase.firestore().collection('chat_msg');
  dbChatting = firebase.firestore().collection('chatting');
  hideCard = 'qeqw43453rwerf453efste45tergft';
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
  personalNumber = '';
  builderName = '';
  msgSent = [];
  builder = [];
  footer: boolean;
  chatMessage: string;
  myMsg = '';
  manageUser: boolean;
  chatting = [];
  msgRespond = [];
  pdf = '';
  //imageBuilder;
  currentUid = '';
  chat: number = Date.now();
  number: any;
  quoteStatus: string='';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fileOpener: FileOpener,
    public elementref: ElementRef,
    public renderer: Renderer2,
    public authServes: AuthServiceProvider,
    public oneSignal: OneSignal,
    public popoverCtrl: PopoverController,
    private callNumber: CallNumber,
    private file: File,
    private downloader: Downloader,
    public loader : LoadingController
  ) {
    this.autoUid = this.navParams.data;
    this.builderName = this.autoUid.name;
    this.imageBuilder = this.autoUid.img;
    this.personalNumber = this.autoUid.personalNumber;

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
    this.dbChatting.doc(this.uid).collection(this.navParams.data.name.builderUID).where('id', '==', this.msgSent[currentIndex].id).orderBy('date').onSnapshot((res) => {
      this.messages = [];
      for (let i = 0; i < res.docs.length; i++) {
        if (!res.docs[i].data().pdfLink) {

        }
        this.messages.push({ chat: res.docs[i].data() })
      }
     // console.log('Response data', this.messages);

    })
    this.dbIncoming.doc(this.currentUid).onSnapshot((doc)=>{
      if (doc.data().msgStatus!=="") {
       this.hideCard = '';
       this.quoteStatus = doc.data().msgStatus;
       console.log('Status............................', this.quoteStatus);
      } 
    })

  }


  /* Ends here */
  acceptQoute() {
    this.dbIncoming.doc(this.currentUid).update({ msgStatus: "Accepted" }).then((res) => {
     
      // this.messages = [];
      //  console.log('Updated document results',res);
      /* this.dbProfile.doc(uid).onSnapshot((msg) => {
        var notificationObj = {
          contents: { en: "Hey " + msg.data().fullName + " ," + "your qoutation response has been accepted" },
          include_player_ids: [msg.data().tokenID],
        };
        this.oneSignal.postNotification(notificationObj).then(res => {
          // console.log('After push notifcation sent: ' +res);

        });
      }) */
    });
  }
  declineQoute() {
  
    this.dbIncoming.doc(this.currentUid).update({ msgStatus: "Declined" }).then((res) => {
      // this.messages = [];
      // console.log('Declined document results',res) 
      /*     this.dbProfile.doc(uid).onSnapshot((msg) => {
            var notificationObj = {
              contents: { en: "Hey " + msg.data().fullName + " ," + "your qoutation response has been declined" },
              include_player_ids: [msg.data().tokenID],
            };
            this.oneSignal.postNotification(notificationObj).then(res => {
              // console.log('After push notifcation sent: ' +res);
    
            });
          }) */
    });
  }
  ionViewDidLoad() {
    //get Response

    //get Requests
    setTimeout(() => {
      this.slideChanged()
    }, 100);
    this.dbIncoming.where('hOwnerUID', '==', this.uid).onSnapshot((res) => {
      res.forEach((doc) => {
        let pdf = doc.data().pdfLink;
        this.pdf = pdf;
      })
    })
    this.dbMessage.where('hOwnerUid', '==', this.uid).where('builderUID','==',this.navParams.data.name.builderUID).onSnapshot((res) => {
      // console.log('This doc ', doc.data());
      res.forEach((doc) => {
        // quering builder personal number
          this.dbProfile.doc(doc.data().builderUID).onSnapshot((response)=>{
        this.msgSent.push({data:doc.data(), id: doc.id, user: response.data()})
        //this.number = doc.data().personalNumber;
      })
    })
    })

  }
/*   viewQuotes() {
   
      this.file.writeFile(this.file.dataDirectory, 'quotation.pdf', blob, { replace: true }).then(fileEntry => {
        this.fileOpener.open(this.file.dataDirectory + 'quotation.pdf', 'application/pdf');
      })
   
  } */
  brick = 'Engineering brick' //demo
  getChats() {
    this.dbChatting.doc(this.uid).collection(this.navParams.data.name.builderUID).add({ chat: this.chatMessage, date: Date.now(), builder: false, id: this.currentUid }).then((res) => {
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
  downloadPDF(pdf) {
    this.loader.create({
      content: "Downloading...",
      duration: 3000
    }).present();
    console.log('PDF link..', pdf);
    let request: DownloadRequest = {
      uri: pdf,
      title: 'Yakha quote' + new Date().toLocaleString,
      description: '',
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
          dirType: 'Downloads',
          subPath: 'yakha'
      }
  };
  this.downloader.download(request)
              .then((location: string) => console.log('File downloaded at:'+location))
              .catch((error: any) => console.error(error));
  //  this.pdfObj = pdfMake.createPdf();
   // this.pdfObj.getBuffer((buffer) => {
  /*   this.file.writeFile(this.file.dataDirectory, pdf+'.pdf', 'application/pdf', { replace: true }).then(fileEntry => {
      this.fileOpener.open(this.file.dataDirectory +  pdf+'.pdf', 'application/pdf');
    }) */
 // });
  }
  getProfileImageStyle() {
    return 'url(' + this.imageBuilder + ')';
  }
  callJoint(number) {

  //  console.log('number', this.number);

    this.callNumber.callNumber(number, true);
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
