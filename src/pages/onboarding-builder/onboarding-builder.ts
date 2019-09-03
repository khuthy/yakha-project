import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, MenuController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
import { RegisterPage } from '../register/register';
/**
 * Generated class for the OnboardingBuilderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onboarding-builder',
  templateUrl: 'onboarding-builder.html',
})
export class OnboardingBuilderPage {
@ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,  private authService: AuthServiceProvider,private storage: Storage, private menuCtrl: MenuController) {
    this.storage.get('onboarding').then(val => {
      if(val == 'checkedf')  {
        console.log(val);
        this.navCtrl.setRoot(WelcomePage);
        
      }else {
        console.log('on-boarding now');
        
      }
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingBuilderPage');
  }
  ionViewWillEnter(){
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave(){
    this.menuCtrl.swipeEnable(false);
  }

  /* navigate page  */
  nextslides(){
    this.slides.slideNext();
  }
  
  register(){
    this.navCtrl.push(RegisterPage);
  }
  gotoWelcome(){
  // set a key/value
  this.storage.set('onboarding', 'checked');
  this.navCtrl.setRoot(WelcomePage);
  }

}
