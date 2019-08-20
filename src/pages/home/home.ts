import { BuilderProfileviewPage } from './../builder-profileview/builder-profileview';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
//viewmore
next(){
  this.navCtrl.push(BuilderProfileviewPage);
}
}
