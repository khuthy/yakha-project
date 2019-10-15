import { HomePage } from './../home/home';
import { Component, ViewChild, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Popover, PopoverController, Slides } from 'ionic-angular';
import { SuccessPage } from '../success/success';
import * as firebase from 'firebase'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MessagesPage } from '../messages/messages';
import { Quotations, WallType, Extra, Comments } from '../../app/model/bricks';

import { brickType, wallTypes, Extras, comment } from '../../app/model/bricks.model';
import { ProfileComponent } from '../../components/profile/profile';
import { DescriptionComponent } from '../../components/description/description';
import { OneSignal } from '@ionic-native/onesignal';
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
  @ViewChild('slides') slides: Slides;
  isProfile = false;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  bricks: Quotations[] = brickType;
  walls: WallType[] = wallTypes;
  extras: Extra[] = Extras;
  comments: Comments[] = comment;
  selectedComment: string;
  uid
  houseImage
  quotationForm: FormGroup;
  uploadprogress = 0;
  isuploading: false
  displayQuation;
  HomeOwnerQuotation = {
    hOwnerUid: '',
    startDate: '',
    endDate: '',
    extras: [],
    wallType: '',
    brickType: '',
    houseImage: '',
    comment: '',
    date: Date(),
    view: false,
    builderUID: '',
  };
  docID;
  date: any;

  /* Three steps to take */
  steps = 'stepone';

  slideone = document.getElementsByClassName('slideone')
  slidetwo = document.getElementsByClassName('secon')
  slidethree = document.getElementsByClassName('confirm')

  /* validations starts here */
  validation_messages = {
    'startDate': [
      { type: 'required', message: 'Start date is required.' }
    ],
    'endDate': [
      { type: 'required', message: 'End date is required.' }
    ],
    'wallType': [{
      type: 'required', message: 'Wall type is required'
    }],
    'brickType': [{
      type: 'required', message: 'Brick type is required.'
    }],
    'extras': [{
      type: 'required', message: 'Please include some features'
    }],

    'comment': [{ type: 'required', message: 'Additional comments is required.' },
    { type: 'maxlength', message: 'Additional comments must be 200 characters' }
    ]
  };
  extraName;
  maxDate: string;
  isUploaded: boolean = false;
  imageSelected: boolean = false;
  brickDetails = false;
  backButton: boolean = true;
  nextbutton: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public toastCtrl: ToastController,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public camera: Camera,
    public popoverCtrl: PopoverController,
    private formBuilder: FormBuilder, public oneSignal: OneSignal,
    private renderer: Renderer2) {
    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
    this.HomeOwnerQuotation.hOwnerUid = this.uid;
    this.HomeOwnerQuotation.builderUID = this.navParams.data;
    this.quotationForm = this.formBuilder.group({
      // fullName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      startDate: new FormControl('', Validators.compose([Validators.required])),
      endDate: new FormControl('', Validators.compose([Validators.required])),
      wallType: new FormControl('', Validators.compose([Validators.required])),
      brickType: new FormControl('', Validators.compose([Validators.required])),
      extras: new FormControl('', Validators.compose([Validators.required])),
      comment: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
    });
    /*  firebase.firestore().collection('HomeOwnerProfile').where('uid','==',firebase.auth().currentUser.uid).get().then((resp)=>{
       resp.forEach((doc)=>{
         this.HomeOwnerQuotation.hOwnerPhone = doc.data().personalNumber;
         this.HomeOwnerQuotation.ownerAddress = doc.data().ownerAddress;
         this.HomeOwnerQuotation.ownerName = doc.data().fullname;
       })
     }) */



    this.date = new Date();
    this.maxDate = this.formatDate(this.date);
    console.log(this.selectedComment);

    console.log(this.quotationForm.value.endDate.valid);
    this.steps = 'stepone';
    setTimeout(() => {
      console.log(this.slidethree[0]);

      this.renderer.setStyle(this.slideone[0], 'width', '100%');
      this.renderer.setStyle(this.slideone[0], 'transition', '0s');
      this.renderer.setStyle(this.slidetwo[0], 'width', '0px');
      this.renderer.setStyle(this.slidethree[0], 'width', '0px');
    }, 100)
    // console.log(this.extras);

  }
  slideState() {
   // console.log(this.steps);

    if (this.steps == 'stepone') {
      this.steps = 'steptwo';
     // console.log('....................1');
     this.nextbutton = true;
      setTimeout(() => {
        this.nextslide();
       // 
       this.nextbutton = true;
      }, 500)
    } else if (this.steps == 'steptwo') {
      this.steps = 'stepthree';
      setTimeout(() => {
        this.nextbutton = false;
        this.nextslide()
      }, 500)
    }
  }
  checkClicked(event) {
    this.HomeOwnerQuotation.extras.push(event);
    // console.log(this.HomeOwnerQuotation.extras);
  }
  nextslide() {
    switch (this.steps) {
      case 'stepone':
        this.renderer.setStyle(this.slideone[0], 'width', '100%');
        this.renderer.setStyle(this.slidetwo[0], 'width', '0%');
        this.renderer.setStyle(this.slidethree[0], 'width', '0%');
        break;
      case 'steptwo':
        this.renderer.setStyle(this.slideone[0], 'width', '0%');
        this.renderer.setStyle(this.slidetwo[0], 'width', '100%');
        this.renderer.setStyle(this.slidethree[0], 'width', '0%');
        break;
      case 'stepthree':
        this.renderer.setStyle(this.slideone[0], 'width', '0%');
        this.renderer.setStyle(this.slidetwo[0], 'width', '0%');
        this.renderer.setStyle(this.slidethree[0], 'width', '100%');
        break;
      default:
        break;
    }

  }
  gohome() {
    this.navCtrl.push(HomePage);
  }
  formatDate(date) {
    let d = new Date(date),
      day = '' + d.getDate(),
      month = '' + (d.getMonth() + 1),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  commentNow(event) {
    console.log(event);
    this.HomeOwnerQuotation.comment = event;
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
  detailBricks() {
    this.brickDetails = !this.brickDetails;
  }
  highlight(event) {
    this.HomeOwnerQuotation.brickType = event.name;
    // console.log('tapped', this.HomeOwnerQuotation.brickType);

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
      const image = `data:image/jpeg;base64,${res}`;
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
          this.isUploaded = true;
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);

    })
    this.imageSelected = true;
  }
  async createQuations(): Promise<void> {
    if (!this.HomeOwnerQuotation) {
      console.log('Please fill all the form fields')
    } else {

      if (!this.imageSelected) {
        this.toastCtrl.create({
          message: 'House plan is required',
          duration: 2000
        }).present();

      } else {
        // load the profile creation process
        const load = this.loadCtrl.create({
          content: 'submitting quotations ..'
        });
        load.present();

        const user = this.db.collection('Request').add(this.HomeOwnerQuotation);

        // upon success...
        user.then((response) => {
          response.update({ docID: response.id });
          response.onSnapshot((resBuilder) => {
            // resBuilder.data()
            if (resBuilder.data().builderUID) {
              this.db.collection('Users').doc(resBuilder.data().builderUID).onSnapshot((out) => {
                if (out.data().tokenID) {
                  var notificationObj = {
                    contents: { en: "Hey " + out.data().fullName + " ," + "you have new request" },
                    include_player_ids: [out.data().tokenID],
                  };
                  this.oneSignal.postNotification(notificationObj).then(res => {
                    // console.log('After push notifcation sent: ' +res);
                  });

                }
              })
            }
          })
          this.HomeOwnerQuotation.extras.forEach((item) => {
            response.collection('extras').doc(item).set({ price: 0, quantity: 0 });
          });
          this.navCtrl.setRoot(SuccessPage)
          this.toastCtrl.create({
            message: '  Quotation submitted.',
            duration: 2000,
          }).present();
          // ...get the profile that just got created...
          load.dismiss();
          // catch any errors.
        }).catch(err => {
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
  remove() {
    this.HomeOwnerQuotation.houseImage = "";
  }

  sendQuotation() {
    console.log(this.HomeOwnerQuotation);

  }
  viewProfile(myEvent) {
    console.log(myEvent);

    let popover = this.popoverCtrl.create(DescriptionComponent, {
      data: myEvent
    });
    popover.present({
      ev: myEvent
    });
  }

}
