import { Keyboard } from '@ionic-native/keyboard';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import * as firebase from 'firebase';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { AccountSetupPage } from '../account-setup/account-setup';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WelcomePage } from '../welcome/welcome';

import { BaccountSetupPage } from '../baccount-setup/baccount-setup';
import { state, trigger, transition, animate, style } from '@angular/animations';




@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [
    trigger('hide', [
      state('visible', style({ opacity: 1 })),
      state('invisible', style({ opacity: 0 })),
      transition('* => *', animate('.1s'))
    ]),

  ]
})
export class LoginPage {


  db = firebase.firestore().collection('Users');
  public loginForm: FormGroup;
  loading: Loading;
  builder: boolean;


  validation_messages = {
    'email': [
      { type: 'required', message: 'Email address is required.' },
      { type: 'pattern', message: 'Email address is not Valid.' },

    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'password must be atleast 6 char or more.' },
      /*  {type: 'maxlength', message: 'Password must be less than 8 char or less'}, */
    ]

  }
  getUser: string;
  password = true;
  bottomdeco = true;
  buttons = true;
  isKeyOpen: boolean = false;
  hid='';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,
    private menuCtrl: MenuController,
    public keyBoard: Keyboard,

  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)]))

    })

  }
  ionViewDidLoad() {
   this.builder = this.authService.manageUsers();
   console.log(this.builder, 'builder info');
   
    console.log('check if the user is a builder: ', this.authService.manageUsers());
    if (this.authService.manageUsers() == true) {
      this.getUser = "Home Builder";
    } else {
      this.getUser = "Aspiring Home Owner"

    }
  }
  checkKeyboard(data) {
  //  this.keyBoard.onKeyboardHide
    console.log(data);
    if (data =='open') {
      this.hid='value';
    } else {
      this.hid=''
    }
  }
  // set this to false by default


  ionViewWillEnter() {
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(false);
  }

  //Create
  createAcc() {
    this.navCtrl.push(RegisterPage)
  }
  forgotpassword() {
    this.navCtrl.push(ForgotPasswordPage)
  }
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Reset Password',
      inputs: [
        {
          name: 'Enter Email address',
          placeholder: 'Email address'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Reset Password',
          handler: data => {
            if (data) {
              // logged in!
              console.log('check your email', data);
              
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  loginUser() {
    if (!this.loginForm.valid) {
      this.alertCtrl.create({
        title: 'Incorrect entry!',
        subTitle: 'Please make sure your info is correct..',
        buttons: ['Ok']
      }).present();
    } else {

      let signIn = this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password);
      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        duration: 3500
      })
      loading.present();
      signIn.then((getUid) => {
        this.authService.setUser(getUid.user.uid);
        this.db.doc(this.authService.getUser()).onSnapshot((profile) => {
          if (!profile.exists) {
            this.alertCtrl.create({
              title: 'Create a profile',
              subTitle: 'Please create an account before we log you in.',
              buttons: ['Ok']
            }).present();
            if (profile.data().builder == true) {
              this.navCtrl.setRoot(BaccountSetupPage);
              loading.dismiss();
            } else {
              this.navCtrl.setRoot(AccountSetupPage);
              loading.dismiss();
            }
          } else {
            this.navCtrl.setRoot(HomePage);
            loading.dismiss();
          }
        })
      }).catch(error => {
        this.alertCtrl.create({
          title: error.code,
          subTitle: error.message,
          buttons: ['Try again']
        }).present();
      })

    }
  }
}







