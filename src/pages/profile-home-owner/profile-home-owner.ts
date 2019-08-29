import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the ProfileHomeOwnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-home-owner',
  templateUrl: 'profile-home-owner.html',
})
export class ProfileHomeOwnerPage {
  isProfile = false;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  displayProfile;
  profileImage
  uid
  HomeOwnerProfile = {
    ownerImage: '',
    fullname: '',
    email: '',
    personalNumber: '',
    About: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtlr:LoadingController,private authUser:AuthServiceProvider) {
this.uid = firebase.auth().currentUser.uid;
 this.HomeOwnerProfile.email = firebase.auth().currentUser.email;
this.authUser.setUser(this.uid);
  }

  ionViewDidLoad() {
  
    console.log(this.uid);

    let userLoggedIn = this.db.doc(`/User/${this.uid}`);
    userLoggedIn.get().then(getuserLoggedIn => {
     if(getuserLoggedIn.data().userType == "Homebuilder") {
     this.getBuilderProfile(); 
      }else {
   this.getProfile()
 }
})
   
    
  }
  getBuilderProfile(){
    // load the process
    let load = this.loadingCtlr.create({
      content: 'Just a sec...',
      spinner: 'bubbles'
    });
    load.present();
    // create a reference to the collection of users...
    let users = this.db.collection('builderProfile');
    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.uid);
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.displayProfile = doc.data();
          this. HomeOwnerProfile.About  = doc.data().About;
          // this.HomeOwnerProfile.email = doc.data().email
          this.HomeOwnerProfile.ownerImage  = doc.data().ownerImage;
          this.HomeOwnerProfile. fullname  = doc.data().fullname;
          this.HomeOwnerProfile.personalNumber  = doc.data().personalNumber
          
        })
        this.isProfile = true;
      } else {
        console.log('No data');
        this.isProfile = false;
      }
      // dismiss the loading
      load.dismiss();
    }).catch(err => {
      // catch any errors that occur with the query.
      console.log("Query Results: ", err);
      // dismiss the loading
      load.dismiss();
    })
  }
  getProfile(){
    // load the process
    let load = this.loadingCtlr.create({
      content: 'Just a sec...',
      spinner: 'bubbles'
    });
    load.present();
    // create a reference to the collection of users...
    let users = this.db.collection('HomeOwnerProfile');
    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.uid);
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.displayProfile = doc.data();
          this. HomeOwnerProfile.About  = doc.data().About;
          // this.HomeOwnerProfile.email = doc.data().email
          this.HomeOwnerProfile.ownerImage  = doc.data().ownerImage;
          this.HomeOwnerProfile. fullname  = doc.data().fullname;
          this.HomeOwnerProfile.personalNumber  = doc.data().personalNumber
          
        })
        this.isProfile = true;
      } else {
        console.log('No data');
        this.isProfile = false;
      }
      // dismiss the loading
      load.dismiss();
    }).catch(err => {
      // catch any errors that occur with the query.
      console.log("Query Results: ", err);
      // dismiss the loading
      load.dismiss();
    })
  }
  editProfile(){
    this.isProfile = false;
  }


}
