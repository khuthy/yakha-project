import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profile',
  templateUrl: 'profile.html'
})
export class ProfileComponent {

  image: string;

  constructor(public navParam: NavParams) {
    console.log('this.navParams.data');
    this.image = this.navParam.get('image');

  }

}
