import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { LoginPage } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BaccountSetupPage } from '../baccount-setup/baccount-setup';
import { AccountSetupPage } from '../account-setup/account-setup';
import { Storage } from '@ionic/storage';
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
  db = firebase.firestore();
  email: string;
  isSent: boolean;
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
    public alert: AlertController,
    public authService: AuthServiceProvider,
    public storage: Storage
    ) {
     this.verifyForm = this.forms.group({
         email: new FormControl('', Validators.compose([Validators.required, Validators.email]))
      })

      this.storage.get('message').then(val => {
        if(val == 'sent')  {
          this.isSent = true;
          
        }else {
          console.log('verification form');
          this.isSent = false;
        }
        
      });
    
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

  skip() {
    this.navCtrl.setRoot(LoginPage);
  }

  proceed() {
    var user = firebase.auth().currentUser;
    console.log(user);
    
    if(user.emailVerified == true) 
    {
      this.isSent = true;
      let userLoggedIn = this.db.doc(`/User/${user.uid}`);
       userLoggedIn.get().then(getuserLoggedIn => {
        
        if(getuserLoggedIn.data().userType == 'Homebuilder') {
          this.navCtrl.setRoot(BaccountSetupPage);
        }else {
          this.navCtrl.setRoot(AccountSetupPage)
        } 
      }).catch((error) => {

      })
    }else {
      this.alert.create({
        
      })
    }
      
  }

  verifyEmail(){
    var user = firebase.auth().currentUser;
   console.log(user);

 
     if(this.email == user.email) {

      user.sendEmailVerification().then(() => {
        // Email sent.
        
        console.log('Email was successfully sent');
        this.storage.set('message', 'sent');
        this.isSent = true;

       this.alert.create({
         title: 'Successfully sent',
         subTitle: 'Check your email before logging in',
         buttons: ['Ok']
       }).present();
       
       
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
