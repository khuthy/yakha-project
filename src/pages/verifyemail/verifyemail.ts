import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { LoginPage } from '../login/login';
/**
 * Generated class for the VerifyemailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verifyemail',
  templateUrl: 'verifyemail.html',
})
export class VerifyemailPage {

  verifyForm: FormGroup;
  email: string;
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email address is required' },
       {type: 'pattern', message: 'Email address is not valid'}
    ]
  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public forms: FormBuilder,
    public menuCtrl: MenuController,
    public alert: AlertController
    ) {
     this.verifyForm = this.forms.group({
         email: new FormControl('', Validators.compose([Validators.required, Validators.email]))
      })
  }

  ionViewWillEnter(){
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave(){
    this.menuCtrl.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyemailPage');
    var user = firebase.auth().currentUser;
   console.log(user);
  }

  verifyEmail(verifyForm: FormGroup){
    var user = firebase.auth().currentUser;
   console.log(user);

 
     if(this.email == user.email) {
        user.sendEmailVerification().then(() => {
        // Email sent.
        console.log('are you sure thats your email?');
       this.alert.create({
         title: 'Successfully sent',
         subTitle: 'Check your email before logging in',
         buttons: ['Ok']
       }).present();
       this.navCtrl.setRoot(LoginPage)
      }).catch((error) => {
        // An error happened.
      });
     }else {
       console.log('are you sure thats your email?');
       this.alert.create({
         title: 'Wrong Email',
         subTitle: 'are you sure that\'s your email',
         buttons: ['Ok']
       }).present();
     }
     
   
  }

}
