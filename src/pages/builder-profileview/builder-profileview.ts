import { QuotationFormPage } from './../quotation-form/quotation-form';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import * as firebase from 'firebase'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { PopoverPage } from '../popover/popover';

/**
 * Generated class for the BuilderProfileviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-builder-profileview',
  templateUrl: 'builder-profileview.html',
})
export class BuilderProfileviewPage {
  isProfile = false;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  dbRes = firebase.firestore().collection('Respond');
  uid = firebase.auth().currentUser.uid;
  profileImage
  displayProfile;
  //experiences: any = ['1','2','3','4','5','6','7','8','9','10','11'];

  dat = {} as builderProfile;
  respQ = [];
  msg: string | number;
  rating;
  numRate: number;
  sum: number;
  average: number;
  hideRev = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtlr: LoadingController, private authUser: AuthServiceProvider,
    public alertCtrl: AlertController, public popoverCtrl: PopoverController) {
    this.dat = this.navParams.data;
    // console.log();

    //this.dat = 
    //console.log('jjj ', this.displayProfile);

  }

  ionViewDidLoad() {
    this.dbRes.where('hOwnerUID', '==', this.uid).onSnapshot((res) => {
      if (!res.empty) {
        // this.respQ = [];
        res.forEach((doc) => {
          this.respQ.push(doc.data());
          //  console.log(this.respQ);

        })

      }
      //console.log(res.size);
    })
    
   // console.log('Date for today', this.formatDate(Date()));
    //  console.log(this.displayProfile);.toString().substring(8, 11)
    this.db.collection('Feedback').where('owner', '==', this.uid).where('builder', '==', this.dat.uid).onSnapshot((res1) => {
      this.hideRev = res1.size;
      document.getElementById('btnHide').style.display = "none";
     // this.hideRev = 'the date for the res has passed';
      res1.forEach((doc) => {
        //this.hideRev = doc.data().owner;
        this.dbRes.where('uid', '==', doc.data().builder).where('msgStatus', '==', 'Accepted').onSnapshot((res) => {
          if (!res.empty) {
            
            res.forEach((docRes) => {
              // console.log('Feedback doc........:', this.formatDate(doc.data().expiry).toString().substring(8, 11));
              if (this.formatDate(docRes.data().expiry).toString().substring(8, 11) < this.formatDate(Date()).toString().substring(8, 11)) {
                console.log('information found................', docRes.data().expiry);
                //
                document.getElementById('btnHide').style.display="flex";
              }
              
            })
          } 
          
          if (res.empty) {
            console.log('Nothing found on the db');
            document.getElementById('btnHide').style.display = "none";
          }
          

        })
      })
    })
  }
  formatDate(date) {
    let d = new Date(date),
      day = '' + d.getDate(),
      month = '' + (d.getMonth() + 1),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  presentPopover() {
    const popover = this.popoverCtrl.create(PopoverPage, { key1: this.dat.uid });
    popover.present();
  }
  next() {
    this.navCtrl.push(QuotationFormPage, this.dat.uid);
  }

  editProfile() {
    this.isProfile = false;
  }

  getProfileImageStyle() {
    return 'url(' + this.dat.image  + ')'
  }

}
export interface builderProfile {
  uid: '',
  image: '',
  fullName: '',
  certified: false,
  experiences: '',
  address: '',
  price: '',
  location: '',
  roof: '',
  gender: ''
}