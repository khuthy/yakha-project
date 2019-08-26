import { Injectable } from '@angular/core';
import * as firebase from 'firebase';


/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  user;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  profileImage ='';
  setUser(val){
    this.user = val;
    console.log('User form Provider', this.user);
  }
  getUser(){
    return this.user;
  }

 
  auth: any;
  constructor() {}
  
  loginUser(email: string,password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
​
  signupUser(email: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUserCredential: firebase.auth.UserCredential) => {
        firebase.firestore().doc(`/User/${newUserCredential.user.uid}`).set({ email });
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }
​
  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }
​
  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

}
