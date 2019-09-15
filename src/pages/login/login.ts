import { Keyboard } from '@ionic-native/keyboard';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


// import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import * as firebase from 'firebase';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { AccountSetupPage } from '../account-setup/account-setup';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WelcomePage } from '../welcome/welcome';
import { BricklayerlandingPage } from '../bricklayerlanding/bricklayerlanding';
import { VerifyemailPage } from '../verifyemail/verifyemail';
import { BaccountSetupPage } from '../baccount-setup/baccount-setup';
import { state, trigger, transition, animate, style } from '@angular/animations';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  builder;


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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthServiceProvider,
    private menuCtrl: MenuController,
    private keyboard: Keyboard,

  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)]))

    })

  }
  ionViewDidLoad() {
    this.authService.manageUsers();
    console.log( 'check if the user is a builder: ',this.authService.manageUsers());
  }

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

  loginUser() {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
     let signIn = this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password);
      signIn.then((getUid) => {
        let loading = this.loadingCtrl.create({
          content: 'Please wait...',
          spinner: 'bubble'
        })
        loading.present();
        this.authService.setUser(getUid.user.uid);
       this.db.doc(this.authService.getUser()).onSnapshot((profile) => {
         if(!profile.exists) {
           this.alertCtrl.create({
             message: 'Please create an account before we log you in.'
           }).present();
           if(profile.data().builder == true) {
              this.navCtrl.setRoot(BaccountSetupPage);
              loading.dismiss();
           }else {
            this.navCtrl.setRoot(AccountSetupPage);
            loading.dismiss();
           }
         }else {
           this.navCtrl.setRoot(HomePage);
         }
       })
      })

    }
  }
}







