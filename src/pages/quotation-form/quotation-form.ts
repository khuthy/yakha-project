import { HomePage } from './../home/home';
import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Popover, PopoverController, Slides, MenuController, ActionSheetController } from 'ionic-angular';
import { SuccessPage } from '../success/success';
import * as firebase from 'firebase'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
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
  selectedBrick = ""
  bricksContainer: any = document.getElementsByClassName('bricks');
  uid;
  loaderAnimate = true;
  hide12 = 'qweqwerwrwr';
  houseImage;
  // loaderAnimate = false;
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
    houseImage: 'https://firebasestorage.googleapis.com/v0/b/yakha-bda91.appspot.com/o/QuatationForm%2FNa18VBBzV5aSuOEh7eARHj6jYeD2.jpg?alt=media&token=c7067285-2117-4db3-8d08-279f97d58d29',
    comment: '',
    date: Date(),
    view: false,
    builderUID: '',
    docID: ''
  };
  docID;
  date: any;

  /* Three steps to take */
  steps = 'stepone';
  houseimage = false;
  brickType = false;
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

  //variables/divs to be hidden when keyboard shows in the quotation form
  hidepara = true;
  hidelist = true;
  isKeyOpen: boolean = false;
  hid = '';
  hideHeader = false;
  homeBuilderName: any;
  homeBuilderPrice: any;

  // duration: number = 0;
  //new test


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authUser: AuthServiceProvider,
    public toastCtrl: ToastController,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public camera: Camera,
    public popoverCtrl: PopoverController,
    private formBuilder: FormBuilder,
    public oneSignal: OneSignal,
    private renderer: Renderer2,
    public menuCtrl: MenuController, public actionSheetCtrl: ActionSheetController) {
    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
    this.HomeOwnerQuotation.hOwnerUid = this.uid;
    this.HomeOwnerQuotation.builderUID = this.navParams.data;
    this.quotationForm = this.formBuilder.group({
      // // // fullName: new  FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      // // // image: new FormControl('', Validators.compose([Validators.required])),
      // // startDate: new FormControl('', Validators.compose([Validators.required])),
      // // endDate: new FormControl('', Validators.compose([Validators.required])),
      // // wallType: new FormControl('', Validators.compose([Validators.required])),
      // // // brickType: new FormControl('', Validators.compose([Validators.required])),
      // // extras: new FormControl('', Validators.compose([Validators.required])),
      // // comment: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
      // firstValidation : new FormGroup({
      //   startDate: new FormControl('', Validators.compose([Validators.required])),
      //   endDate: new FormControl('', Validators.compose([Validators.required])),
      // }),



      firstCountValid: this.formBuilder.group({
        startDate: new FormControl('', Validators.compose([Validators.required])),
        endDate: new FormControl('', Validators.compose([Validators.required])),
        wallType: new FormControl('', Validators.compose([Validators.required])),
        houseimage: ['']

      }),
      secondValid: this.formBuilder.group({
        extra: new FormControl('', Validators.compose([Validators.required])),
        comment: new FormControl('', Validators.compose([Validators.required]))

      })


    });
    /*  firebase.firestore().collection('HomeOwnerProfile').where('uid','==',firebase.auth().currentUser.uid).get().then((resp)=>{
       resp.forEach((doc)=>{
         this.HomeOwnerQuotation.hOwnerPhone = doc.data().personalNumber;
         this.HomeOwnerQuotation.ownerAddress = doc.data().ownerAddress;
         this.HomeOwnerQuotation.ownerName = doc.data().fullname;
       })
     }) */
    this.quotationForm.get('secondValid').get('extra').clearValidators();
    this.quotationForm.get('secondValid').get('comment').clearValidators();
    setTimeout(() => {
      this.hideHeader = true;
    }, 2000);



    this.date = new Date();
    this.maxDate = this.formatDate(this.date);
    console.log(this.selectedComment);

    //  console.log(this.quotationForm.value.endDate.valid);
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
  ionViewWillEnter() {
    this.menuCtrl.swipeEnable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(false);
  }

  backState() {
    if (this.steps == 'stepone') {
      this.navCtrl.pop();

    } else if (this.steps == 'steptwo') {

      document.getElementById('step1').style.overflow = "auto";
      // document.getElementById('step2').style.display="none";
      this.steps = 'stepone';
      setTimeout(() => {
        this.nextbutton = false;
        this.nextslide()
      }, 500)
    } else if (this.steps == 'stepthree') {

      document.getElementById('step2').style.overflow = "auto";
      // document.getElementById('step2').style.display="none";
      this.steps = 'steptwo';
      setTimeout(() => {
        this.nextbutton = false;
        this.nextslide()
      }, 500)
    } else {
      this.steps = 'stepone';
    }
  }

  slideState() {
    if (this.steps == 'stepone') {
      if (this.quotationForm.get('firstCountValid').invalid || (this.HomeOwnerQuotation.houseImage == '' || this.HomeOwnerQuotation.brickType == '')) {

        this.quotationForm.get('firstCountValid').get('startDate').markAsTouched();
        this.quotationForm.get('firstCountValid').get('endDate').markAsTouched();
        this.quotationForm.get('firstCountValid').get('wallType').markAsTouched();
        this.houseimage = true;
        this.brickType = true;
      } else {
        this.steps = 'steptwo';
        this.houseimage = false;
        this.brickType = false;
        document.getElementById('step2').style.display = "flex";
        // document.getElementById('step1').style.display="none";
        //this.navCtrl.push()
        // console.log('....................1');
        this.nextbutton = true;
        setTimeout(() => {
          this.nextslide();
          // 
          this.nextbutton = true;
        }, 500)
      }



    } else if (this.steps == 'steptwo') {
      document.getElementById('step3').style.overflow = "auto";
      // document.getElementById('step2').style.display="none";
      this.steps = 'stepthree';
      setTimeout(() => {
        this.nextbutton = false;
        this.nextslide()
      }, 500)
    }
  }
  checkClicked(extra, event) {
    // console.log(event);
    
    if(event.checked) {
      this.HomeOwnerQuotation.extras.push(extra);
    }else {
      var filtered = this.HomeOwnerQuotation.extras.filter((value, index, arr)=>{

       return value !== extra;
    
    });
    this.HomeOwnerQuotation.extras = filtered
    console.log(this.HomeOwnerQuotation.extras);
    
    }
// console.log(this.HomeOwnerQuotation.extras);

    // console.log(this.HomeOwnerQuotation.extras);
  }
  backSlide() {
    this.steps = 'stepone'
    setTimeout(() => {
      this.nextslide()
    }, 300)
  }
  popForm() {
    this.navCtrl.pop()
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
    // this.duration =  Number(this.HomeOwnerQuotation.startDate.toString().substring(8, 11)) - Number(this.HomeOwnerQuotation.endDate.toString().substring(8, 11))
    console.log(this.extras);
    this.getBuilder();
    //let arr = [{objExtra, objPrice, objQuantity}]

    setTimeout(() => {
      this.loaderAnimate = false;
      //  this.hide12='';
      //this.HomeOwnerQuotation.extras = [];

    }, 2000);
    // firebase.database().ref().child('hotels').
    // this.extras = firebase.firestore().collection('extras')
    console.log(this.uid);
    // this. HomeOwnerQuotation.uid = this.authUser.getUser().uid;
    this.authUser.getUser();
    console.log(this.authUser.getUser());
  }

  //method to hide divs on keyboard show
  checkKeyboard(data) {
    //  this.keyBoard.onKeyboardHide
    console.log(data);
    if (data == 'open') {
      this.hid = 'value';
    } else {
      this.hid = ''
    }
  }
  //test coe
  /*  */

  detailBricks() {
    this.brickDetails = !this.brickDetails;
  }
  highlight(brick, event) {
    this.HomeOwnerQuotation.brickType = brick.name;
    //console.log(this.HomeOwnerQuotation.brickType);
    for (let j = 0; j < this.bricksContainer[0].children.length; j++) {
      // console.log('bricks', this.bricksContainer[0].children[j].children);
      for (let a = 0; a < this.bricksContainer[0].children[j].children.length; a++) {
        //console.log('brick class',this.bricksContainer[0].children[j].children[1].innerText);
        if (this.HomeOwnerQuotation.brickType != this.bricksContainer[0].children[j].children[1].innerText) {
          this.renderer.setStyle(this.bricksContainer[0].children[j].children[1], 'background', 'white');
        }

      }
    }

    // change color of  selected div;
    for (let i = 0; i < event.path.length; i++) {

      if (event.path[i].className == 'cards') {

        this.selectedBrick = event.path[i].children[1].innerText

        this.renderer.setStyle(event.path[i].children[1], 'background', '#cc9e14');
        //console.log(event.path[i].children[1].innerText);
        // console.log(event.path[i].children);
      }



    }
  }
  // selectAll(){
  // this.extras =["roofing", "doors", "windows", "framing", "electricity", "Plumbing", "ceiling", "plaster"];
  // }
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
        icon: 'close',
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
          this.quotationForm.get('firstCountValid').get('houseimage').patchValue({
            houseimage: downUrl
          })
          console.log('Image downUrl', downUrl);
          this.isUploaded = true;
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);

    })
    this.imageSelected = true;
    // })
  }
  /*   async selectImage() {
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
            this.quotationForm.get('firstCountValid').get('houseimage').patchValue({
              houseimage: downUrl
            })
            console.log('Image downUrl', downUrl);
            this.isUploaded = true;
          })
        })
      }, err => {
        console.log("Something went wrong: ", err);
  
      })
      this.imageSelected = true;
    } */
  alertContrl() {
    return this.alertCtrl.create({
      title: 'Empty field',
      subTitle: 'Please check your information',
      buttons: ['Ok']
    }).present()
  }
  createQuations() {
    this.loaderAnimate = true;
    if (this.HomeOwnerQuotation.startDate == '' || this.HomeOwnerQuotation.houseImage == '' || this.HomeOwnerQuotation.endDate == '' || this.HomeOwnerQuotation.brickType == '' || this.HomeOwnerQuotation.wallType == ''
      || this.HomeOwnerQuotation.comment == '') {
      this.alertContrl();
    } else {

      if (!this.imageSelected) {
        this.toastCtrl.create({
          message: 'House plan is required',
          duration: 2000
        }).present();
      }
      else {
        
          this.db.collection('Request').doc(this.uid).set(this.HomeOwnerQuotation).then((res) => {
            setTimeout(() => {
              this.hideHeader = true;
            }, 2000);
            this.db.collection('chat_msg').doc(this.uid).collection(this.HomeOwnerQuotation.builderUID).add(this.HomeOwnerQuotation).then((res) => {
              this.HomeOwnerQuotation.extras.forEach((item) => {
                res.collection('extras').doc(item).set({ price: 0, quantity: 0 });
              });
            })
            this.HomeOwnerQuotation = {
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
              docID: ''
            };
            this.navCtrl.setRoot(SuccessPage);
          });
          this.isProfile = false;
        

      }
    }

  }
  remove() {
    this.HomeOwnerQuotation.houseImage = "";
  }

  getBuilder() {
    this.db.collection('Users').doc(this.HomeOwnerQuotation.builderUID).onSnapshot((responding) => {
      this.homeBuilderName = responding.data().fullName;
      this.homeBuilderPrice = responding.data().price;
    });

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
  editQuotes() {
    this.steps = 'steptwo';
    this.setData();
    setTimeout(() => {
      this.nextslide();
    }, 500);
  }

  setData() {
    this.quotationForm.get('secondValid').patchValue({
      comment: this.HomeOwnerQuotation.comment
    });
    this.quotationForm.get('firstCountValid').patchValue({
      startDate: this.HomeOwnerQuotation.startDate,
      endDate: this.HomeOwnerQuotation.endDate,
      wallType: this.HomeOwnerQuotation.wallType
    })

  }

}
