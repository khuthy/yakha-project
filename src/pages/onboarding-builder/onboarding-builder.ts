import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, MenuController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';
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
      if(val == true)  {
        console.log(val);
        this.navCtrl.setRoot(LoginPage);
        
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
  getStarted(){
  // set a key/value
  this.storage.set('onboarding', true);
  this.navCtrl.setRoot(LoginPage);
  }

  skip() {
    this.navCtrl.setRoot(LoginPage);
    this.storage.set('onboarding', true);

  }

}
