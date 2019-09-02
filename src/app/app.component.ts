import { BaccountSetupPage } from './../pages/baccount-setup/baccount-setup';
import { VersionPage } from './../pages/version/version';
import { SharePage } from './../pages/share/share';
import { FeedbackPage } from './../pages/feedback/feedback';
import { HelpPage } from './../pages/help/help';
import { MessagesPage } from './../pages/messages/messages';
import { ProfileHomeOwnerPage } from './../pages/profile-home-owner/profile-home-owner';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import * as firebase from 'firebase/app';
import { firebaseConfig } from './app.firebase.config';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { SignoutPage } from '../pages/signout/signout';
import { OnboardingPage } from '../pages/onboarding/onboarding';
import { WelcomePage } from '../pages/welcome/welcome';
import { BricklayerlandingPage } from '../pages/bricklayerlanding/bricklayerlanding';
import { AccountSetupPage } from '../pages/account-setup/account-setup';
import { VerifyemailPage } from '../pages/verifyemail/verifyemail';
import { SuccessPage } from '../pages/success/success';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any ;
  db: any;
  predefined: string;
  pages: Array<{title: string, component: any, icon: string}>;


  userLoggedinNow = {
    fullname: '',
    email: '',
    isProfile: false,
    image: ''
  }
  

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
   firebase.initializeApp(firebaseConfig);
   this.db = firebase.firestore();
   this.authState();
   console.log('im here');
   console.log(this.predefined);
   
   
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'View profile', component: ProfileHomeOwnerPage, icon: 'person' },
      { title: 'Messages', component:MessagesPage, icon: 'mail' },
      { title: 'Help', component: HelpPage, icon: 'help' },
      { title: 'Feedback', component: FeedbackPage, icon: 'paper'},
      { title: 'Share', component: SuccessPage, icon: 'share' },
      { title: 'Version', component: VersionPage, icon: 'information-circle'}
     ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
     // this.rootPage = HomePage;
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  authState(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(user)
      {
         // create a reference to the collection of users...
         
            let userLoggedIn = this.db.doc(`/User/${user.uid}`);
     

     userLoggedIn.get().then(getuserLoggedIn => {
      
      let homeOwner = this.db.collection('HomeOwnerProfile').where("uid", "==", user.uid);
      let homeBuilders = this.db.collection('builderProfile').where("uid", "==", user.uid);
         
      console.log(getuserLoggedIn.data().userType);
         this.predefined = getuserLoggedIn.data().userType;

         if(this.predefined == "Homebuilder") {
          if(user.emailVerified === true) {
            homeBuilders.get().then(homeBuilderInfo => {
              if(homeBuilderInfo.empty) {
                this.rootPage = BaccountSetupPage;
              }else {
                
                        this.rootPage = HomePage;
                        
                          homeBuilderInfo.forEach(doc => {
                              this.userLoggedinNow.fullname = doc.data().fullName;
                              this.userLoggedinNow.image = doc.data().bricklayerImage;
                              this.userLoggedinNow.email = user.email;
                              this.userLoggedinNow.isProfile = true;
                            });
                
                
              }
            });
          }else {
            this.rootPage = VerifyemailPage;
          }
         
      }else {
        if(user.emailVerified === true) { 
          homeOwner.get().then(homeOwnerInfo => {
            if(homeOwnerInfo.empty) {
              this.rootPage = AccountSetupPage;
            }else {
              
                this.rootPage = HomePage;
              homeOwnerInfo.forEach(doc => {
                  this.userLoggedinNow.fullname = doc.data().fullname;
                  this.userLoggedinNow.image = doc.data().ownerImage;
                  this.userLoggedinNow.email = user.email;
                  this.userLoggedinNow.isProfile = true;
                });
             
                
                }
          });
        }else {
          this.rootPage = VerifyemailPage;
        }
        
      }   
     });
     
   
        
    
    } else {
        
        this.rootPage = OnboardingPage;
      }
    })
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
  SignOut() {
    firebase.auth().signOut().then(() => {
      console.log('Signed Out');
      this.rootPage = LoginPage;
      
    }).catch((err) => {
      console.log('error occured while signing out');

    })
  }
  viewProfile() {
    alert('hey, whatupp!')
  }
}
