import { BaccountSetupPage } from './../pages/baccount-setup/baccount-setup';
import { ProfileHomeOwnerPage } from './../pages/profile-home-owner/profile-home-owner';
import { BuilderProfileviewPage } from './../pages/builder-profileview/builder-profileview';
import { ForgotPasswordPage } from './../pages/forgot-password/forgot-password';
import { VersionPage } from './../pages/version/version';
import { SharePage } from './../pages/share/share';
import { FeedbackPage } from './../pages/feedback/feedback';
import { HelpPage } from './../pages/help/help';
import { MessagesPage } from './../pages/messages/messages';
import { HomeOwnerProfilePage } from './../pages/home-owner-profile/home-owner-profile';
import { AccountSetupPage } from './../pages/account-setup/account-setup';
import { OnboardingPage } from './../pages/onboarding/onboarding';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { QuotationFormPage } from '../pages/quotation-form/quotation-form';


@NgModule({
  declarations: [
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
    BuilderProfileviewPage,
    QuotationFormPage,
    ProfileHomeOwnerPage,
    BaccountSetupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
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
    BuilderProfileviewPage,
    QuotationFormPage,
    ProfileHomeOwnerPage,
    BaccountSetupPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider
  ]
})
export class AppModule {}
