import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { SuccessPage } from '../success/success';
import * as firebase from 'firebase'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MessagesPage } from '../messages/messages';

/**
 * Generated class for the QuotationFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quotation-form',
  templateUrl: 'quotation-form.html',
})
export class QuotationFormPage {
  isProfile = false;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  
  uid
  houseImage
  quotationForm : FormGroup;
  uploadprogress = 0;
  isuploading: false
  displayQuation;
  HomeOwnerQuotation = {
    dateSubmitted:'',
    startDate:'',
    endDate:'',
    height: '',
    length:'',
    width:'',
    wallType:'',
    brickType:'',
    houseImage:'',
    comment:'',
      
  };

 date: any;
/* validations starts here */
validation_messages = {
  'startDate': [
    { type: 'required', message: 'Start date is required.' }
  ],
  'endDate': [
    { type: 'required', message: 'End date is required.' }
  ],
'wallType': [ {
    type: 'required', message: 'Wall type is required'
  }],
'brickType': [ {
type: 'required', message: 'Brick type is required.'
}],
'Height': [ {
type: 'required', message: 'Height is required.'
}],
'length': [ {
type: 'required', message: 'Length is required.'
}],
'width': [ {
type: 'required', message: 'Width is required.'
}],
'comment': [ {type: 'required', message: 'Additional comments is required.'},
            {type: 'maxlength', message: 'Additional comments must be 200 characters'}
          ]
};
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private authUser: AuthServiceProvider,
     public toastCtrl:ToastController,
     public loadCtrl:LoadingController,
     public alertCtrl:AlertController,
     public camera: Camera,
     
     private formBuilder: FormBuilder) {
      this.uid = firebase.auth().currentUser.uid;
      this.authUser.setUser(this.uid);
      // this.HomeOwnerQuotation.uid = this.uid;
      this.quotationForm = this.formBuilder.group({
        // fullName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
        startDate:new  FormControl('', Validators.compose([Validators.required])),
        endDate:new  FormControl('', Validators.compose([Validators.required])),
        wallType: new  FormControl('', Validators.compose([Validators.required])),
        brickType:new  FormControl('', Validators.compose([Validators.required])),
        Height: new  FormControl('', Validators.compose([Validators.required])),
        length:new  FormControl('', Validators.compose([Validators.required])),
        width:new  FormControl('', Validators.compose([Validators.required])),
        comment:new  FormControl('', Validators.compose([Validators.required,Validators.maxLength(200)])),
      });

      let date = new Date();
      let days = date.getDay();
      let month = date.getMonth();
      let year = date.getFullYear();
      this.date = year + '-' + month + '-' + days;

     
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotationFormPage');
   // this. HomeOwnerQuotation.uid = this.authUser.getUser().uid;
this.authUser.getUser();
console.log('user ',this.authUser.getUser() );

  }
next(){
  this.navCtrl.push(SuccessPage);
}
async selectImage() {
  let option: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  }
  await this.camera.getPicture(option).then(res => {
    console.log(res);
    const image =`data:image/jpeg;base64,${res}` ;
    this.houseImage = image;
    let file = 'QuatationForm/' + this.authUser.getUser() + '.jpg';
    const UserImage = this.storage.child(file);
    const upload = UserImage.putString(image, 'data_url');
    upload.on('state_changed', snapshot => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.uploadprogress = progress;
      if (progress == 100) {
        this.isuploading = false;
      }
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(downUrl => {
        this.HomeOwnerQuotation.houseImage = downUrl;
        console.log('Image downUrl', downUrl);
      })
    })
  }, err => {
    console.log("Something went wrong: ", err);
  })
}
async createQuations(quotationForm: FormGroup): Promise<void> {
   if(!quotationForm.valid) {
      console.log('Please fill all the form fields', quotationForm.value)
   }else {
      // load the profile creation process
      const load = this.loadCtrl.create({
        content: 'submitting quotations ..'
      });
      load.present();
  const user = this.db.collection('HomeOwnerQuotation').doc(this.authUser.getUser()).set(this.HomeOwnerQuotation);
  
  // upon success...
  user.then( () => {
    this.navCtrl.setRoot(SuccessPage)
    this.toastCtrl.create({
      message: '  Quotation submitted.',
      duration: 2000,
    }).present();
    // ...get the profile that just got created...
    load.dismiss();
    // catch any errors.
  }).catch( err=> {
    this.toastCtrl.create({
      message: 'Error submitting Quotation.',
      duration: 2000
    }).present();
    this.isProfile = false;
    load.dismiss();
  })

   }
        
  }
  remove(){
    this.houseImage = "";
  }

}
