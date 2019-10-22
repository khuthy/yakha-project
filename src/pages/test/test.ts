import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
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
  msgSent = []
  toggle: boolean = false;
  icon: string = 'ios-arrow-down';
  extras=[];
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
    /* this.dbIncoming.where('builderUID','==',this.uid).onSnapshot((res)=>{
      res.forEach((doc)=>{
        console.log('Response....', doc.data());
        
      })
    }) */
    setTimeout(() => {
      this.slideChanged()
    }, 500);
    this.dbIncoming.doc(this.navParams.data.docID).onSnapshot((res) => {
      // console.log(res.docs);
     // res.forEach((doc) => {
     //   console.log(res.data())
        this.extras.push(res.data().extras[0]);
        console.log('My extras......', this.extras);
     // })
    })
    this.dbIncoming.where('builderUID','==',this.uid).onSnapshot((res) => {
      // console.log('This doc ', doc.data());
      res.forEach((doc) => {
        this.msgSent.push({data:doc.data(), id: doc.id})
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
      console.log('Message...', this.msgInfo);  
    }) 
  }
  getChats() {
    this.dbChatting.doc(this.navParams.data.uid).collection(this.uid).add({ chat: this.chatMessage, date: Date(), builder: true, id:  this.currentUid }).then((res) => {
      res.onSnapshot((doc) => {
        this.chatMessage = '';
        this.myMsg = doc.data().chat
        console.log('This is what I sent now...', doc.data());
      })
    })
  }
  respond() {
    this.navCtrl.push(BuilderquotesPage, {docID: this.navParams.data.docID, uid: this.navParams.data.uid});
    //console.log('Doc ID--', this.currentUid, 'Home owner uid--', this.navParams.data.uid);
    
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
