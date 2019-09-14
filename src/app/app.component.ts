import { BaccountSetupPage } from './../pages/baccount-setup/baccount-setup';
import { VersionPage } from './../pages/version/version';
import { SharePage } from './../pages/share/share';
import { FeedbackPage } from './../pages/feedback/feedback';
import { HelpPage } from './../pages/help/help';
import { MessagesPage } from './../pages/messages/messages';

import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
/* import { StatusBar } from '@ionic-native/status-bar'; */
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
    image: ''
  }
  

  constructor(public platform: Platform, /* public statusBar: StatusBar, */ public splashScreen: SplashScreen) {
    this.initializeApp();
   firebase.initializeApp(firebaseConfig);
   this.db = firebase.firestore();
    //console.log('im here');
   //const messaging = firebase.messaging();
   //console.log(messaging.getToken());
  
  
   /* auth guards */
   firebase.auth().onAuthStateChanged((user)=>{
    if(user)
    {
       // create a reference to the collection of users...
       //console.log('user is logged in: '+ user.uid);
       
          let userLoggedIn = this.db.doc(`/User/${user.uid}`);
   

   userLoggedIn.onSnapshot(getuserLoggedIn => {
    
    let homeOwner = this.db.collection('HomeOwnerProfile').where("uid", "==", user.uid);
    let homeBuilders = this.db.collection('builderProfile').where("uid", "==", user.uid);
       
          
       
       console.log(getuserLoggedIn.data().userType);
       
       
       if(getuserLoggedIn.data().userType == "Homebuilder") {
       
        // Notification.requestPermission().then((permission) => {
        //   if (permission === 'granted') {
        //     console.log('Notification permission granted.');
        //     // TODO(developer): Retrieve an Instance ID token for use with FCM.
        //     // ...
        //    // console.log(messaging.getToken());
            
        //   } else {
        //     console.log('Unable to get permission to notify.');
        //   }
        // });   
          homeBuilders.onSnapshot(homeBuilderInfo => {

            if(homeBuilderInfo.empty) {
              this.rootPage = BaccountSetupPage;
            
            }else {
              
                      this.rootPage = HomePage;
                      
                        homeBuilderInfo.forEach(doc => {
                            this.userLoggedinNow.fullname = doc.data().fullName;
                            this.userLoggedinNow.image = doc.data().bricklayerImage;
                            this.userLoggedinNow.email = user.email;
                           
                          });

                  /* home builder side menu content */
                  this.pages = [
                    { title: 'Home', component: HomePage, icon: 'home' },
                    { title: 'View profile', component: BaccountSetupPage, icon: 'person' },
                    // { title: 'Contact Us', component: HelpPage, icon: 'mail' },
                    { title: 'Version', component: VersionPage, icon: 'information-circle' },
                   ];
            }
          });
        
       
    }else {
     
        homeOwner.onSnapshot(homeOwnerInfo => {
          if(homeOwnerInfo.empty) {
            this.rootPage = AccountSetupPage;
          }else {
            
              this.rootPage = HomePage;
            homeOwnerInfo.forEach(doc => {
                this.userLoggedinNow.fullname = doc.data().fullname;
                this.userLoggedinNow.image = doc.data().ownerImage;
                this.userLoggedinNow.email = user.email;
                
              });
              /* Side menu content for home owner */

              this.pages = [
                { title: 'Home', component: HomePage, icon: 'home' },
                { title: 'View profile', component: AccountSetupPage, icon: 'person' },
                { title: 'Messages', component:MessagesPage, icon: 'mail' },
                { title: 'Help', component: HelpPage, icon: 'help' },
                { title: 'Feedback', component: FeedbackPage, icon: 'paper'},
                { title: 'Version', component: VersionPage, icon: 'information-circle'}
               ];
              }
        });
    }   
   });
  } else {
      
      this.rootPage = WelcomePage;
      console.log('user is logged out');
      
    }
  })
    
   /* auth guards */

  }

  initializeApp() {
    this.platform.ready().then(() => {
     // this.rootPage = HomePage;
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  authState(){
    
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
