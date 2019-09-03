import { Keyboard } from '@ionic-native/keyboard';
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


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
import { BaccountSetupPage } from '../baccount-setup/baccount-setup';
import { state, trigger, transition, animate, style } from '@angular/animations';
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
  animations: [
    trigger('hide', [
      state('visible', style({opacity: 1})),
      state('invisible', style({opacity: 0})),
      transition('* => *', animate('.1s'))
    ]),
    
  ]
})
export class LoginPage {
  @ViewChild('svg') svg: ElementRef;
 
  hideMe(){
   
  }
  db = firebase.firestore();
  firebase = firebase;
  public loginForm: FormGroup;
  loading: Loading;


  
  validation_messages = {
    'email': [
      {type: 'required', message: 'Email address is required.'},
      {type: 'pattern', message: 'Email address is not Valid.'},
   
    ],
    'password': [
     {type: 'required', message: 'Password is required.'},
     {type: 'minlength', message: 'password must be atleast 6 char or more.'},
    /*  {type: 'maxlength', message: 'Password must be less than 8 char or less'}, */
   ]
 
  }
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,  
     private formBuilder: FormBuilder,
    private userProvider:UserProvider,
     public loadingCtrl: LoadingController,
     public alertCtrl: AlertController,
     private authService:AuthServiceProvider,
     private menuCtrl: MenuController,
     private keyboard: Keyboard,
     private render: Renderer2
     ) {
      this.loginForm = this.formBuilder.group({
        email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)]))
      
      })
    
      this.keyboard.onKeyboardShow().subscribe((val) => {
        if(this.keyboard.isVisible) {
          this.render.setStyle(this.svg.nativeElement, 'opacity', '0');
        }else {
          this.render.setStyle(this.svg.nativeElement, 'opacity', '5');
        }
        
      })
    
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
  createAcc(){
this.navCtrl.push(RegisterPage)
  }
  forgotpassword(){
    this.navCtrl.push(ForgotPasswordPage)
  }

  checkeyboard() {

  }

  //hide keyboard
  hidekeyboard(){
    this.keyboard.hide();
  }

  showkeyboard(){
    this.keyboard.show();
  }
  loginUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {

      this.userProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authService => {
        if(authService.user.emailVerified === true) {
         let userLoggedIn = this.db.doc(`/User/${authService.user.uid}`);
         userLoggedIn.get().then(getuserLoggedIn => {
         let homeOwnerInfo = this.db.collection('HomeOwnerProfile').where("uid", "==", authService.user.uid);
         let homeBuilders = this.db.collection('builderProfile').where("uid", "==", authService.user.uid);
     if(getuserLoggedIn.data().userType == 'Homebuilder') {
      homeBuilders.get().then(connectBuilder => { 
        if(connectBuilder.empty) {
          this.alertCtrl.create({
            subTitle: 'Create profile',
            title: 'Please create a profile to continue',
          }).present();
          this.navCtrl.setRoot(BaccountSetupPage);
        }else {
          this.navCtrl.setRoot(HomePage);
        }
    });
     }else {
         homeOwnerInfo.get().then(connectOwner => { 
          if(connectOwner.empty) {
            this.alertCtrl.create({
              subTitle: 'Create profile',
              title: 'Please create a profile to continue.',
            }).present();
            this.navCtrl.setRoot(AccountSetupPage);
          }else {
            this.navCtrl.setRoot(HomePage);
          }
      });
     }
    
     })
         
        
        }else {
          this.navCtrl.setRoot(VerifyemailPage); 
          this.alertCtrl.create({
           title: 'Email Verification',
           subTitle: 'Your email address is not verified. please complete this form and check your email box',
           buttons: ['Ok']
           }).present();
          
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







