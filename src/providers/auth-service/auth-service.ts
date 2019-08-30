import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

/*
 Generated class for the AuthServiceProvider provider.
 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
 db = firebase.firestore();
 user;
 predefined: string;

 public userProfile: firebase.firestore.DocumentReference;
 constructor() {}

 manageUsers() {
   return this.predefined;
 }
 loginUser(email: string,password: string): Promise<firebase.auth.UserCredential> {
   return firebase.auth().signInWithEmailAndPassword(email, password);
 }
 signupUser(email: string, password: string): Promise<any> {
   return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUserCredential: firebase.auth.UserCredential) => {
       firebase.firestore().doc(`/User/${newUserCredential.user.uid}`).set({ email, userType: this.predefined, status: false });
       this.setUser(newUserCredential);
     })
     .catch(error => {
       console.error(error);
       throw new Error(error);
     });
 }
 resetPassword(email: string): Promise<void> {
   return firebase.auth().sendPasswordResetEmail(email);
 }
 logoutUser(): Promise<void> {
   return firebase.auth().signOut();
 }
setUser(val){
 this.user = val;
   console.log('User form Provider', this.user);
}
getUser(){
 return this.user;
}
}
