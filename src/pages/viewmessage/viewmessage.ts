import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, PopoverController, Platform, ToastController } from 'ionic-angular';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { state, trigger, style, transition, animate } from '@angular/animations';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { ProfileComponent } from '../../components/profile/profile';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
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
    private document: DocumentViewer,
    private base64ToGallery: Base64ToGallery,
    private toastCtrl: ToastController
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
  
  downloadAndOpenPdf(){
  const options: DocumentViewerOptions = {
    title: this.userDetails.docID+'.pdf'
  }
  let url = this.doc;
  console.log(this.doc);
  
  this.document.viewDocument(url, 'application/pdf', options)

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
  //  downloadQR() {
  //  // const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  //  /* console.log('Doc '+this.doc);
   
  //   const imageData = this.doc.toDataURL('image/jpeg').toString();
  //   console.log('data ', imageData);
    
  //   let data = imageData.split(',')[1]; */

  //   this.base64ToGallery.base64ToGallery(this.doc.split(',')[1],
  //     {prefix:'_img', mediaScanner:true})
  //     .then(async res=>{
  //       let toast = await this.toastCtrl.create({
  //         message:'QR Code save in your Photolibrary'
  //       });
  //       toast.present();
  //     }, err => console.log('err: ', err)
  //     );
  // }  
}
