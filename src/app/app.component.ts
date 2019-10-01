import { BaccountSetupPage } from './../pages/baccount-setup/baccount-setup';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase/app';
import { firebaseConfig } from './app.firebase.config';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';

import { AccountSetupPage } from '../pages/account-setup/account-setup';
import { VersionPage } from '../pages/version/version';
import { MessagesPage } from '../pages/messages/messages';
import { HelpPage } from '../pages/help/help';
import { FeedbackPage } from '../pages/feedback/feedback';
import { StatusBar } from '@ionic-native/status-bar';
//import { OneSignal } from '@ionic-native/onesignal';
import { OneSignal } from '@ionic-native/onesignal';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  db: any;
  predefined: string;
  pages: Array<{ title: string, component: any, icon: string }>;
  signal_app_id: string = '66cc58ae-d53f-44a3-992d-749efc2cd702';
  firebase_id: string = '27383344134';
  userLoggedinNow = {
    fullname: '',
    email: '',
    image: ''
  }


  constructor(public platform: Platform, public splashScreen: SplashScreen, private statusBar: StatusBar, oneSignal: OneSignal) {
    
      this.statusBar.overlaysWebView(false); 
  
      // set status bar to white
  this.statusBar.backgroundColorByHexString('#28545c');
    
    this.initializeApp();
    firebase.initializeApp(firebaseConfig);
    oneSignal.startInit(this.signal_app_id, this.firebase_id);
    // oneSignal.getIds().then((userID) => {
    //   console.log(userID.userId);
      
    // })
       oneSignal.inFocusDisplaying(oneSignal.OSInFocusDisplayOption.InAppAlert);
    //   oneSignal.handleNotificationReceived().subscribe((res) => {
    
    //   })
    //   oneSignal.handleNotificationOpened().subscribe((res) => {
      
    //   })
      oneSignal.endInit();

    this.db = firebase.firestore().collection('Users');
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.db.doc(user.uid).onSnapshot((profile) => {
          if (profile.exists) {
            if (profile.data().isProfile == true && profile.data().status == true) {
              if (profile.data().builder == true) {
                this.rootPage = HomePage;
                this.userLoggedinNow.image = profile.data().image
                this.userLoggedinNow.fullname = profile.data().fullName
                this.userLoggedinNow.email = user.email;
                this.pages = [
                  { title: 'Home', component: HomePage, icon: 'home' },
                  { title: 'View Profile', component: BaccountSetupPage, icon: 'person' },
                  { title: 'Help', component: HelpPage, icon: 'help' },
                  { title: 'Feedback', component: FeedbackPage, icon: 'paper' },
                  { title: 'Version', component: VersionPage, icon: 'information-circle' }

                ];
              } else {
                this.rootPage = HomePage;
                this.pages = [
                  { title: 'Home', component: HomePage, icon: 'home' },
                  { title: 'View Profile', component: AccountSetupPage, icon: 'person' },
                  { title: 'Messages', component: MessagesPage, icon: 'mail' },
                  { title: 'Help', component: HelpPage, icon: 'help' },
                  { title: 'Feedback', component: FeedbackPage, icon: 'paper' },
                  { title: 'Version', component: VersionPage, icon: 'information-circle' },
                ];
                this.userLoggedinNow.image = profile.data().image
                this.userLoggedinNow.fullname = profile.data().fullName
                this.userLoggedinNow.email = user.email;
              }

            } else {
              if (profile.data().builder == true) {
                this.rootPage = BaccountSetupPage;
              } else {
                this.rootPage = AccountSetupPage;
              }

            }
          }
        })
      }
      else {
        this.rootPage = WelcomePage;
        console.log('User not logged in');

      }

    });


  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  openPage(page) {
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
    this.nav.push(AccountSetupPage);
  }
  viewProfileB() {
    this.nav.push(BaccountSetupPage);
  }
}
