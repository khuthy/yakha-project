import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  contactForm: FormGroup;

  contact =  {
    username: '',
    email: firebase.auth().currentUser.email,
    message: '',
    date : ''
  }
  dbContact = firebase.firestore().collection('feedback');
  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
     
    ],
    
    'email': [
      { type: 'required', message: 'Email address is required.' },
      {type: 'pattern', message: 'Email address is not valid'}
    ],
    'message': [
      { type: 'required', message: 'Message is required.' },
      {type: 'maxlength', message: 'Your message is too long'}
    ],
  };
  feedMsg=[];
  data;
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      username: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
     
      email: new  FormControl('', Validators.compose([Validators.required, Validators.email])),
      message: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)]))
    });
    this.dbContact.onSnapshot((res)=>{
      res.forEach((doc)=>{
        this.feedMsg.push(doc.data());
        this.data = doc.data().message;
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }
sendMessage(){
  this.dbContact.add({
    name: this.contact.username,
    email: this.contact.email,
    message: this.contact.message,
    date: Date()
  })
  
}
}
