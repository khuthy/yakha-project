import { HomePage } from './../pages/home/home';
import { TestPage } from './../pages/test/test';
import { BaccountSetupPage } from './../pages/baccount-setup/baccount-setup';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

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
import { OneSignal } from '@ionic-native/onesignal';
import { ChannelsPage } from '../pages/channels/channels';
//import { OneSignal } from '@ionic-native/onesignal';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


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
    image: '',
    builder: false,
  }

  version = 'v1.0.0';
  messages = 0
  token: string;

  constructor(public platform: Platform, private screenOrientation: ScreenOrientation, public splashScreen: SplashScreen, private statusBar: StatusBar,public oneSignal: OneSignal,
    public alert: AlertController) {
    
      this.statusBar.overlaysWebView(false); 
  
      // set status bar to white

    this.initializeApp();
    firebase.initializeApp(firebaseConfig);
    this.db =firebase.firestore();
    // oneSignal.startInit(this.signal_app_id, this.firebase_id);
    // // oneSignal.getIds().then((userID) => {
    // //   console.log(userID.userId);
      
    // // })
    //    oneSignal.inFocusDisplaying(oneSignal.OSInFocusDisplayOption.InAppAlert);
    //   oneSignal.handleNotificationReceived().subscribe((res) => {
    
    //   })
    //   oneSignal.handleNotificationOpened().subscribe((res) => {
      
    //   })
    //   oneSignal.endInit();

    

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.statusBar.backgroundColorByHexString('#203550');
      this.splashScreen.hide();
         if (this.platform.is('cordova')) {
         this.setupPush();
      
        
    }
    this.db.collection('Users');
    firebase.auth().onAuthStateChanged((user) => {
     
      if (user) {
        firebase.firestore().collection('Users').doc(user.uid).onSnapshot((profile) => {
          
          
          
          if (profile.exists) {
            firebase.firestore().collection('Request').where('hOwnerUid', '==', firebase.auth().currentUser.uid).onSnapshot((request)=>{
              if(!request.empty) {
                request.forEach(list => {
                  firebase.firestore().collection('Respond').doc(list.id).onSnapshot(res => {
                    if(res.exists) {
                      if(res.data().viewed == false) {
                        this.messages = res.data.length;
                      }
                     
                    }
                    })
                });
              }
            })
      
            
         //   firebase.firestore().collection('Users').doc(user.uid).update({tokenID: this.token})
            if (profile.data().isProfile == true && profile.data().status == true) {
              if (profile.data().builder == true) {
                this.rootPage = HomePage;
                this.userLoggedinNow.image = profile.data().image
                this.userLoggedinNow.fullname = profile.data().fullName
                this.userLoggedinNow.email = user.email;
                this.userLoggedinNow.builder = profile.data().builder;
                this.pages = [
                  { title: 'View Profile', component: BaccountSetupPage, icon: 'ios-person' },
                  { title: 'Tips', component: FeedbackPage, icon: 'information-circle' },
                  { title: 'Help', component: VersionPage, icon: 'help' }

                ];
              } else {
                this.rootPage = HomePage;
                this.pages = [
                  { title: 'View Profile', component: AccountSetupPage, icon: 'ios-person' },
                  { title: 'Messages', component: ChannelsPage, icon: 'chatbubbles' },
                  { title: 'Tips', component: FeedbackPage, icon: 'information-circle' },
                  { title: 'Help', component: HelpPage, icon: 'help' }
                ];
                this.userLoggedinNow.image = profile.data().image
                this.userLoggedinNow.fullname = profile.data().fullName
                this.userLoggedinNow.email = user.email;
                this.userLoggedinNow.builder = false;
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
    });
  }
  exit(){
    let alert = this.alert.create({
      title: 'Confirm',
      message: 'Do you want to exit?',
      buttons: [{
        text: "Exit",
        handler: () => { this.exitApp() }
      }, {
        text: "Cancel",
        role: 'cancel'
      }]
    })
    alert.present();
}
exitApp(){
  this.platform.exitApp();
}
  setupPush(){
    
      this.oneSignal.startInit(this.signal_app_id, this.firebase_id);
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      this.oneSignal.handleNotificationReceived().subscribe((res) => {
    })
      this.oneSignal.handleNotificationOpened().subscribe((res) => {
      
      })
      this.oneSignal.getIds().then((token)=>{
        this.token = token.userId;
      })
      this.oneSignal.endInit();
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
