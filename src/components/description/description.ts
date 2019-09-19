import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/**
 * Generated class for the DescriptionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'description',
  templateUrl: 'description.html'
})
export class DescriptionComponent {

  text: any = [];
  image;
  name;
  desc;
  length;
  height;
  width;

  constructor(public navParams: NavParams) {
    console.log('Hello DescriptionComponent Component');
    
    this.text.push( this.navParams.get('data'));
    
   
    

  }

}
