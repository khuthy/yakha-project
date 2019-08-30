import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the AccountSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-setup',
  templateUrl: 'account-setup.html',
})
export class AccountSetupPage {
  isProfile = false;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  uid
  profileImage
  profileForm : FormGroup;
  uploadprogress = 0;
  isuploading: false
  displayProfile;
  HomeOwnerProfile = {
    uid: '',
    ownerImage:'',
    fullname:'',
    personalNumber: '',
    About:'',
    date: Date()
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
    this.HomeOwnerProfile.uid = this.uid;
    this.profileForm = this.formBuilder.group({
      fullname: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
     
      personalNumber: new  FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
      About: ['']
    });
  }
  ionViewDidLoad() {
    console.log( this.uid)
    console.log( this.authUser.getUser())
  }
  //select image for the salon
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
          this.HomeOwnerProfile.ownerImage = downUrl;
          console.log('Image downUrl', downUrl);
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
  }
 async createprofile(profileForm: FormGroup): Promise<void> {
    if (!profileForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        profileForm.value
      );
    } else {
           // load the profile creation process
           const load = this.loadingCtrl.create({
            content: 'Creating Profile..'
          });
          load.present();
      const user = this.db.collection('HomeOwnerProfile').doc(this.authUser.getUser()).set(this.HomeOwnerProfile);
      
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
  }
 validation_messages = {
    'fullname': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    
    'personalNumber': [
      { type: 'required', message: 'Cellnumber is required.' }
    ],
  };
  getProfile(){
    // load the process
    let load = this.loadingCtrl.create({
      content: 'Just a sec...',
      spinner: 'bubbles'
    });
    load.present();
    // create a reference to the collection of HomeOwnerProfile...
    let users = this.db.collection('HomeOwnerProfile');
    
    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.authUser.getUser().uid);
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.displayProfile = doc.data();
          this.HomeOwnerProfile.About  = doc.data().About;
          // this.HomeOwnerProfile.email = doc.data().email
          this.profileImage.image  = doc.data().image
          this.HomeOwnerProfile. fullname  = doc.data(). fullname;
          this.HomeOwnerProfile.personalNumber  = doc.data().personalNumber
          
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
