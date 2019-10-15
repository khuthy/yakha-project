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
  average : number;
  hideRev='';
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
    //  console.log(this.displayProfile);
    this.db.collection('Feedback').where('owner','==',this.uid).where('builder','==', this.dat.uid).onSnapshot((res1)=>{
        res1.forEach((doc)=>{
          console.log('Feedback doc........:',doc.data());
          this.hideRev = doc.data().owner
        })
    })
    this.db.collection('feedback').where('builderuid', '==', this.dat.uid).onSnapshot((res) => {
     // console.log(res.size);
     // this.numRate = res.size;
      if (!res.empty) {
     /*    res.forEach((doc) => {
          console.log(doc.data().rating);
          
        }) */
        var total = 0;
        for (let index = 0; index < res.docs.length; index++) {
          const element = res.docs[index].data();
          total += Number(res.docs[index].data().rating);
          this.sum = total;
         this.average = this.sum / this.numRate;
         console.log(this.average); 
        }
      }
    })


 /*    this.db.collection('feedback').where('builderuid', '==', this.dat.uid).onSnapshot((res) => {
      if (!res.empty) {
        res.forEach((doc) => {
          this.rating = doc.data().rating;
        })
      }
    }) */
  }
  // logRatingChange(rating) {
  //   // console.log("changed rating: ",rating);
  //   // this.db.add({ rating: rating, uid: this.uid, date: Date() });

  //   this.alertCtrl.create({
  //     title: 'Thanks for feedback',
  //     inputs: [
  //       {
  //         name: this.msg,
  //         placeholder: 'Please write message'
  //       }],
  //     buttons: [{
  //       text: 'Cancel',
  //       handler: data => {
  //         // this.toastCtrl.create({ message: 'Rating comment has just cancelled..', duration: 1000 }).present();
  //       }
  //     }, {
  //       text: 'Save',
  //       handler: data => {
  //         // console.log(data[0]);
  //         this.db.collection('feedback').add({ rating: rating, msg: data[0], builderuid: this.dat.uid, uid: this.uid, date: Date(), docId: '' }).then((res) => {
  //           res.update({ docId: res.id })
  //         });
  //       }
  //     }]
  //   }).present();
  // }
  presentPopover() {
    const popover = this.popoverCtrl.create(PopoverPage, {key1:this.dat.uid});
    popover.present();
  }
  next() {
    this.navCtrl.push(QuotationFormPage, this.dat.uid);
  }

  editProfile() {
    this.isProfile = false;
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