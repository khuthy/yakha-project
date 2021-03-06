import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, MenuController, PopoverController,Slides, ActionSheetController } from 'ionic-angular';
import * as firebase from 'firebase'
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
//import { BricklayerlandingPage } from '../bricklayerlanding/bricklayerlanding';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { HomePage } from '../home/home';
import { ProfileComponent } from '../../components/profile/profile';
import { OneSignal } from '@ionic-native/onesignal';
import { LoginPage } from '../login/login';
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
  imageSelected= false;
  isuploaded =false;
  profileForm : FormGroup;
  uploadprogress = 0;
  isuploading: false
  displayProfile = [];
  // email = 
  experiences: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  builderProfile = {
    image: '',
    fullName: '',
    isProfile: true,
    personalNumber: null,
    gender: '',
    certified: false,
    roof: false,
    experiences: '',
    address: null,
    price: 0,
    lng: null,
    lat: null,
    email: firebase.auth().currentUser.email,
    date: Date(),
    tokenID: '',
    regNo: ''
  }
  @ViewChild('slides') slides: Slides;
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  formattedAddress = '';
  options = {
    componentRestrictions: {
      country: ['ZA']
    }
  }
  location: string;
  current: number = 1;
  
  get regNo() {
    return this.profileForm.get('profileFormSecondSlide').get('regNo');
  }
  loaderAnimate = true;
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
    public oneSignal: OneSignal, public actionSheetCtrl: ActionSheetController,
   /*  public Slides: Slides */
  ) {
    this.authUser.setUser(firebase.auth().currentUser.uid);
    this.profileForm = this.formBuilder.group({
         profileFormFirstSlide: this.formBuilder.group({
          fullName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
          gender: new FormControl('', Validators.compose([Validators.required])),
          personalNumber: new  FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
          address: new FormControl('', Validators.compose([Validators.required])),
          builder: ['']
      }),
      profileFormSecondSlide: this.formBuilder.group({
          certified: [false],
          experience: new FormControl('', Validators.compose([Validators.required])),
          roof: new FormControl(false, Validators.compose([Validators.required])),
          price: new FormControl('', Validators.compose([Validators.required])),
          regNo: ['']
      })
     
     /*   this.slides.lockSwipes(true); */
    });

    this.profileForm.get('profileFormSecondSlide').get('roof').clearValidators();

     this.profileForm.get('profileFormSecondSlide').get('certified').valueChanges.subscribe((checkedValue) => {
       const regNo = this.profileForm.get('profileFormSecondSlide').get('regNo');
       if(checkedValue){
         regNo.setValidators(Validators.required);
       }else {
        regNo.clearValidators();
        
       }
       regNo.updateValueAndValidity();
       
     });
   
    // when the page loads
    
  }
  ionViewDidLoad() {
    setTimeout(() => {
      this.loaderAnimate = false;
       //  this.hide12='';
       //this.HomeOwnerQuotation.extras = [];
     }, 2000);
   //this.slides.lockSwipes(true) // when the page loads
    this.oneSignal.getIds().then((res) => {
      this.builderProfile.tokenID = res.userId;
    })
    this.getStatus();
    console.log(this.authUser.getUser());
    this.builderProfile.price = 0;
    this.getProfile();
    console.log(this.builderProfile.price);
    console.log(this.slides.getActiveIndex);
    this.slides.lockSwipes(true);
   
  }

  currentSlide() {
      this.current = this.slides.getActiveIndex() + 1;
      if(this.current >= 3) {
        this.current = 2;
      }
  }

  nextslides(){
   this.slides.lockSwipes(false);
   this.slides.slideNext(1);
   this.slides.lockSwipes(true);
  }
  ionViewWillEnter() {
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(false);
  }
  public handleAddressChange(addr: Address) {
    this.builderProfile.address = addr.formatted_address;
    this.builderProfile.lat = addr.geometry.location.lat();
    this.builderProfile.lng = addr.geometry.location.lng();
    //console.log(this.location)
  }
  async selectImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      title: "Select image",
      cssClass: "class_used_to_set_icon",
      buttons: [{
        icon: 'images',
        text: 'Gallery',
       
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
        }
      },
      {
        icon: 'camera',
        text: 'Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA)
        }
      },
      {
        icon:'close',
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
    }
    async takePicture(sourcetype: PictureSourceType) {
      const options: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        quality: 90,
        targetHeight: 600,
        targetWidth: 600,
        sourceType: sourcetype,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };
     await this.camera.getPicture(options).then(res => {
      console.log('images', res);
      const image = `data:image/jpeg;base64,${res}`;
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
          this.profileForm.patchValue({builder : downUrl});
          console.log('Image downUrl', downUrl);
          this.isuploaded = true;
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);

    })
    this.imageSelected = true;
      // })
    }
 /*  async selectImage() {
    let option: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    await this.camera.getPicture(option).then(res => {
      console.log('images', res);
      const image = `data:image/jpeg;base64,${res}`;
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
          this.profileForm.patchValue({builder : downUrl});
          console.log('Image downUrl', downUrl);
          this.isuploaded = true;
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);

    })
    this.imageSelected = true;
  } */
  async createprofile(profileForm: FormGroup): Promise<void> {

    if(!profileForm.valid || this.builderProfile.address==""){
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
        console.log(this.builderProfile);
        let num = parseFloat(this.builderProfile.price.toString())
        this.builderProfile.price = num;

        // upon success...
        this.db.doc(firebase.auth().currentUser.uid).update(this.builderProfile).then(() => {
          this.navCtrl.setRoot(HomePage)
          this.toastCtrl.create({
            message: 'User profile saved.',
            duration: 2000,
          }).present();
          // ...get the profile that just got created...
          // this.isProfile = true;
          load.dismiss();
          // catch any errors.

        }).catch(err => {
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
           SignOut() {
            firebase.auth().signOut().then(() => {
              console.log('Signed Out');
              this.navCtrl.setRoot(LoginPage);
        
            }).catch((err) => {
              console.log('error occured while signing out');
        
            })
          }


  validation_messages = {
    'fullName': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'gender': [{
      type: 'required', message: 'Field is required'
    }],
    'personalNumber': [
      { type: 'required', message: 'Cellnumber is required.' }
    ],
    'image': [{
      type: 'required', message: 'Field is required'
    }],
    'certified': [{
      type: 'required', message: 'Field is required'
    }],
    'roof': [{
      type: 'required', message: 'Field is required'
    }],
    'experience': [{
      type: 'required', message: 'Field is required'
    }],
    'address': [{
      type: 'required', message: 'Field is required'
    }],
    'price': [{
      type: 'required', message: 'Field is required'
    }]
    // 'location': [ {
    //   type: 'required', message: 'Field is required'
    // }],
  };
  getProfile() {
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
      if (doc.exists) {
        if (doc.data().isProfile == true) {
          console.log('Profile Document: ', doc.data())
          this.displayProfile.push(doc.data());

          this.builderProfile.image = doc.data().image;
          this.profileImage = doc.data().image;
          this.builderProfile.fullName = doc.data().fullName;
          this.builderProfile.gender = doc.data().gender;
          this.builderProfile.personalNumber  = doc.data().personalNumber;
          this.builderProfile.certified = doc.data().certified;
          this.builderProfile.roof = doc.data().roof;
          this.builderProfile.experiences = doc.data().experiences;
          this.builderProfile.address = doc.data().address;
          this.profileForm.get('profileFormFirstSlide').patchValue({ address: doc.data().address });
          this.builderProfile.price = doc.data().price;
          // this.builderProfile.location  = doc.data().location

          this.profileForm.get('profileFormFirstSlide').patchValue({
            builder: doc.data().image
          })
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
  editProfile() {
    this.isProfile = false;
  }
  getStatus() {

    this.db.doc(this.authUser.getUser()).onSnapshot((check) => {
      if (check.data().status == true) {
        this.status = true;
      } else {
        this.status = false;
      }
    })
  }
  viewProfile(myEvent) {
    let popover = this.popoverCtrl.create(ProfileComponent, { image: myEvent });
    popover.present({
      ev: myEvent
    });
  }
 
  getProfileImageStyle() {
    return 'url(' + this.builderProfile.image + ')';
  }
  viewHouse(myEvent) {
    console.log('image', myEvent);

    let popover = this.popoverCtrl.create(ProfileComponent, { image: myEvent });
    popover.present({
      ev: myEvent
    });
  }
}
export interface builderProfile {
  uid: string;
  image?: string;
  fullName: string,
  gender: string,
  personalNumber :number,
  certified: string,
  roof: string,
  experiences: string,
  address: string,
  price: number,
  tokenID: string
}