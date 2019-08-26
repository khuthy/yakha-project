import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase'
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { HomePage } from '../home/home';
import { BricklayerlandingPage } from '../bricklayerlanding/bricklayerlanding';

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
  uid
  profileImage
  profileForm : FormGroup;
  uploadprogress = 0;
  isuploading: false
  displayProfile;
  experiences: any = ['1','2','3','4','5','6','7','8','9','10','11'];
   bricklayerProfile = {
    uid: '',
   bricklayerImage:'',
   fullName: '',
   certified: false,
   experiences: '',
   address:'',
   price:'',
   location:''
 }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder) {
    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
    this.bricklayerProfile.uid = this.uid;
    this.profileForm = this.formBuilder.group({
      fullName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      certified: new  FormControl('', Validators.compose([Validators.required])),
      experience: new  FormControl('', Validators.compose([Validators.required])),
      address: new  FormControl('', Validators.compose([Validators.required])),
      price: new  FormControl('', Validators.compose([Validators.required])),
      location: new  FormControl('', Validators.compose([Validators.required]))
    });
  }

  ionViewDidLoad() {
    console.log( this.uid)
    console.log( this.authUser.getUser())
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
      let file = 'brickLayer-Profile/' + this.authUser.getUser() + '.jpg';
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
          this.bricklayerProfile. bricklayerImage = downUrl;
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
      const user = this.db.collection('bricklayerProfile').doc(this.authUser.getUser()).set(this.bricklayerProfile);
      
      // upon success...
      user.then( () => {
        this.navCtrl.setRoot(BricklayerlandingPage)
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
    
    'personalNumber': [
      { type: 'required', message: 'Cellnumber is required.' }
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
}],
'location': [ {
  type: 'required', message: 'Field is required'
}],
  };
  getProfile(){
    // load the process
    let load = this.loadingCtrl.create({
      content: 'Just a sec...',
      spinner: 'bubbles'
    });
    load.present();
    // create a reference to the collection of HomeOwnerProfile...
    let users = this.db.collection('bricklayerProfile');
    
    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.authUser.getUser().uid);
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.displayProfile = doc.data();
         ;
          this.profileImage.image  = doc.data().image
          this.bricklayerProfile. fullName  = doc.data().fullName;
          this.bricklayerProfile.certified  = doc.data().certified;
          this.bricklayerProfile.experiences  = doc.data().experience;
          this.bricklayerProfile. address  = doc.data(). address;
          this.bricklayerProfile.price  = doc.data().price;
          this.bricklayerProfile.location  = doc.data().location
          
        })
        this.isProfile = true;
      } else {
        console.log('No data');
        this.isProfile = false;
      }
      // dismiss the loading
      load.dismiss();
    }).catch(err => {
      // catch any errors that occur with the query.
      console.log("Query Results: ", err);
      // dismiss the loading
      load.dismiss();
    })
  }
  editProfile(){
    this.isProfile = false;
  }

}
