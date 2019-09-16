import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, PopoverController } from 'ionic-angular';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { state, trigger, style, transition, animate } from '@angular/animations';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { v } from '@angular/core/src/render3';
import { ProfileComponent } from '../../components/profile/profile';

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
  builda = '';
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
     private fileOpener: FileOpener,
     public popoverCtrl: PopoverController,
    private file: File) {
    this.userDetails = this.navParams.data;
    this.hOwnerUID = this.userDetails.uid;
   
    this.db.collection('Users').doc(firebase.auth().currentUser.uid).onSnapshot((res)=>{
     res.data();
    // this.bUid = res.data().builder == true;
    // this.hType = res.data().builder == false;
   
    if(res.data().builder == true)
    {
      this.builda='ssfsfs';
      console.log(this.builda);
    } else {
      this.builda;
    }
    })
 
}

  ionViewDidLoad() {
    console.log(this.userDetails);
    this.brickType = this.userDetails.brickType;
    this.comment = this.userDetails.comment;
    this.date = this.userDetails.date;
    this.email = this.userDetails.email;
    this.endDate = this.userDetails.endDate;
    this.houseImage = this.userDetails.houseImage;
    this.startDate = this.userDetails.startDate;
    this.wallType = this.userDetails.wallType;
   
    
   this.extras = this.userDetails.extras;
    this.getRequest();
    this.getOwnerDetails();
  }
  togglePanel(){
    this.stateSlideDown = (this.stateSlideDown == 'visible') ? 'invisible' : 'visible';
  }
  showMore(){
    this.more = !this.more;
  }
  getOwnerDetails(){
    this.db.collection('Users').doc(firebase.auth().currentUser.uid).onSnapshot((res)=>{
      res.data();
      console.log(res.data());
      this.profPic = res.data().image;
      this.profName = res.data().fullName;
      this.profAbout = res.data().About;
      this.bUid = res.data().userType;
     })
   
  }
  viewProfile(myEvent) {
    console.log('wow');
    
    let popover = this.popoverCtrl.create(ProfileComponent);
    popover.present({
      ev: myEvent
    });
  }
  quotesForm() {
    this.navCtrl.push(BuilderquotesPage, this.hOwnerUID);
  }
  getRequest(){
    this.db.collection('Request').where('builderUID', '==', firebase.auth().currentUser.uid).get().then(snapshot => {
      this.request = [];
      snapshot.forEach(doc => {
        
        this.request.push(doc.data());
        this.hOwnerUID = doc.data().builderUID;
        console.log(this.hOwnerUID);
        
        this.quoteDoc = doc.data().doc;
        this.homeOwner = doc.data().hOwnerUid;
       // console.log(this.homeOwner);
        this.db.collection('Users').doc(this.homeOwner).get().then((res)=>{
          console.log(res.data());
           this.profilePic = res.data().image;
           this.ownerName = res.data().fullName;
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
  viewHouse(myEvent) {
    console.log('image',myEvent);
    
    let popover = this.popoverCtrl.create(ProfileComponent,{image: myEvent});
    popover.present({
      ev: myEvent
    });
  }

}
