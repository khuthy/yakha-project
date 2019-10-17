import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the SuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {
  loaderAnimate = true;
  success = 'Success';
  builder;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      
      this.loaderAnimate = false
    }, 2000);
    console.log('ionViewDidLoad SuccessPage');
   this.builder = this.authService.manageUsers();
   console.log(this.builder, 'builder');
   
  }
  gonext(){
    this.navCtrl.push(SuccessPage);
  }
  complete() {
    this.navCtrl.setRoot(HomePage);
  }

}
