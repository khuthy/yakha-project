import { LoginPage } from './../login/login';
import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the OnboardingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
 @ViewChild('myslider') slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingPage');
  }

  /* navigate page  */
  nextslides() {
   this.slides.slideNext();
  }
  gotoWelcome(){
    this.navCtrl.push(WelcomePage);
  }


 predefinedUser(val) {
    this.authService.predefined = val;
    this.navCtrl.setRoot(LoginPage);
 }

}
