import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  public resetPasswordForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,private authservice: AuthServiceProvider,
      private formBuilder: FormBuilder,
      private alertCtrl: AlertController,) {
        this.resetPasswordForm = this.formBuilder.group({
          email: ['', Validators.compose([Validators.required, Validators.email])]
        });
  }
  ionViewDidLoad() {
  }
  resetPassword(resetPasswordForm: FormGroup): void {
    if (!resetPasswordForm.valid) {
      console.log(
        'Form is not valid yet, current value:',
        resetPasswordForm.value
      );
    } else {
      const email: string = resetPasswordForm.value.email;
      this.authservice.resetPassword(email).then(
        async () => {
          const alert = await this.alertCtrl.create({
            message: 'Check your email for a password reset link',
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                handler: () => {
               this.navCtrl.setRoot(LoginPage)
                }
              }
            ]
          });
          await alert.present();
        },
        async error => {
          const errorAlert = await this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: 'Ok', role: 'cancel' }]
          });
          await errorAlert.present();
        }
      );
    }
  }
 }
