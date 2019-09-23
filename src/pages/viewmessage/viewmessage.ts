import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, PopoverController, Platform } from 'ionic-angular';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { state, trigger, style, transition, animate } from '@angular/animations';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { ProfileComponent } from '../../components/profile/profile';
import { FileTransfer } from '@ionic-native/file-transfer';

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
  hOwnerUid={};
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
  docID: any;
  response: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
     private fileOpener: FileOpener,
     public popoverCtrl: PopoverController,
    private file: File,
    private platform: Platform, 
    private ft: FileTransfer, 
    private document: DocumentViewer
    ) {
    this.userDetails = this.navParams.data;
    this.hOwnerUID = this.userDetails.uid;
    console.log('data info: ',this.userDetails.docID);
    
   
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
    console.log(this.userDetails, 'extras', this.userDetails.extras);
    this.brickType = this.userDetails.brickType;
    this.comment = this.userDetails.comment;
    this.date = this.userDetails.date;
    this.email = this.userDetails.email;
    this.endDate = this.userDetails.endDate;
    this.houseImage = this.userDetails.houseImage;
    this.startDate = this.userDetails.startDate;
    this.wallType = this.userDetails.wallType;
    this.docID = this.userDetails.docID;
   
    
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
    this.navCtrl.push(BuilderquotesPage, this.docID);
 //  console.log(value);
   
  }
  getRequest(){
    this.db.collection('Request').doc(this.userDetails.docID).onSnapshot(doc => {
      this.request = [];
      
        this.request.push(doc.data());
        this.hOwnerUID = doc.data().builderUID;
        let docID = doc.id;
        let docData = doc.data();
        this.hOwnerUID = {docID, docData} 
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
     
      console.log('Requests: ', this.request);
    
    });
    firebase.firestore().collection('Respond').doc(this.userDetails.docID).onSnapshot((pdfDownloadUrl) => {
      if(pdfDownloadUrl.exists) {
         this.doc = pdfDownloadUrl.data().pdfLink;
         this.response = true;
      }else {
        console.log('NO RESPONSE YET');
        this.response = false;
        this.doc = null;
      }
     
    })
  }
  getDPF(){
    return this.doc;
  }
  
downloadAndOpenPdf() {
  if(this.doc !== null) {
    let downloadUrl = this.doc;
   let path = this.file.dataDirectory;
  const transfer = this.ft.create();
 
  transfer.download(downloadUrl, path + this.userDetails.docID).then(entry => {
    let url = entry.toURL();
 
    if (this.platform.is('ios')) {
      this.document.viewDocument(url, 'application/pdf', {});
    } else {
      this.fileOpener.open(url, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    }
  });
  }
 
} 
icon: string;
  getUser(){
   // let homeOwner = '';
   
  }
  toggle:boolean = true;
  change(){
    this.toggle = !this.toggle;
   
  }
  expand(){
    alert('hi');
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
