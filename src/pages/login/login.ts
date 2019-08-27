import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


// import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { HomePage } from '../home/home';

import { RegisterPage } from '../register/register';
import { UserProvider } from '../../providers/user/user';
import * as firebase from 'firebase';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { AccountSetupPage } from '../account-setup/account-setup';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WelcomePage } from '../welcome/welcome';
import { BricklayerlandingPage } from '../bricklayerlanding/bricklayerlanding';
import { VerifyemailPage } from '../verifyemail/verifyemail';
​
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
​
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  db = firebase.firestore();
  firebase = firebase;
  public loginForm: FormGroup;
  loading: Loading;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,  
     private formBuilder: FormBuilder,
    private userProvider:UserProvider,
     public loadingCtrl: LoadingController,
     public alertCtrl: AlertController,
     private authService:AuthServiceProvider,
     private menuCtrl: MenuController
     ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(16)])
      ]
    });
    
   
    
  }

​
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginOwnerPage');
  }

  ionViewWillEnter(){
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave(){
    this.menuCtrl.swipeEnable(false);
  }
​
  //Create
  createAcc(data){
this.navCtrl.push(RegisterPage, data)
  }
  forgotpassword(){
    this.navCtrl.push(ForgotPasswordPage)
  }
  loginUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {

      this.userProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authService => {
        if(authService.user.emailVerified === true) {
              this.navCtrl.setRoot(HomePage);
        }else {
          this.alertCtrl.create({
           title: 'Email Verification',
           subTitle: 'Your email address is not verified. please complete this form and check your email box',
           buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('cancel clicked');
                
              }
            },
            {
              text: 'Ok',
              handler: data => {
                console.log('Saved clicked');
                this.navCtrl.setRoot(VerifyemailPage);
              }
            }
          ]
           
          })
          
        }
         
        
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
​
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }
}







