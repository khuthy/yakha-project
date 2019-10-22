import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
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
  @ViewChild('slides') slides: Slides;
  dbChat = firebase.firestore().collection('chat_msg');
  dbChatting = firebase.firestore().collection('chatting');
  dbIncoming = firebase.firestore().collection('Request');
  dbSent = firebase.firestore().collection('Respond');
  uid = firebase.auth().currentUser.uid;
  chatMessage: any;
  myMsg: any;
  messages = [];
  getowners = {
    image: '',
    fullName: '',
    personalNumber:'',
  };
  currentUid: any;
  incomingMsg = [];
  msgInfo = [];
  chat = []

  toggle: boolean = false;
  icon: string = 'ios-arrow-down';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
    //console.log('ionViewDidLoad TestPage', docID: , uid:);
    this.dbIncoming.where('builderUID','==',this.uid).onSnapshot((res)=>{
      this.incomingMsg = [];
     // console.log('Requests......', res.docs); 
      res.forEach((doc)=>{
        this.incomingMsg.push(doc.data());
      })
    })
     setTimeout(() => {
      this.getOwnerDetails();
     }, 3000);
    this.dbChatting.doc(this.navParams.data.uid).collection(this.uid).orderBy("date").onSnapshot((res) => {
      this.chat=[];
      for (let i = 0; i < res.docs.length; i++) {
        this.chat.push(res.docs[i].data())
      }
    })
  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.currentUid = this.incomingMsg[currentIndex].builderUID;   
   // let curr = this.messages[currentIndex];
     this.dbChatting.doc(this.navParams.data.uid).collection(this.uid).where('id','==',this.chat[currentIndex].id).orderBy('date').onSnapshot((res) => {
      this.msgInfo=[];
      for (let i = 0; i < res.docs.length; i++) {
        this.msgInfo.push(res.docs[i].data())
      }
      console.log('Message...', this.msgInfo);  
    }) 
  }
  getChats() {
    this.dbChatting.doc(this.navParams.data.uid).collection(this.uid).add({ chat: this.chatMessage, date: Date(), builder: true, id: this.navParams.data.docID }).then((res) => {
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
      this.getowners.personalNumber= owners.data().personalNumber;
    })
  }
  getProfileImageStyle() {
    return 'url(' + this.getowners.image + ')'
  }
}
