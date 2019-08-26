import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


// import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { HomePage } from '../home/home';

import { RegisterPage } from '../register/register';
import { UserProvider } from '../../providers/user/user';
import * as firebase from 'firebase';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { AccountSetupPage } from '../account-setup/account-setup';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomeOwnerProfilePage } from '../home-owner-profile/home-owner-profile';
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
     private authService:AuthServiceProvider) {
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
    this.firebase.auth().onAuthStateChanged( user => {
      if (user){
        
        // send the user's data if they're still loggedin
        this.authService.setUser(user);
        this.db.collection('User').where('uid', '==', user.uid).get().then(snapshot => {
          if (snapshot.empty){
            
          } else {
            this.navCtrl.setRoot(HomeOwnerProfilePage);
            
          }
        })
      }
    })
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

        this.navCtrl.setRoot(HomePage);
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







