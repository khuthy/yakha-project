import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, MenuController, PopoverController } from 'ionic-angular';
import * as firebase from 'firebase'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ProfileComponent } from '../../components/profile/profile';
import { OneSignal } from '@ionic-native/onesignal';
import { LoginPage } from '../login/login';

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
  db = firebase.firestore().collection('Users');
  storage = firebase.storage().ref();
  uid
  profileImage;
  imageSelected= false;
  isuploaded =false;
  profileForm : FormGroup;
  uploadprogress = 0;
  isuploading: false
  displayProfile =[];
  icon: string;
  HomeOwnerProfile = {
    uid: '',
    image:'',
    isProfile: true,
    fullName:'',
    gender:'',
    personalNumber:'',
    About:'',
    date: Date(),
    ownerAddress: '',
    tokenID:''
  }
  options = {
    componentRestrictions: {
      country: ['ZA']
    }
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private callNumber: CallNumber,
    public popoverCtrl: PopoverController,
    oneSignal: OneSignal
    ) {
    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
    this.HomeOwnerProfile.uid = this.uid;
    this.profileForm = this.formBuilder.group({
      fullName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      gender: new  FormControl('', Validators.compose([Validators.required])),
      personalNumber: new  FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      About: [''],
      address: new  FormControl('', Validators.compose([Validators.required]))
    });
    oneSignal.getIds().then((res)=>{
      this.HomeOwnerProfile.tokenID = res.userId;
    })
  }
  public handleAddressChange(addr: Address) {
    this.HomeOwnerProfile.ownerAddress = addr.formatted_address ;

    console.log(this.HomeOwnerProfile.ownerAddress)
  }
  ionViewDidLoad() {
    console.log( this.uid)
    console.log( this.authUser.getUser());
    console.log( this.navParams.data);
   
    
    this.getProfile();
  }
  ionViewWillEnter() {
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(false);
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
          this.HomeOwnerProfile.image = downUrl;
          console.log('Image downUrl', downUrl);
          this.isuploaded = true;
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
    this.imageSelected = true;
  }
 async createprofile(profileForm: FormGroup): Promise<void> {
    if (!profileForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        profileForm.value
      );
     }else {
         // load the profile creation process
           const load = this.loadingCtrl.create({
            content: 'Proccessing...'
          });
          load.present();
      const user = this.db.doc(firebase.auth().currentUser.uid).update(this.HomeOwnerProfile);
      
      // upon success...
      user.then( () => {
        this.navCtrl.push(HomePage)
        this.toastCtrl.create({
          message: 'User Profile is successful',
          duration: 2000,
        }).present();
        // ...get the profile that just got created...
        // this.isProfile = true;
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
    'fullName': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'gender': [
      { type: 'required', message: 'Gender is required.' }
    ],
    
    'personalNumber': [
      { type: 'required', message: 'Cellnumber is required.' }
    ],
    'address': [{type: 'required', message: 'Address is required.'}]
  };
  getProfile(){
    // load the process
    let load = this.loadingCtrl.create({
      content: 'Just a sec...',
      spinner: 'bubbles'
    });
    load.present();
    // create a reference to the collection of HomeOwnerProfile...
   
    
    // ...query the profile that contains the uid of the currently logged in user...
    let query = this.db.doc(this.authUser.getUser());
    query.get().then(doc => {
      // ...log the results of the document exists...
      if (doc.exists){
        if(doc.data().isProfile == true) {
           console.log('Got data', doc.data());
       
          console.log('Profile Document: ', doc.data(), doc.data())
          this.displayProfile.push(doc.data());
          this.HomeOwnerProfile.About  = doc.data().About;
          this.HomeOwnerProfile.image  = doc.data().image;
          this.profileImage  = doc.data().image;
          this.HomeOwnerProfile.fullName  = doc.data().fullName;
          this.HomeOwnerProfile.gender  = doc.data().gender;
          this.HomeOwnerProfile.personalNumber  = doc.data().personalNumber;
          this.HomeOwnerProfile.ownerAddress = doc.data().ownerAddress
          this.profileForm.patchValue({address: doc.data().ownerAddress})
      
        this.icon = 'create';
         this.isProfile = true;
        }else {
          this.isProfile = false;
          this.icon = 'image';
        }
       
      } else {
        console.log('No data');
        this.isProfile = false;
        this.icon = 'image';
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
    this.icon = 'create';
  }

  callJoint(phoneNumber) {
    this.callNumber.callNumber(phoneNumber, true);
}
viewProfile(myEvent) {
  let popover = this.popoverCtrl.create(ProfileComponent,{image: myEvent});
  popover.present({
    ev: myEvent
  });
}

getProfileImageStyle() {
  return 'url(' + this.HomeOwnerProfile.image  + ')'
}
SignOut() {
  firebase.auth().signOut().then(() => {
    console.log('Signed Out');
    this.navCtrl.setRoot(LoginPage);

  }).catch((err) => {
    console.log('error occured while signing out');

  })
}
viewHouse(myEvent) {
  console.log('image',myEvent);
  
  let popover = this.popoverCtrl.create(ProfileComponent,{image: myEvent});
  popover.present({
    ev: myEvent
  });
}
  
 }
 export interface  HomeOwnerProfile{
  uid :string;
  image?:string;
  fullname:string;
  gender:string;
  personalNumber:any;
  About:string;

} 

