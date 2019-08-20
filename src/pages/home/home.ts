import { VersionPage } from './../version/version';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  add(){
    this.navCtrl.push(VersionPage);
  }
}
