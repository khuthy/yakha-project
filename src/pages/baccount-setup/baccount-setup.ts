import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, MenuController, PopoverController } from 'ionic-angular';
import * as firebase from 'firebase'
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

//import { BricklayerlandingPage } from '../bricklayerlanding/bricklayerlanding';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { HomePage } from '../home/home';
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
import { ProfileComponent } from '../../components/profile/profile';
import { OneSignal } from '@ionic-native/onesignal';

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
  status = false;
  db = firebase.firestore().collection('Users');
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
   image:'',
   fullName:'',
   isProfile: true,
   gender:'',
   certified: false,
   roof:false,
   experiences: '',
   address:null,
   price:0,
   lng: null,
   lat: null,
   email: firebase.auth().currentUser.email,
   date:Date(),
   tokenID:''

 }
 @ViewChild("placesRef") placesRef : GooglePlaceDirective;


 formattedAddress='';
 options = {
   componentRestrictions: {
     country: ['ZA']
   }
 }
  location: string;
  isuploaded: boolean = false;
  imageSelected: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public camera: Camera,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    oneSignal: OneSignal
    )
    {
     this.authUser.setUser(firebase.auth().currentUser.uid);

    this.profileForm = this.formBuilder.group({
      fullName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      gender: new  FormControl('', Validators.compose([Validators.required])),
      certified: new  FormControl('', Validators.compose([Validators.required])),
      experience: new  FormControl('', Validators.compose([Validators.required])),
      roof: new  FormControl('', Validators.compose([Validators.required])),
      address: new  FormControl('', Validators.compose([Validators.required])),
      price: new  FormControl('', Validators.compose([Validators.required]))
    });
   
    oneSignal.getIds().then((res)=>{
      this.builderProfile.tokenID = res.userId;
    })
  }

  ionViewDidLoad() {
  
    this.getStatus();
    console.log(this.authUser.getUser());
    this.builderProfile.price = 0;
    this.getProfile();
    console.log(this.builderProfile.price);
    
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
      console.log('images',res);
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
          this.builderProfile.image = downUrl;
          this.profileImage = downUrl;
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

    if(!profileForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        profileForm.value
      );
    }else {
      if(!this.imageSelected) {
        this.toastCtrl.create({
          message: 'Not Yet!. Profile image is required.',
          duration: 2000
        }).present();

      }else {
        const load = this.loadingCtrl.create({
          content: 'Creating Profile..'
        });
        load.present();
        console.log(this.builderProfile.lat, this.builderProfile.lng);
        console.log(this.builderProfile);
        let num = parseFloat(this.builderProfile.price.toString())
        this.builderProfile.price = num;
  

    // upon success...
    this.db.doc(firebase.auth().currentUser.uid).update(this.builderProfile).then( () => {
      this.navCtrl.setRoot(HomePage)
      this.toastCtrl.create({
        message: 'User profile saved.',
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
'gender': [ {
      type: 'required', message: 'Field is required'
    }],
'image': [ {
      type: 'required', message: 'Field is required'
    }],
'certified': [ {
  type: 'required', message: 'Field is required'
}],
'roof': [ {
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
    

    // ...query the profile that contains the uid of the currently logged in user...
    let query = this.db.doc(this.authUser.getUser());
    query.onSnapshot(doc => {
      
      // ...log the results of the document exists...
      if (doc.exists){
        if(doc.data().isProfile == true) {
            console.log('Profile Document: ', doc.data())
          this.displayProfile.push(doc.data());
          
          this.builderProfile.image  = doc.data().image;
          this.profileImage = doc.data().image;
          this.builderProfile.fullName = doc.data().fullName;
          this.builderProfile.gender = doc.data().gender;
          this.builderProfile.certified  = doc.data().certified;
          this.builderProfile.roof  = doc.data().roof;
          this.builderProfile.experiences  = doc.data().experiences;
          this.builderProfile.address  = doc.data().address;
          this.profileForm.patchValue({address: doc.data().address});
          this.builderProfile.price  = doc.data().price;
          // this.builderProfile.location  = doc.data().location
          this.isProfile = true;
          this.icon = 'create';
        }
        else {
          this.isProfile = false;
          this.icon = 'image';
        }
       } 
       else {
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

  getStatus(){
    
    this.db.doc(this.authUser.getUser()).onSnapshot((check) => {
        if(check.data().status == true) {
          this.status = true;
        }else {
          this.status = false;
        }
    })
  }
  viewProfile(myEvent) {
    let popover = this.popoverCtrl.create(ProfileComponent,{image: myEvent});
    popover.present({
      ev: myEvent
    });
  }
  viewHouse(myEvent) {
    console.log('image',myEvent);
    
    let popover = this.popoverCtrl.create(ProfileComponent,{image: myEvent});
    popover.present({
      ev: myEvent
    });
  }

}

export interface  builderProfile{
  uid:string;
  image?:string;
  fullName: string,
  gender: string,
  certified: string,
  roof:string,
  experiences: string,
  address: string,
  price:number

}
