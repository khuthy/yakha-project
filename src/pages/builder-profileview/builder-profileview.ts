import { QuotationFormPage } from './../quotation-form/quotation-form';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the BuilderProfileviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-builder-profileview',
  templateUrl: 'builder-profileview.html',
})
export class BuilderProfileviewPage {
  isProfile = false;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  uid
  profileImage
  displayProfile;
  experiences: any = ['1','2','3','4','5','6','7','8','9','10','11'];
   
  dat = {} as builderProfile

 constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtlr:LoadingController,private authUser:AuthServiceProvider) {
  this.dat.uid = 

  this.dat = this.navParams.data;
  console.log('jjj ', this.dat);

  
    }
  
    ionViewDidLoad() {
    
      console.log(this.uid);
      
    }
next(){
  this.navCtrl.push(QuotationFormPage);
}

editProfile(){
  this.isProfile = false;
}

}
export interface builderProfile  {
  uid: '',
 bricklayerImage:'',
 fullName: '',
 certified: false,
 experiences: '',
 address:'',
 price:'',
 location:''
}