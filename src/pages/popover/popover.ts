import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as firebase from 'firebase';

/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  dbFeedback = firebase.firestore().collection('Feedback');
  msg: any;
  rateValue;
  rate;
  feed;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    console.log(this.navParams.get('key1'));
     
  }


  logRatingChange(rating) {
    console.log(rating);
    this.rateValue=rating;
    // this.dbFeedback.add({ rating: rating, msg: '', uid: firebase.auth().currentUser.uid, date: Date(), docId: '' }).then((res) => {
    //   res.update({ docId: res.id })
    // })
  } 
  save() {
    this.dbFeedback.add({rating: this.rateValue,msg: this.msg, builder: this.navParams.get('key1'), owner: firebase.auth().currentUser.uid}).then((res)=>{
      res.onSnapshot((r)=>{
        console.log(r.data()); 
       // this.feed = r.data().builder;
        this.viewCtrl.dismiss();
      });
      
    })
  }
}
