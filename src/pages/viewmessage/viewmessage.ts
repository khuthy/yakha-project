import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { state, trigger, style, transition, animate } from '@angular/animations';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { v } from '@angular/core/src/render3';

/**
 * Generated class for the ViewmessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewmessage',
  templateUrl: 'viewmessage.html',
  animations: [
    trigger('slideDown', [
      state('visible', style({height: 'auto'})),
      state('invisible', style({height: 0, padding: '0%', overflow: 'hidden'})),
      transition('* => *', animate('.4s'))
    ]),
    
  ]
})
export class ViewmessagePage {
  db = firebase.firestore();
  request =[];
  messages = {
    active: false,
    inactive: true
  }
  more = false;

  stateSlideDown = 'visible'
  userDetails;
  hOwnerUID;
  id;
  hOwnerUid;
  bUid;
  quoteDoc;
  homeOwner;
  profilePic;
  ownerName;
  profPic;
  profName;
  profAbout;
  hType;
  brickType;
  comment: any;
  date: any;
  doc: any;
  email: any;
  endDate: any;
  hOwnerPhone: any;
  houseImage: any;
  response_date: any;
  startDate: any;
  wallType: any;
  extras=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,  private fileOpener: FileOpener,
    private file: File) {
    this.userDetails = this.navParams.data;
    this.hOwnerUID = this.userDetails.uid;
   
    this.db.collection('User').doc(firebase.auth().currentUser.uid).onSnapshot((res)=>{
     res.data();
     this.bUid = res.data().userType =="Homebuilder";
     this.hType = res.data().userType =="Homeowner";
    })
    
  }

  ionViewDidLoad() {
    console.log(this.userDetails);
    this.brickType = this.userDetails.brickType;
    this.comment = this.userDetails.comment;
    this.date = this.userDetails.date;
    this.doc = this.userDetails.doc;
    this.email = this.userDetails.email;
    this.endDate = this.userDetails.endDate;
    this.hOwnerPhone = this.userDetails.hOwnerPhone;
    this.houseImage = this.userDetails.houseImage;
    this.response_date = this.userDetails.response_date;
    this.startDate = this.userDetails.startDate;
    this.wallType = this.userDetails.wallType;
   this.extras = this.userDetails.extras;
    //this.hOwnerPhone = this.userDetails.hOwnerPhone;
//builderUID: "HkXc4HvYXIOjZm51BdQcaRZvLj13"
// comment: "I need this urgently"
// createBy: ""
// date: "Thu Sep 05 2019 17:11:52 GMT+0200 (South Africa Standard Time)"
// doc: ""
// email: "sharonmunyai@gmail.com"
// endDate: "2019-09-14"
// hOwnerPhone: "0815884639"
// height: "23"
// houseImage: ""
// length: "23"
// response_date: ""
// startDate: "2019-09-05"
// uid: "EaMeGYMVqagYRxXfQ87thFBA9wZ2"
// wallType: "singleWall"
// width: "23"
    this.getRequest();
  }
  togglePanel(){
    this.stateSlideDown = (this.stateSlideDown == 'visible') ? 'invisible' : 'visible';
  }
  showMore(){
    this.more = !this.more;
  }
  getOwnerDetails(){
    this.db.collection('HomeOwnerProfile').doc(firebase.auth().currentUser.uid).onSnapshot((res)=>{
      res.data();
      console.log(res.data());
      this.profPic = res.data().ownerImage;
      this.profName = res.data().fullname;
      this.profAbout = res.data().About;
      this.bUid = res.data().userType;
     })
   
  }
  quotesForm() {
    this.navCtrl.push(BuilderquotesPage, this.hOwnerUID);
  }
  getRequest(){
    this.db.collection('HomeOwnerQuotation').where('comment', '==', this.userDetails).get().then(snapshot => {
      this.request = [];
      snapshot.forEach(doc => {
        this.request.push(doc.data());
        this.hOwnerUID = doc.id;
        this.quoteDoc = doc.data().doc;
        this.homeOwner = doc.data().uid;
       // console.log(this.homeOwner);
        this.db.collection('HomeOwnerProfile').doc(this.homeOwner).get().then((res)=>{
          console.log(res.data());
           this.profilePic = res.data().ownerImage;
           this.ownerName = res.data().fullname;
        })
        //this.hOwnerUID = doc.data().length + 'x' + doc.data().width + 'x' + doc.data().height;
      });
      console.log('Requests: ', this.request);
    
    });
  }
  getUser(){
   // let homeOwner = '';
   
  }
  download(){
    if(this.quoteDoc!='')
  //  var blob = new Blob([buffer], { type: 'application/pdf' });
    this.file.writeFile(this.file.dataDirectory, `${this.quoteDoc}.pdf`, this.quoteDoc+'.pdf', { replace: true }).then(fileEntry => {
      // Open the PDf with the correct OS tools
      this.fileOpener.open(this.file.dataDirectory + 'quotation.pdf', 'application/pdf');
    })
  }

}
