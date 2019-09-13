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
    uid:'',
    startDate:'',
    endDate:'',
    extras:[],
    wallType:'',
    brickType:'',
    houseImage:'',
    comment:'',
    hOwnerPhone: 0,
    email: firebase.auth().currentUser.email,
    date:Date(),
    builderUID: '',
    doc:'',
    response_date:'',
    createBy:'', 
    ownerAddress:'',
    ownerName:''
  };
  docID;
 date: any;
 
 extras:any = [
  {service: 'Roofing', price: 0, quantity: 0 }, 
  {service: 'Doors', price: 0, quantity: 0 }, 
  {service: 'Windows', price: 0, quantity: 0 },
  {service: 'Electricity', price: 0, quantity: 0 },
  {service: 'Plumbing', price: 0, quantity: 0 },
  {service: 'Ceiling', price: 0, quantity: 0 },
  {service: 'Pluster', price: 0, quantity: 0 },
];

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
'extras': [ {
type: 'required', message: 'Please include some features'
}],

'comment': [ {type: 'required', message: 'Additional comments is required.'},
            {type: 'maxlength', message: 'Additional comments must be 200 characters'}
          ]
};
extraName;

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
      this.HomeOwnerQuotation.builderUID = this.navParams.data;
      this.quotationForm = this.formBuilder.group({
        // fullName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
        startDate:new  FormControl('', Validators.compose([Validators.required])),
        endDate:new  FormControl('', Validators.compose([Validators.required])),
        wallType: new  FormControl('', Validators.compose([Validators.required])),
        brickType:new  FormControl('', Validators.compose([Validators.required])),
        extras: new  FormControl('', Validators.compose([Validators.required])),
        comment:new  FormControl('', Validators.compose([Validators.required,Validators.maxLength(200)])),
      });
      firebase.firestore().collection('HomeOwnerProfile').where('uid','==',firebase.auth().currentUser.uid).get().then((resp)=>{
        resp.forEach((doc)=>{
          this.HomeOwnerQuotation.hOwnerPhone = doc.data().personalNumber;
          this.HomeOwnerQuotation.ownerAddress = doc.data().ownerAddress;
          this.HomeOwnerQuotation.ownerName = doc.data().fullname;
        })
      })
     
      
      let date = new Date();
      let days = date.getDay();
      let month = date.getMonth();
      let year = date.getFullYear();
      this.date = year + '-' + month + '-' + days;
    }

  ionViewDidLoad() {
 
    console.log(this.extras);
    
    //let arr = [{objExtra, objPrice, objQuantity}]
   
    
   // firebase.database().ref().child('hotels').
   // this.extras = firebase.firestore().collection('extras')
    console.log(this.uid);
   // this. HomeOwnerQuotation.uid = this.authUser.getUser().uid;
  this.authUser.getUser();
  console.log(this.authUser.getUser());
  }
next(){
  this.navCtrl.push(SuccessPage);
}
// selectAll(){
// this.extras =["roofing", "doors", "windows", "framing", "electricity", "Plumbing", "ceiling", "plaster"];
// }
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
  //  if(!quotationForm.valid) {
  //     console.log('Please fill all the form fields', quotationForm.value)
  //  }else {
  //     // load the profile creation process
  //     const load = this.loadCtrl.create({
  //       content: 'submitting quotations ..'
  //     });
  //     load.present();
  // const user = this.db.collection('HomeOwnerQuotation').add(this.HomeOwnerQuotation);
  
  // // upon success...
  // user.then( () => {
  //   this.navCtrl.setRoot(SuccessPage)
  //   this.toastCtrl.create({
  //     message: '  Quotation submitted.',
  //     duration: 2000,
  //   }).present();
  //   // ...get the profile that just got created...
  //   load.dismiss();
  //   // catch any errors.
  // }).catch( err=> {
  //   this.toastCtrl.create({
  //     message: 'Error submitting Quotation.',
  //     duration: 2000
  //   }).present();
  //   this.isProfile = false;
  //   load.dismiss();
  // })

  //  }
     // console.log(this.HomeOwnerQuotation.extras);
     let obj = [];
     obj.push(this.HomeOwnerQuotation.extras);
     firebase.firestore().collection('Array').doc('testing').set({obj}).then((res)=>{
    //   console.log(res.update());
       
     })
        
  }
  remove(){
    this.houseImage = "";
  }

  

}
