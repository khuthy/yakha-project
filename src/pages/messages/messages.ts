import { Component, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { OneSignal } from '@ionic-native/onesignal';
import { PopoverPage } from '../popover/popover';

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
  dbMessage = firebase.firestore().collection('Request');
  dbIncoming = firebase.firestore().collection('Respond');
  dbProfile = firebase.firestore().collection('Users');
  dbFeed = firebase.firestore().collection('Feedback');
  dbChat = firebase.firestore().collection('chat_msg');
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
  builderName = '';
  msgSent = [];
  footer: boolean;
  chatMessage: string;
  myMsg='';
  //imageBuilder;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fileOpener: FileOpener,
    public elementref: ElementRef,
    public renderer: Renderer2,
    public authServes: AuthServiceProvider,
    public oneSignal: OneSignal, public popoverCtrl: PopoverController
  ) {
    this.autoUid = this.navParams.data;
    console.log(this.autoUid);
    this.builderName = this.autoUid.name;
    this.imageBuilder = this.autoUid.img;
    
  }

  open() {
    if (this.toggle == true) {
      this.toggle = false;
      this.icon = 'arrow-dropdown';
      this.footer = false;
    }else {
      this.icon = 'arrow-dropup';
      this.toggle = true;
      this.footer = true;
    }

  }
  /* Tesing if chats works */
  chats = [];





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
     
    let data = { incoming: {}, sent: {} }
    this.dbChat.doc(this.uid).collection(this.autoUid.id).onSnapshot((resChat) => {
      this.messages = [];
      resChat.forEach((doc) => {
       // console.log('>>>>>>>>>>>>>>>>>>>>>', doc.data());
        data.sent = doc.data();
        this.messages.push(data.sent); 

      })
      console.log('All messages sent...',this.messages);
    })
    this.dbChat.doc(this.autoUid.id).collection(this.uid).onSnapshot((res)=>{
      this.incomingRes=[];
      res.forEach((doc)=>{
        this.incomingRes.push(doc.data());
      })
      console.log('Response message....', this.incomingRes );
    })
    // this.dbMessage.doc(this.uid).onSnapshot((res)=>{
    //   this.msgSent.push(res.data());
    //   console.log('Message sent>>>>',this.msgSent);
    // })
   // this.messages.push(data);
    // this.dbMessage.doc(this.autoUid.id).onSnapshot((res) => {
    //   data.sent = res.data();

    //   data.incoming = {};
    // })

    // this.dbIncoming.doc(this.autoUid.id).onSnapshot((doc) => {
    //   data.incoming = doc.data();
    // })
    
   

    // data = { incoming: {}, sent: {}}
    //   this.homebuilder = this.authServes.manageUsers(); //testing if the css is working
    //   this.dbMessage.where('hOwnerUid','==', firebase.auth().currentUser.uid).onSnapshot((res)=>{

    //     res.forEach((doc)=>{ 
    //       if(doc.data().viewed==false){
    //          this.dbIncoming.doc(doc.id).update({viewed: true})
    //       }
    //       this.dbIncoming.doc(doc.id).onSnapshot((info)=>{
    //         // this.qDoc = doc.id;
    //         // console.log(this.messages);
    //        // this.qDoc = info.data().pdfLink;
    //          //this.honwerUID = doc.data().uid;
    //        //  console.log(doc.data().hOwnerUid);
    //          this.dbProfile.doc(doc.data().builderUID).onSnapshot((builderData)=>{
    //           this.messages = [];
    //          this.dbProfile.doc(doc.data().hOwnerUid).onSnapshot((res)=>{
    //            let msgData = {incoming:info.data(),incomingID: info.id, sent:doc.data(), user:res.data(), builder: builderData.data()}
    //            this.messages.push(msgData);
    //           // this.hownerName = ;
    //           console.log('jjjjjjjjjjjjjjjjj',this.messages);
    //          })
    //          })
    //          })
    //     })
    //   })
    // this.dbFeed.where('owner','==',firebase.auth().currentUser.uid).onSnapshot((res)=>{
    //   res.forEach((doc)=>{
    //     console.log('Feedback data for this user', doc.data());

    //   })
    //  /*  document.getElementById('accept').style.display="none";
    //   document.getElementById('review').style.display="none"; */

    // })
    // /* get request */
    //  this.db.collection('Request').doc(this.autoUid).onSnapshot((getRequest) => {
    //         if(getRequest.exists){
    //           this.projectRequirement.brickType = getRequest.data().brickType;
    //           this.projectRequirement.startDate = getRequest.data().startDate;
    //           this.projectRequirement.wallType = getRequest.data().wallType;
    //           this.projectRequirement.comment = getRequest.data().comment;
    //           this.projectRequirement.endDate = getRequest.data().endDate;
    //           this. projectRequirement.date = getRequest.data().date;
    //         }

    //  })

  }
  brick = 'Engineering brick' //demo
  getChats() {
    this.dbChat.doc(this.uid).collection(this.autoUid.id).add({chat: this.chatMessage, date: Date(), builder: false}).then((res)=>{
      res.onSnapshot((doc)=>{
        this.chatMessage='';
        this.myMsg = doc.data().chat
        console.log('This is what I sent now...', doc.data());
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
    return 'url(' + this.imageBuilder + ')'
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
