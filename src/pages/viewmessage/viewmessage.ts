import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BuilderquotesPage } from '../builderquotes/builderquotes';
import { state, trigger, style, transition, animate } from '@angular/animations';
import * as firebase from 'firebase';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,  private fileOpener: FileOpener,
    private file: File) {
    this.userDetails = this.navParams.data;
    this.hOwnerUID = this.userDetails.uid;
   
    this.db.collection('User').doc(firebase.auth().currentUser.uid).get().then((res)=>{
     res.data();
    
     this.bUid = res.data().userType =="Homebuilder";
    })
    // this.db.collection('HomeOwnerProfile').doc(firebase.auth().currentUser.uid).get().then((res)=>{
    //   res.data();
    //   this.bUid = res.data().userType;
    //  })
  }

  ionViewDidLoad() {
    //console.log(this.navParams.data);
    this.getRequest();
  }
  togglePanel(){
    this.stateSlideDown = (this.stateSlideDown == 'visible') ? 'invisible' : 'visible';
  }
  showMore(){
    this.more = !this.more;
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
