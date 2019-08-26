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
import * as firebase from 'firebase';
import { firebaseConfig } from './app.firebase.config';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { SignoutPage } from '../pages/signout/signout';
import { OnboardingPage } from '../pages/onboarding/onboarding';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any ;


  pages: Array<{title: string, component: any, icon: string}>;



  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
firebase.initializeApp(firebaseConfig);
//this.authState();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'View profile', component: ProfileHomeOwnerPage, icon: 'person' },
      { title: 'Messages', component:MessagesPage, icon: 'mail' },
      { title: 'Help', component: HelpPage, icon: 'help' },
      { title: 'Feedback', component: FeedbackPage, icon: 'paper'},
      { title: 'Share', component: SharePage, icon: 'share' },
      { title: 'Version', component: VersionPage, icon: 'information-circle'}
     ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = HomePage;
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  authState(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(user.uid=null)
      {
        this.rootPage = HomePage;
      } else {
        this.rootPage = BaccountSetupPage;
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
