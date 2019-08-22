import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { SuccessPage } from '../success/success';
import * as firebase from 'firebase'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UserProvider } from '../../providers/user/user';
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
  profileImage
  quotationForm : FormGroup;
  uploadprogress = 0;
  isuploading: false
  displayProfile;
  HomeOwnerQuotation = {
    dateSubmitted:'',
    startDate:'',
    endDate:'',
    Height: '',
    length:'',
    width:'',
    wallType:'',
    brickType:'',
    uid: '',
    houseImage:'',
    comment:'',
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
      this.HomeOwnerQuotation.uid = this.uid;
      this.quotationForm = this.formBuilder.group({
        // fullName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
       
       
        
        startDate:'',
        endDate:'',
        wallType: new  FormControl('', Validators.compose([Validators.required])),
        brickType:[''],
        Height: [''],
        length:[''],
        width:[''],
        comment:[''],
      });
    }
  
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotationFormPage');
    this. HomeOwnerQuotation.uid = this.authUser.getUser().uid;

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
    this.profileImage = image;
    let file = 'HomeOwner-Profile/' + this.authUser.getUser() + '.jpg';
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
async createprofile(quotationForm: FormGroup): Promise<void> {
  if (!quotationForm.valid) {
    console.log(
      'Need to complete the form, current value: ',
      quotationForm.value
    );
  } else {
         // load the profile creation process
         const load = this.loadCtrl.create({
          content: 'Creating Profile..'
        });
        load.present();
    const user = this.db.collection('HomeOwnerQuotation').doc(this.authUser.getUser()).set(this.HomeOwnerQuotation);
    
    // upon success...
    user.then( () => {
      this.navCtrl.setRoot(MessagesPage)
      this.toastCtrl.create({
        message: '  Quotaion submitted.',
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
}
