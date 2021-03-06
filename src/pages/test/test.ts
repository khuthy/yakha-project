import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import * as firebase from 'firebase';
import { CallNumber } from '@ionic-native/call-number';
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
  @ViewChild('slides') slides: Slides;
  dbChat = firebase.firestore().collection('chat_msg');
  dbChatting = firebase.firestore().collection('chatting');
  dbIncoming = firebase.firestore().collection('Request');
  dbProfile = firebase.firestore().collection('Users');
  dbSent = firebase.firestore().collection('Respond');
  uid = firebase.auth().currentUser.uid;
  chatMessage: any;
  myMsg: any;
  messages = [];
  msgSent = [];
  getowners = {
    image: '',
    fullName: '',
    personalNumber:'',
  };
  currentUid: any;
  incomingMsg = [];
  msgInfo = [];
  chat = [];
 
  toggle: boolean = false;
  icon: string = 'ios-arrow-down';
  extras=[];
  number: any;
  quoteStatus: any;
  constructor(public navCtrl: NavController, 
    private callNumber:CallNumber,
    public navParams: NavParams) {
    // this.imageBuilder = this.navParams.data.img;
    console.log('Nav params', this.navParams.data);
    this.messages = [];
   
  }
  open() {
    if (this.toggle == true) {
      this.toggle = false;
      this.icon = 'ios-arrow-down';
      
    } else {
      this.icon = 'ios-arrow-up';
      this.toggle = true;
     
    }

  }

  ionViewDidLoad() {
    /* this.dbIncoming.where('builderUID','==',this.uid).onSnapshot((res)=>{
      res.forEach((doc)=>{
        console.log('Response....', doc.data());
        
      })
    }) */
    setTimeout(() => {
      this.slideChanged()
    }, 500);
 /*    this.dbChat.doc(this.navParams.data.docID).collection(this.uid).onSnapshot((res) => {
        this.extras.push(res.data().extras[0]);
        console.log('My extras......', this.extras);
     // })
    }) */
    this.dbChat.doc(this.navParams.data.docID).collection(this.uid).onSnapshot((res) => {
      // console.log('This doc ', doc.data());
      res.forEach((doc) => {
        this.dbProfile.doc(doc.data().hOwnerUid).onSnapshot((response)=>{
        this.msgSent.push({data:doc.data(), id: doc.id, user: response.data()})
      })
    })
    })
  
     setTimeout(() => {
      this.getOwnerDetails();
     }, 3000);

  
  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.currentUid = this.msgSent[currentIndex].id;
     this.dbChatting.doc(this.navParams.data.uid).collection(this.uid).where('id','==',this.msgSent[currentIndex].id).orderBy('date').onSnapshot((res) => {
      this.msgInfo=[];
      for (let i = 0; i < res.docs.length; i++) {
        this.msgInfo.push(res.docs[i].data())
      }
    //  console.log('Message...', this.msgInfo);  
    }) 
    this.dbSent.doc(this.currentUid).onSnapshot((doc)=>{
      if (doc.data().msgStatus!=="") {
     ///  this.hideCard = '';
       this.quoteStatus = doc.data().msgStatus;
      // console.log('Status............................', this.quoteStatus);
      } 
    })
  }
  getChats() {
    this.dbChatting.doc(this.navParams.data.uid).collection(this.uid).add({ chat: this.chatMessage, date: Date.now(), builder: true, id:  this.currentUid }).then((res) => {
      res.onSnapshot((doc) => {
        this.chatMessage = '';
        this.myMsg = doc.data().chat
        console.log('This is what I sent now...', doc.data());
      })
    })
  }
  respond() {
    this.navCtrl.push(BuilderquotesPage, {docID: this.currentUid, uid: this.navParams.data.uid});
  }
  getOwnerDetails() {
    this.dbProfile.doc(this.navParams.data.uid).onSnapshot(owners => {
       this.getowners.image = owners.data().image;
      this.getowners.fullName = owners.data().fullName;
      this.getowners.personalNumber= owners.data().personalNumber;
    })
  }
  getProfileImageStyle() {
    return 'url(' + this.getowners.image + ')'
  }
  callJoint(number) {
    this.callNumber.callNumber(number, true);
  }
}
