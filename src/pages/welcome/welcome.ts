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


  definedUser(val: boolean) {
    /* check if the user is a builder or a home owner. false will be returned if the user is a home owner else true if it is a builder */
    this.authService.predefined = val;
    
    if(this.authService.manageUsers() == true) {
      /* setting status to false will prevent builders from creating their profile */
      this.authService.status = false;
      console.log('builder not verified: ',this.authService.getBuilderStatus());
      this.storage.get('onboarding').then((val) => {
        if(val == true)  {
          console.log('onboarding has already been seen: ',val);
          this.navCtrl.setRoot(LoginPage);
          
        }else {
           console.log('not seen', false);
           this.navCtrl.setRoot(OnboardingBuilderPage);
        }
      });
     
    }else {
     
       /* setting status to false will prevent builders from creating their profile */
       this.authService.status = true;
       console.log('Home owners status is always true: ',this.authService.getBuilderStatus()); 
       
      this.storage.get('homeOwner').then((val) => {
        if(val == true)  {
          console.log('onboard already been seen: ',val);
          this.navCtrl.setRoot(LoginPage);
          
        }else {
          console.log('on-boarding now');
           this.navCtrl.setRoot(OnboardingPage);
        }
      });
    }
   
  }

}
