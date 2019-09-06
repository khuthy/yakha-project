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

 
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public forms: FormBuilder,
    public menuCtrl: MenuController,
    public alert: AlertController,
    public authService: AuthServiceProvider,
   
    ) {
    
      
    
  }

  ionViewWillEnter(){
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave(){
    this.menuCtrl.swipeEnable(false);
  }

  

  

 

}