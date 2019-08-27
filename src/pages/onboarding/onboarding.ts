import { LoginPage } from './../login/login';
import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
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
  @ViewChild('slides') slides: Slides

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider,private storage: Storage) {
    this.storage.get('onboarding').then(val => {
      if(val == 'checked')  {
        console.log(val);
        this.navCtrl.setRoot(WelcomePage);
        
      }else {
        this.navCtrl.setRoot(OnboardingPage);
      }
      
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingPage');
  }

  /* navigate page  */
  nextslides(){
    this.slides.slideNext();
  }
  gotoWelcome(){
  // set a key/value
  this.storage.set('onboarding', 'checked');
  this.navCtrl.setRoot(WelcomePage);
  }
  // Or to get a key/value pair


//  predefinedUser(val) {
//     this.authService.predefined = val;

//     this.navCtrl.setRoot(LoginPage);
//  }

// }
}