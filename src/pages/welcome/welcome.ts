import { OnboardingBuilderPage } from './../onboarding-builder/onboarding-builder';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { OnboardingPage } from '../onboarding/onboarding';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider, private menuCtrl: MenuController) {
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
    if(val == 'Homebuilder') {
      console.log('builder');
      
      this.authService.predefined = val;
    this.navCtrl.setRoot(OnboardingBuilderPage);
    }else {
      this.authService.predefined = val;
      console.log('Owner');
    this.navCtrl.setRoot(OnboardingPage);
    }
     
  }

}
