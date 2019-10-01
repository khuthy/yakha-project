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
  dbU = firebase.firestore().collection('Users');
  dbRequest = firebase.firestore().collection('Respond');
  uid = firebase.auth().currentUser.uid;
  rateAvg;
  numRate;
  rateValue;
  msg: string | number;
  comment: any;
  date: any;
  feed = [];
  img: any;
  docs;
  rateBuilderNow='';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public popoverCtrl: PopoverController) {
   // this.feed=[];
   this.dbRequest.onSnapshot((res)=>{
      res.forEach((doc)=>{
        this.db.where('uid','==',this.uid).onSnapshot((user)=>{
        user.forEach((doc)=>{
          this.rateValue = doc.data().rating;
        })
        })
        if(doc.data().hOwnerUID == this.uid) {
          this.rateBuilderNow = 'rateNow';
        }
      })
   })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FeedbackPage');  
    
    this.db.onSnapshot((res)=> {
      this.feed=[];
      res.forEach((doc) => {
        this.dbU.doc(doc.data().uid).onSnapshot((res)=> {
          let info = doc.data();
          let img =  res.data();
          let data = {info, img}
          this.feed.push(data);
        // console.log(this.feed);
         
        })
        
      })
    })
  }
  logRatingChange(rating) {
    // console.log("changed rating: ",rating);
   // this.db.add({ rating: rating, uid: this.uid, date: Date() });
          this.alertCtrl.create({
            title: 'Thanks for feedback',
            inputs: [
              {
                name: this.msg,
                placeholder: 'Please write message'
              }],
            buttons: [{
              text: 'Cancel',
              handler: data => {
                this.toastCtrl.create({ message: 'Rating comment has just cancelled..', duration: 1000 }).present();
              }
            }, {
              text: 'Save',
              handler: data => {
                // console.log(data[0]);
                this.db.add({ rating: rating, msg: data[0], uid: this.uid, date: Date(), docId:'' }).then((res)=>{
                  res.update({docId: res.id})
                });
              }
            }]
          }).present();
        }
  commentfeed() {
   // this.db.doc(this.uid).update({comment})
  }
  presentPopover() {
    const popover = this.popoverCtrl.create(PopoverPage);
    popover.present();
  }
  delete(item){
    this.alertCtrl.create({
      title: 'Delete feedback',
      message:'Are you sure?',
      buttons: [{
        text: 'Cancel',
        handler: data => {
          this.toastCtrl.create({ message: 'Delete comment has just cancelled..', duration: 1000 }).present();
        }
      }, {
        text: 'confirm',
        handler: data => {
          // console.log(data[0]);
          this.db.doc(item.docId).delete().then(()=>{
            this.toastCtrl.create({ message: 'Feedback has been deleted..', duration: 1000 }).present();
          })
        }
      }]
    }).present();
  }
}