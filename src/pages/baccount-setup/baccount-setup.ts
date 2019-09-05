import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, MenuController } from 'ionic-angular';
import * as firebase from 'firebase'
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { BricklayerlandingPage } from '../bricklayerlanding/bricklayerlanding';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { HomePage } from '../home/home';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';

/**
 * Generated class for the BaccountSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-baccount-setup',
  templateUrl: 'baccount-setup.html',
})
export class BaccountSetupPage {
  isProfile = false;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  uid;
  icon: string;
  profileImage: any = "../../assets/imgs/team-avatar.jpg";
  profileForm : FormGroup;
  uploadprogress = 0;
  isuploading: false
  displayProfile = [];
 // email = 
  experiences: any = ['1','2','3','4','5','6','7','8','9','10','11'];
  builderProfile = {
  uid: '',
   bricklayerImage:'',
   fullName:'',
   certified: false,
   experiences: '',
   address:null,
   price:'',
   lng: null,
   lat: null,
   
   email: firebase.auth().currentUser.email,
   date:Date()

 }
 @ViewChild("placesRef") placesRef : GooglePlaceDirective;


 formattedAddress='';
 options = {
   componentRestrictions: {
     country: ['ZA']
   }
 }
  location: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController
    )
    {
   this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
    
    this.builderProfile.uid = this.uid;
    this.profileForm = this.formBuilder.group({
      fullName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      certified: new  FormControl('', Validators.compose([Validators.required])),
      experience: new  FormControl('', Validators.compose([Validators.required])),
      address: new  FormControl('', Validators.compose([Validators.required])),
      price: new  FormControl('', Validators.compose([Validators.required]))
    });
  }

  ionViewDidLoad() {
    console.log( this.uid)
    console.log( this.authUser.getUser());
    this.getProfile();
  }
  ionViewWillEnter() {
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(false);
  }
  public handleAddressChange(addr: Address) {
    this.builderProfile.address = addr.formatted_address ;
    this.builderProfile.lat = addr.geometry.location.lat();
    this.builderProfile.lng = addr.geometry.location.lng();
    //console.log(this.location)
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
      let file = 'builder-Profile/' + this.authUser.getUser() + '.jpg';
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
          this.builderProfile.bricklayerImage = downUrl;
          this.profileImage = downUrl;
          console.log('Image downUrl', downUrl);
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
  }
  async createprofile(profileForm: FormGroup): Promise<void> {

    if(!profileForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        profileForm.value
      );
    }else {
      const load = this.loadingCtrl.create({
            content: 'Creating Profile..'
          });
          load.present();
          console.log(this.builderProfile.lat, this.builderProfile.lng);
          
      const user = this.db.collection('builderProfile').doc(this.authUser.getUser()).set(this.builderProfile);

      // upon success...
      user.then( () => {
        this.navCtrl.setRoot(HomePage)
        this.toastCtrl.create({
          message: 'User Profile added.',
          duration: 2000,
        }).present();
        // ...get the profile that just got created...
        load.dismiss();
        // catch any errors.
        
      }).catch( err=> {
        this.toastCtrl.create({
          message: 'Error creating Profile.',
          duration: 2000
        }).present();
        this.isProfile = false;
        load.dismiss();
      })
    }
           // load the profile creation process
  }

  validation_messages = {
    'fullName': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
'bricklayerImage': [ {
      type: 'required', message: 'Field is required'
    }],
'certified': [ {
  type: 'required', message: 'Field is required'
}],
'experience': [ {
  type: 'required', message: 'Field is required'
}],
'address': [ {
  type: 'required', message: 'Field is required'
}],
'price': [ {
  type: 'required', message: 'Field is required'
}]
// 'location': [ {
//   type: 'required', message: 'Field is required'
// }],
  };
  getProfile(){
    // load the process
    console.log('sharon');
    
    let load = this.loadingCtrl.create({
      content: 'Just a sec...',
      spinner: 'bubbles'
    });
    load.present();
    // create a reference to the collection of HomeOwnerProfile...
    let users = this.db.collection('builderProfile');

    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.authUser.getUser());
    query.onSnapshot(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.displayProfile.push(doc.data());
         
          this.builderProfile.bricklayerImage  = doc.data().bricklayerImage
          this.profileImage = doc.data().bricklayerImage;
          this.builderProfile.fullName = doc.data().fullName;
          this.builderProfile.certified  = doc.data().certified;
          this.builderProfile.experiences  = doc.data().experiences;
          this.builderProfile.address  = doc.data().address;
          this.profileForm.patchValue({address: doc.data().address});
          this.builderProfile.price  = doc.data().price;
          // this.builderProfile.location  = doc.data().location

        })
        this.isProfile = true;
        this.icon = 'create';
        
      } else {
        console.log('No data');
        this.isProfile = false;
        this.icon = 'image';
      }
      // dismiss the loading
      load.dismiss();
    })
    // .catch(err => {
    //   // catch any errors that occur with the query.
    //   console.log("Query Results: ", err);
    //   // dismiss the loading
    //   load.dismiss();
    // })
  }
  editProfile(){
    this.isProfile = false;
  }

}export interface  builderProfile{
  uid:string;
  image?:string;
  fullName: string,
  certified: string,
  experiences: string,
  address: string,
  price: string

}
