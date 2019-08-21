
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the AddBricklayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-bricklayer',
  templateUrl: 'add-bricklayer.html',
})
export class AddBricklayerPage {
 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  //  console.log('ionViewDidLoad AddBricklayerPage');
  }
  // addPlace(value: {title: string}){
  //   this.placesService.addPlaces(value);
  //   this.navCtrl.pop();
  // }
}
