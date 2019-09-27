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


  constructor(public platform: Platform, public splashScreen: SplashScreen, oneSignal: OneSignal) {
    this.initializeApp();
    firebase.initializeApp(firebaseConfig);

    oneSignal.startInit(this.signal_app_id, this.firebase_id);
    oneSignal.getIds().then((userID) => {
      console.log("user ID ", userID);

    })
    oneSignal.inFocusDisplaying(oneSignal.OSInFocusDisplayOption.InAppAlert);

    oneSignal.handleNotificationReceived().subscribe((res) => {
      // do something when notification is received
      console.log(res);

    });


    oneSignal.handleNotificationOpened().subscribe((res) => {
      // do something when a notification is opened
      console.log(res);
    });

    oneSignal.endInit();

    // this.fireb.getToken()
    // .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
    // .catch(error => console.error('Error getting token', error));

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
                  { title: 'Version', component: VersionPage, icon: 'information-circle' },
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
