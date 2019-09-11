import { OnboardingBuilderPage } from './../pages/onboarding-builder/onboarding-builder';
import { Keyboard } from '@ionic-native/keyboard';
/* import { GoogleMapsComponent } from './../components/google-maps/google-maps'; */
import { HttpClient } from '@angular/common/http';
import { PlacePage } from './../pages/place/place';
import { AddBricklayerPage } from './../pages/add-bricklayer/add-bricklayer';
import { BaccountSetupPage } from './../pages/baccount-setup/baccount-setup';

import { BuilderProfileviewPage } from './../pages/builder-profileview/builder-profileview';
import { ForgotPasswordPage } from './../pages/forgot-password/forgot-password';
import { VersionPage } from './../pages/version/version';
import { SharePage } from './../pages/share/share';
import { FeedbackPage } from './../pages/feedback/feedback';
import { HelpPage } from './../pages/help/help';
import { MessagesPage } from './../pages/messages/messages';
import { HomeOwnerProfilePage } from './../pages/home-owner-profile/home-owner-profile';
import { AccountSetupPage} from './../pages/account-setup/account-setup';
import { OnboardingPage } from './../pages/onboarding/onboarding';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

/* import { StatusBar } from '@ionic-native/status-bar'; */
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Camera } from '@ionic-native/camera';
import { SignoutPage } from '../pages/signout/signout';

import { QuotationFormPage } from '../pages/quotation-form/quotation-form';
import { SuccessPage } from '../pages/success/success';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewPlacesPage } from '../pages/new-places/new-places';
import { HttpClientModule, /* other http imports */ } from "@angular/common/http";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { WelcomePage } from '../pages/welcome/welcome';
import { BricklayerlandingPage } from '../pages/bricklayerlanding/bricklayerlanding';
import { ViewmessagePage } from '../pages/viewmessage/viewmessage';
import { IonicStorageModule } from '@ionic/storage';
import { VerifyemailPage } from '../pages/verifyemail/verifyemail';
import { BuilderquotesPage } from '../pages/builderquotes/builderquotes';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    SignoutPage,
    OnboardingPage,
    AccountSetupPage,
    HomeOwnerProfilePage,
    MessagesPage,
    HelpPage,
    FeedbackPage,
    SharePage,
    VersionPage,
    ForgotPasswordPage,
    BuilderProfileviewPage,
    QuotationFormPage,
    BaccountSetupPage,
    SuccessPage,
    AddBricklayerPage,
    NewPlacesPage,
    PlacePage,
    BricklayerlandingPage,
    WelcomePage,
    ViewmessagePage,
    VerifyemailPage,
    BuilderquotesPage,
    OnboardingBuilderPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    GooglePlaceModule,
    
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    } ),

    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    OnboardingPage,
    AccountSetupPage,
    HomeOwnerProfilePage,
    MessagesPage,
    HelpPage,
    FeedbackPage,
    SharePage,
    VersionPage,
    ForgotPasswordPage,
    SignoutPage,
    BuilderProfileviewPage,
    QuotationFormPage,
    BaccountSetupPage,
    SuccessPage,
    AddBricklayerPage,
    NewPlacesPage,
    PlacePage,
    BricklayerlandingPage,
    WelcomePage,
    ViewmessagePage,
    VerifyemailPage,
    BuilderquotesPage,
    OnboardingBuilderPage


  ],
  providers: [
   /*  StatusBar, */
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    AuthServiceProvider,
    Camera,
    Geolocation,
    File,
    FileOpener,
    CallNumber,
    Keyboard,

  ]
})

export class AppModule {}
