import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, PopoverController } from 'ionic-angular';
import * as firebase from 'firebase';
import { HelpPage } from '../help/help';
import { PopoverPage } from '../popover/popover';

/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  db = firebase.firestore().collection('feedback');
  uid = firebase.auth().currentUser.uid;
  rateAvg;
  numRate;
  rateValue;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public popoverCtrl: PopoverController) {

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FeedbackPage');  
    this.db.where('uid', '==', this.uid).onSnapshot((res) => {
      res.forEach((doc) => {
        this.rateValue = doc.data().rating;
        if (this.rateValue <= 2.5) {
          this.alertCtrl.create({
            title: 'Thanks for feedback',
            message: 'Tell us what to improve?',
            buttons: [{
              text: 'Cancel',
              handler: data => {
                this.toastCtrl.create({ message: 'Rating comment has just cancelled..', duration: 1000 }).present();
              }
            }, {
              text: 'Comment',
              handler: data => {
                // console.log('Comment clicked');
                this.presentPopover();
              }
            }]
          }).present();
        }
      })
    })
  }
  logRatingChange(rating) {
    // console.log("changed rating: ",rating);
    this.db.doc(this.uid).set({ rating: rating, uid: this.uid, date: Date() });

  }
  commentfeed() {
   // this.db.doc(this.uid).update({comment})
  }
  presentPopover() {
    const popover = this.popoverCtrl.create(PopoverPage);
    popover.present();
  }
}