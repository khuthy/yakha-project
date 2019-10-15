import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Information } from '../../app/model/bricks';
import { Informations } from '../../app/model/bricks.model';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
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
  tsProperty = '';
  contactForm: FormGroup;
  appName = 'Yakha App';
  appVersion = 'Version 1.0';
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
  builder: boolean;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    public authService: AuthServiceProvider
    ) {
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
    this.builder = this.authService.manageUsers();
    console.log('User: ', this.builder);
    
    
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
  
  this.hideInfo();
  this.toastCtrl.create({
    message: 'Your message has successfully been sent',
    position: 'top'
  }).present();
}
activate(cmd) {
  switch (cmd) {
    case 'about':
      if (this.tsProperty == 'about'){
        this.tsProperty = ""
      }else{
        this.tsProperty = 'about';
      }
      break;
      case 'terms':
 if (this.tsProperty =='terms'){
  this.tsProperty =""
 }else{
  this.tsProperty = 'terms';
 }
        break;
        case 'contact':
          if (this.tsProperty =='contact'){
            this.tsProperty =''
          }else{
            this.tsProperty = 'contact';
          }
      break;
      case 'disclaimer':
        if (this.tsProperty == 'disclaimer'){
          this.tsProperty =''
        }else{
          this.tsProperty = 'disclaimer';
        }
      break;
      case 'safety':
        if (this.tsProperty =='safety'){
          this.tsProperty =''
        }else{
          this.tsProperty = 'safety';
        }
      break;
    default:
      break;
  }
 }

}
