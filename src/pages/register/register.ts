import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountSetupPage } from '../account-setup/account-setup';
import * as firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  db = firebase.firestore()

  public signupForm: FormGroup;
  public loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userProvider: UserProvider,
    private authService:AuthServiceProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,) {
      this.signupForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: [
          '',
          Validators.compose([Validators.minLength(6), Validators.required])
        ]
      });
  }
​
  ionViewDidLoad() {
   
  }
  async signupUser(signupForm: FormGroup): Promise<void> {
    if (!signupForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        signupForm.value
      );
    } else {
      const email: string = signupForm.value.email;
      const password: string = signupForm.value.password;
​
      this.authService.signupUser(email, password).then(
        () => {
          this.loading.dismiss().then(() => {
            console.log();
            let key=firebase.auth().currentUser.uid;
           this.navCtrl.setRoot(AccountSetupPage, key)
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
          });
        }
      );
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
    }
  }






}
