import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Information } from '../../app/model/bricks';
import { Informations } from '../../app/model/bricks.model';
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
  information: Information[] = Informations;
  toggle: boolean = false;
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
  form: boolean;
  describe: string;
  info: string;
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

  showDetails(i) {
    this.toggle = !this.toggle;
    this.info = this.information[i].info;
    this.describe = this.information[i].description;
    this.form = this.information[i].form;
    
  }
  hideInfo() {
    this.toggle = false;
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
