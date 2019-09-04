import { OnboardingBuilderPage } from './../onboarding-builder/onboarding-builder';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { OnboardingPage } from '../onboarding/onboarding';
import {Storage} from '@ionic/storage';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider, private menuCtrl: MenuController, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }
  ionViewWillEnter(){
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave(){
    this.menuCtrl.swipeEnable(false);
  }


  definedUser(val) {
    this.authService.predefined = val;
    if(this.authService.manageUsers() == 'Homebuilder') {
      this.storage.get('onboarding').then((val) => {
        if(val == 'checked')  {
          console.log(val);
          this.navCtrl.setRoot(LoginPage);
          
        }else {
          console.log('on-boarding now');
           this.navCtrl.setRoot(OnboardingBuilderPage);
        }
      });
     
    }else {
      this.storage.get('homeOwner').then((val) => {
        if(val == 'checked')  {
          console.log(val);
          this.navCtrl.setRoot(LoginPage);
          
        }else {
          console.log('on-boarding now');
           this.navCtrl.setRoot(OnboardingPage);
        }
      });
    }
   
  }

}
