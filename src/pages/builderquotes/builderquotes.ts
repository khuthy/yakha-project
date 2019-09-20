import { Component, ViewChild, ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, Header } from 'ionic-angular';
import { SuccessPage } from '../success/success';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import * as firebase from 'firebase';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { style } from '@angular/animations';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';

 
/**
 * Generated class for the BuilderquotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-builderquotes',
  templateUrl: 'builderquotes.html',
})
export class BuilderquotesPage {
  pdfDoc;
  length;
  height;
  width;
  value =0;
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
/*   extra = {
    Ceiling: {
      price: 122,
      quantity: 9
    },
    Doors: {
      price: 122,
      quantity: 9
    }
  } */
  formattedAddress = '';
  options = {
    componentRestrictions: {
      country: ['ZA']
    }
  }
  quotesForm: FormGroup;
  quotes = {
    ownerName: '',
    overallHouse:0,
    ownerAddress: '',
    fullName: '',
    expiry: '',
    address: '',
    dimension: '',
    total: 0,
    price: 0,
    uid: '',
    pdfLink: null,
    meter: 0,
    discount: 0,
    discountAmount: 0,
    discountPrice: 0,
    ownerUID: null,
    hOwnerUID: null,
    subtotal: 0
  }
  meter = 2;
  pdfObj = null;
  db = firebase.firestore().collection('Respond');
  dbUsers =  firebase.firestore().collection('Users');
  dbRequest = firebase.firestore().collection('Request');
  storage = firebase.storage().ref();
  uid: any;
 
  validation_messages = {
    'fullName': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'expiry': [
      { type: 'required', message: 'Expiry date is required.' }
    ],
    'address': [
      { type: 'required', message: 'Address is required.' }
    ],
    'dimension': [{
      type: 'required', message: 'Extra costs are required'
    }],
   
  }
  ownerAddress: any;
  count = 0;
  extras = [];
  total: number = 0;
 
  date;
  maxDate;
  buid: string;
  userMsg: any;
  itemtotals = {
   
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public forms: FormBuilder,
    private fileOpener: FileOpener,
    private file: File,
    private plt: Platform,
    private authUser: AuthServiceProvider,
    private loader: LoadingController,
    private cdRef : ChangeDetectorRef,
    private localNotifications: LocalNotifications,
    public toastCtrl: ToastController
  ) {
    this.userMsg = this.navParams.data;
   // console.log(this.quotes.hOwnerUID);
    
    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
    this.quotes.uid = this.uid;
    this.quotesForm = this.forms.group({
      fullName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      expiry: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.compose([Validators.required])),
      dimension: new FormControl('', Validators.compose([Validators.required])),
     
    })

    this.date = new Date();
    this.maxDate = this.formatDate(this.date);

 
  }

  ngAfterContentChecked() {

    this.cdRef.detectChanges();

  }

  ionViewDidLoad() {
    console.log(this.userMsg);
    
     /* this.dbRequest.where('builderUID', '==',firebase.auth().currentUser.uid).onSnapshot((res)=>{
      res.forEach((doc)=>{
       // console.log(doc.id,'=>', doc.data());
        this.buid = doc.id; */
 
    /*   })
    }) */
 
    this.dbRequest.doc(this.userMsg).collection('extras').onSnapshot((res)=>{
      console.log(res.docs);
      
      res.forEach((doc)=>{
    //   console.log(doc.id);
        console.log(doc.data());
        
      // this.extras=[];
       this.extras.push({item: doc.id, data: doc.data()});
    
        console.log(this.extras);
        
       
        
      })
      
})

console.log('yea: ', this.userMsg);
    
this.dbRequest.doc(this.userMsg).onSnapshot((res)=>{
   this.quotes.hOwnerUID = res.data().hOwnerUid;
   
   this.dbUsers.doc(res.data().hOwnerUid).onSnapshot((res)=>{
     if(res.data().builder == false) {
        this.quotes.ownerUID = this.quotes.hOwnerUID;
     this.quotes.ownerAddress = res.data().ownerAddress;
     this.quotes.ownerName = res.data().fullName;
     this.quotes.dimension = 'Whole House measurement'+ this.quotes.meter+'per meter squared';
     }else {
       console.log('this is a builder, sorry');
       
     }
    
   })
 }) 
     
      
     
    
    

    // console.log(this.navParams.data);
  /*   this.dbUsers.doc(this.quotes.hOwnerUID).onSnapshot((res) => {
      if(res.exists) {
         res.data();
         this.quotes.fullName = res.data().fullName;
         this.quotes.address = res.data().address;
         this.quotes.price = res.data().price;
      console.log('Extras ', this.extras);
      
      }else {
        console.log('No extras yet');
        
      }
     
    }) */
   /*  this.db.doc(this.quotes.hOwnerUID).onSnapshot((res) => {
      this.quotes.ownerAddress = res.data().address;
      let num = parseFloat((res.data().price) + this.quotes.dimension)
      this.total = num;
      //  this.quotes.price = num;
      this.quotes.ownerName = res.data().ownerName;
    }) */

    this.dbUsers.doc(firebase.auth().currentUser.uid).onSnapshot((doc) => {
     
        this.quotes.address = doc.data().address;
        this.quotes.fullName = doc.data().fullName;
        this.quotes.price = doc.data().price;
    
    })
   /*  this.dbUsers.doc(this.quotes.hOwnerUID).onSnapshot((doc) => {
    
        //this.quotes.ownerAddress = doc.data().ownerAddress;
        //console.log(doc.data());
        this.quotes.ownerName = doc.data().fullName;
        // this.quotes.price = Number(doc.data().price) * (this.length*this.width*this.height)*2 + (Number(doc.data().price) * (this.length*this.width*this.height)*2)*.15;
     
    }) */

  }
  public handleAddressChange(addr: Address) {
    this.quotes.address = addr.formatted_address;
    this.quotes.ownerAddress = addr.formatted_address;
    // console.log(this.location)

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
  input = 0;
  onChange(event) {
    console.log(event);
    
    
  }

  childPlus(i, index) {
    this.extras[index].data.quantity++;
    console.log('item: ', i, 'index: ', index);
    if(i.data.price > 0 && i.data.quantity >= 0) {
        
           this.value = (this.value + parseFloat(i.data.price));
       
    }else {
      this.value = this.value;
      i.data.quantity = 0;
      this.toastCtrl.create({
        message: 'Please specify the price first',
        duration: 3000
      }).present();
    }
    
  }
  childMinus(i, index) {
    this.extras[index].data.quantity--;
    console.log('item: ', i, 'index: ', index);
    if(i.data.quantity < 0){
      i.data.quantity = 0;
      
    }else {
      if((i.data.price >= 0 && i.data.quantity >= 0) || (i.data.price != null && i.data.quantity != null)) {
      this.value -= i.data.price;
    }else {
      this.value = this.value;
    }
    }
    
    
  } 
  test(){
   
   
    this.quotes.subtotal = this.value - (this.value * this.quotes.discountAmount/100)
    this.quotes.total = ((this.quotes.price * this.quotes.meter) - (this.quotes.price * this.quotes.meter) * (this.quotes.discount/100)) + (this.value) * this.quotes.discountAmount/100 ;
    console.log(this.quotes.total);
    console.log( this.quotes.subtotal);
  }
  
  createPdf() {
    /* calculations */
    
    /* discount amount of extras */
    this.quotes.subtotal = this.value - (this.value * this.quotes.discountAmount/100) 
    this.quotes.total = ((this.quotes.price * this.quotes.meter) - (this.quotes.price * this.quotes.meter) * (this.quotes.discount/100)) + (this.value) * this.quotes.discountAmount/100 ;
    this.quotes.discountPrice = (this.value) * this.quotes.discountAmount/100
    console.log(this.quotes.total);
    
    var items = this.extras.map((item) => {
    
      return [item.item, item.data.quantity, 'R'+item.data.price+'.00'];
       

  });
  
   

    var docDefinition = {
      watermark: { text: "YAKHA", color: "gray", opacity: 0.3, bold: true, alignment: "right" },
      content: [
        // {
        // border:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzODEiIGhlaWdodD0iMjI2LjIwMyIgdmlld0JveD0iMCAwIDM4MSAyMjYuMjAzIj4NCiAgPGcgaWQ9Ikdyb3VwXzI1IiBkYXRhLW5hbWU9Ikdyb3VwIDI1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE2OSAtNDgwLjEzMSkgcm90YXRlKDE4MCkiPg0KICAgIDxnIGlkPSJHcm91cF81IiBkYXRhLW5hbWU9Ikdyb3VwIDUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02NSAtNzkuNjU5KSI+DQogICAgICA8cGF0aCBpZD0iUGF0aF8yIiBkYXRhLW5hbWU9IlBhdGggMiIgZD0iTS0yMTIxLTU0MS44MzVzOTctMTEuMDE2LDE5MC4zMzMsMjAuODA4LDE4OS40NTIsMjIuOTEzLDE4OS40NTIsMjIuOTEzdjE3OC42NDNILTIxMjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MzYgLTgxKSIgZmlsbD0icmdiYSgzMywxMDksMTIzLDAuNDQpIi8+DQogICAgICA8cGF0aCBpZD0iUGF0aF8zIiBkYXRhLW5hbWU9IlBhdGggMyIgZD0iTS0xNzQwLTU0NC40NDFzLTEwMi4zMzQtOS4yMTItMTk1LjY2NywyMi43MjJTLTIxMjEtNTAwLjIyNS0yMTIxLTUwMC4yMjV2MTgwLjc1NGgzODFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MzYgLTgxKSIgZmlsbD0icmdiYSgzMywxMDksMTIzLDAuNzgpIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg==',
        // },
        {
          columns: [
            {
              image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAAgAElEQVR4nOzdB5ScZfXH8d9s77vpm95IhVQ6QaoUQQW7IooNRaQKggUVQRRRVDoigg1QUBEbin8FRHoNoaQQQhLS2+5m69T/eZY7cbLZZKfPOzPfzzlzYCazM2/ZnXmf+9znXgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA0QMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAogcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQE74+nvT2279FGcDQDo0SRrWz+sEJa2X1MVRRi6M3N6hQ55+lmMPr2iWVJ/ktgy2W7/XdAOot8/okiR+tsr9KUkqS+JnS+x9k/lZZ7ik8iR/dohtezI2S+qRtFFSq92WSNog6Q27bUjytQEUqCf9zbquZ1DOd66sNKw/3PuXpD94AWB33IXZuyUdLWmupOp+nhexi6hQBo7idkmLM3R2ns7Q666125MZen0gnwyVNCnJ7a2RtHcK+7p/jn62MoXBcHkKg2H3nhVJBg9KbLuT+dl8Nbqf7e6Q5LeAtrttkvSUpH9LetyCBQDgGQQAAKSixC643ezVUZJc+tCBHjiimdqG0zLwmmGbMTqPAEDRcX87tXEMoA5J4cAcnOTsrrOPpIYkf3aizQ4Dha7WbtHpvcmSDpJ0jt1/UdL9dntFUrsFDDIRAAeAAREAAJAonw0KZkiaI+lESUekkL5azPx2UXiZpOeL/WAUobMlXZpCOjIA75ttt4slrZD0sGWTLZK0lCUDALKNAACARLiZ/nfZgH9/S9Mt5QgmZZukayTdLmlVHm5/XmurqtTmkaM0dN3aYj8UALJnot1OlbRG0ksW/HVBgScsOwAAMooAAIB4uHWPn5X0Qfv/2hTSivHWRd+ZNgvUzfHIvo7yMrXW12noupxuxgqrhUEGAFBc3PX3eLsdI+lzFgj+taTfSsrtJxOAgkYAAEB/fDYoabR1/V+0yslITbcVhjpX0mscy9x6YUyzhmxrUdOmnNXo8ltBTADFq8I6IrjbvpK+5xpySbrFvic6rFYMAKQFAQAAfZVaEb33WZricI5QWrjZnZ9KuknSlgLYn4KwafDgXAYAAKAvFxA4w75//yzpr5Iete8QAgEAUkYAAEAs17bv45JOkLQX6/vTIijpP5K+L+lfkgIFsE8F48XRwzVlSaa6RgJA0uokfUTSSdZO8I+SfiNpM4cUQCpYwwtA1r7IVSj+g1Umn8bgPy3cYP/nkj4h6R8M/r3pnwsOLvZDAMC7aqzNrlsa8Iik0yVVc74AJIsAAFDcam3N4V8kXWnVickMSl3E0vwvsIu11az19q7tleXyV9XkYvsC/F4AiIPPAgHTJd0s6b+SjrcsAQBICAEAoDiVWV/i6IzCIfwepE2Xzfa7GgrXFcg+FTQ3An9unxm52MXl1gUAAOLlrt3nS7pH0rWWHUAnEQBxIwAAFB+X2n+aFaT7LKmEadVlF2Sfs3X/yBPbqiu1adRoTheAfOFm/z8p6XZJl0sax5kDEA8CAEBxcRX975b0Y0n7Syrn/CeuuzusRS+3KxjcKXt7vaQPSfqWVWsmtTuPdJaXqa22ttgPA4D8M85ay95LNh+AeBAAAIpDhaUJuh7077WZAx/nPnGtrUE99XSrXnutS88826ZgKOJm/f8uaYG1bOrKt33CW14Y26zWIcM4GgDyTbktC3jUsgGGco0PYHco9gUUvipLST9P0gTOd/IiEWnLFr9aWkO9r7FxUyCyeHHH00OGlJ0j6fXoCzc1lqu6miYKaVJvL7M97/dkV0EyRQCk2ZetuO93JT0mKcQBBhCLAABQ2Jol/cD6CFMtOEU+n9TcXKnNWwJau86vUCjiW/Za117LXtMMK+gWdu/Q3Fyuutq3AgBDhpRr1EjqMyVplKW2/jVbNRVenThOB23ZlI23ctbSGhJAmrlr++Ms4H+NpJ9wgAHEIgAAFK5ZVpDucNL906empjTQ3Fz5yMZNgXmBQGSQDVLduv9nbECn9esDO8Z1b6zs0UsVHbu8/5FHDFJ5ORmaezBV0q2SDrKZ8qwEANY0ZLUOQGc0aAQAaeS+XFxg+keS5lhLWpanAehFAAAoTAdK+iEFgdJug6Qb3LGNRHo7KLgUy0pJcyV9U9I5fdu6uUKBfYoF9vrL37ZkbCOPPLxJTU15W9/RZaocIelnVrRSFKsEgKS4Lj+ftu4/l1mQmmVHQJFj+gkoPG+3tkAM/pPg1vmHd52TdTPQ/5L0GVdgqasr2BEMRm6y4xz1WbsRWE2Oy1LZy7Ip7okZ/AMAkueKAH9K0tWSJnEcARAAAArLey1tegbnNXFu8L9+Q4+WLO2Q378jCtBmSylOdxP3MS/aLek7kh6Keexrkk708C562dsk3SbpC1a4EgCQHi4w/X5Jv5J0AMcUKG4EAIDCcYKl/Y/nnCbnlVc79Myz27VkaadWr3bj+950ftc94SuSVvTzom9K+rb1/ZfNWl8kabrHd9VrLrJCf4fakoq+6vNmTxK3Nt82GEBecssADrYgwH6cQqB4EQAACsPRDP5TEwpFtK0l0Lte32UCvPxqp15Y2H7Rvfdt+sXy1zv8HR1BuVtPz07rA9xayocl3WQF3Xy29OLMAh+0pkOJFfr7taQrbO3/7opVzsqvXUvIqjS+FgAMxH3uXi9pPgWCgeJEAADIf8fYl/k0zmXySkt9mjOrXo0Nby3hdwGBFW90ne36Kb+4qFMP/N+23tszz7aqpTUY+z7uzs2S/hzz2KmSPpCL/WgeUa7KSs9/tLs1qSdbyv+HqZsAAFl1oAVex3LYgeJDAADIb/NtzT8p52lQX1+6ZNrUapdJsdlezRVM+mrsRdLGTUGtXbtL6/YWSV+StNjuD7KlAVkvxDhiRIWqq0uz/baJGCbp+xa0WmBpqQCA7DrGrh9Gc9yB4kIAAMhfUyT9RNI4zmFa3O/az1VXl1wi6Q6XBGCfke+wWeqBWtGtlvQRWwrgjJR0naSaPNj3bHGBqt9JOsuODwAgN0qta9BV1i4QQJEgAADkp+FWcX4e5y9+kf67H6+X9A1JH7L/75L0A0lP2L+7onQXxjmb/4q91lYrIPjNmIBAxk2fVq1JEz0Zb6iV9C5J90o6LInvnuYMbZcX+At43wB4m8+WY11EEAAoHgQAgPzkZlA/SPp0/Do6Qlq5siu2vZ/zlKSzLSV9e8zjb9qgf5PdH25FFgfqoewGc3faa15jbRkbsrWPM6bXZeutEhHt7X93CktVJudm07Pi9QLeNwDe56LGn5X0TsYFQHHgDx3IP6dIOpdofXzcrP+WLQEtXLRdzy9sd4X9FA73DtRdb/+PW0p6b8+/cDiixUt2TNi7DIDzo/9m9RZcSn/jAG+8zoIAl9vsylG5PQI5U2LppW6N6Tn09t+tVo9uF4DiMUrSpSwpBIoDAQAgv0yyAVXWZpXzXSAQ1qrVXdqw4a3Cfa8t7wpu2NhzhaU8LondPRcs2LBxpwJ/91ixuihXNOnLcR6Sdkmn9+kOkDHveudQr52pj1pw5bA46icAAHJrpnVmAVDgaL0E5I9hNmvNTGoCKipKNH5ctbZtC6q1LSS/P1L2xJNt75b0R0kvxr7SkUc09X1hv7X4m2sz+eVWEPA/kv7hkgYG2JLgAP+e4r75NG9OnUaN8syvRJml/H/NWiGmUwXr5QEgo4602jXf5fMWKFxkAAD5odKK1C2wtHIkYNCg8s3DhlXcF5POv6+kr9tx3eHBh1r6e9HlViPgTbs/QdLFXuifPG+upwb/LjhyknWm+HAGXn9iBl4TALCz0y1zC0CBIgAA5IeZVvhvlylqDGiJz6fzSkp0hhXmi3qP9fiPx4NWBDDqbZIOz+WhP/xtjRo10jOD/xqreeAyVA7NUHZZoS57WemBbQCAqGYrCljI3VeAokYAAMgPZ0qaxrlK2PPWfu4Oa/HnUtP/aS/iOih8xWatBxKwwe1v7Hmund1fc7VTbvA/eHBFrt6+rym2HOIiKyTF90pi1uXTxgIoeKX2vXkQGYdAYeJCDfA+V0n9M5ynuLlu/xtsDaNLY1zmfrC9I+T+E7JKx8vtxcrt/j5xXOhELAvjFKvcfmK2d2z0qAoduH+9Vwb/btb/fZLus1l/LhQBoDBUWcB8EOcTKDwEAABvG9GnCj0G5gr7nSfp21aJv69nJf1IUnTB/942ez04jtfeIukuywbIakbGnFm1OmD/Rq+s+Z9ox/cmSTOy9J71WXofAIC0n6QvcByAwkMAAPC2s6yqOvrYvj2oJcs6+z78CytA59rP7fKPpkfSryyNX5YF4GayP5HAMV5kQYSsmD+vThMn1njlV+AwO85nW2eKbKEIIABk1wWSpnLMgcJCAADwLpeW/m5bjwfzVq9+vx5/sk2vvNKhVat7C/t3STrXBvGL+7bfW7GiU2vX7tTRqE3SOZLesPs11vpoTpzH2bX/25yNc7LP3jW9bQx9uU+wd4X9Pi3p91YEMdttZD1T9AAAikSjZdQBKCAEAABvKrc15hT+68PvD2vFii51vLWmX0uWdnatXdfzrZaWwI0tLQG1t8fdet8tDzjBigPKUszv8NJsx4zp1ZqyV22uN6PEjsnVthxlaK43KNO2Ds9q8esXc7KTABCfY10iGscKKBzZnsEBEJ8xkj7Qt089pIqKEo0fX6XWtqA6O8Nqbw9VPvlUm5uRvlPS6oaGUk2csPM6+U2b/Ls7cktsLfsVNtMxXeptF3hR3yyCbJs7p1YTJ+Q87d/9/r1D0sVWEboo/GfvKTp54/ps7erulqoAgBeMtu+BRdYRB0CeIwAAeNM7E0hHLyouFX74sIrVgweVvdLZ6T/GZqjfbvUSvtzWFoosfLEj3kMStln/ebZ8wF3c3G2P58TkSVWaOKFadXU5/3h2WSiXWNq/F/pBF3zmAQB4UJVly/1W0mucICD/sQQA8B632vuTBOj65VrxPVNa6juptNTnCvc9aU+qtFn7A5J4zRbLAHDFjv5swYRIhvejX8OHlWv2rHrV15flcs2/e+chkh60AMBIj7T4m+CBbQCAYrSvdcwBUAAIAADec6LNSGNnGyXdJulkSc9LctP8p1rRvyjXk352EsdthaRrJJ1ps92js33sx46p0IJDmrL9tn25ggPvkfSYpAW53hgAgCdUWrccihIDBYAAAOAtrtL5lzgnO3Hp+AvtuLjK/Wti/vF1Sd+y4IAzQtJ3JI1L8r1cn/9vSFqXxu0f0JS9qjR/XkM237I/Q23fb6DtU9atKrL9BZB/3mXZYQDyHAEAwFvmWaod/uevtj7/rmjBtA0berR+w47Cfi5t/3br7y9L4f+stfZLlEv93yoplK3jP3lSpaZPq1NJSU6z7N1s/5+slaIX1vsXm7XFfgAAeF6TfbcCyHMEAADvcCPAj0qqLtZzEg7vtPTejfAvk/RuSS/EVh/u8YfV07PjuW4pwA8lPWX3K60g4OHZ3PZEVZT79J6Thmn2rAaVleVs8O+KO31K0r2SDvZ414npHtgGAChmpzN2APIff8SAd7iZ17nF+HcZCkW0caNfjz3RqtbWoBvoPyfpFEvvj8dGa1UXnUlttPZ+Y3O3V7s3Yni5jjs255mUkyV9V9K1koblemPiUOf5LQSAwjbOgsUA8hhVxgHvcOn/k4rtfLjB/5o13Vq8pFMdnWE9v3B76+hRFVfZrHS4uqpEY8bElRTxuKTzJP3KZrLn2+DWzVhszvyexGdkc7nmzK7P5ay/a+93kqSzJR2Wq40AAOQll5X3KKcOyF8EAABvKLcBa9Gtv/a5fnc+n3r8b6X0b9sWbNq2LXiUpH+4Fn3l5T6tXNW90890du22Tf8f7Dh+2e6/09YsfiezexGf+vpSzZvXoMqKnCV51Es637odjMjVRmAXHRwSAHniYPsu2c4JA/ITSwAAb2iw9nVF12KnpEShYUMrFg0dUrbQKv67wORpNnj3BQIRbdwU3OnW3r7bAIAr3nejpAeshoDrGHB3dvdoVxUVPlVXl+jtRw3O1eC/xJZF3GLLKvJx8O8r4O+slzywDQAQj5GSpnGkgPxFAADwBrcg/MAiPBdtkn4p6f19evq7FP6vS9oniddcLelKSV+xmdUpad7mhDQ2lOrQQxp1fO7W/Ndbyubzkj6cq41IA7cOZEwebz8AFILBkmZwJoH8RQAA8IbpKfSuz1cvW9u5Czq7gku3bw+5WdAvSmq1/XG96H8iaXgS+/egdQZwFe5H5eL4zJtb2zvrP39+vRoby3OxCbIiiF+TdJOkibnaiDQp8XiXAgAoBo12zZKzLzYAqaEGAOANRxbReQjbAP3LVu0/3NMd7i0AKOmfkr4h6Rp77sE2m//5mD7/iXhS0qJs7+D8eXUaN7ZazSMqVVWVs1UdLkXzZkkHWbs/AABSVWoBAJcJsIGjCeQfMgAAbziiSM5Dp6SfSvqApGcsGBDL3b9D0l0x//ZeSZ9MoT5CZ3o2fWCunuHMGdUaP6669/9zNPivshoKr9jvFYN/74sU+wEAkFdcxmITpwzITwQAgNxz6XRzC+k8BIMR9fSEFfnfsCZsM/Gu+vwZrtj/Hn58i6QfSVpoA6NG+7kDrRCcZ82YXq1pU3Parn6KdTy4tgA/313GWk4Pbga9WaD7BaAwTbAMAAB5iAAAkHsHF9I58PsjWv56pxYv6ZDf3zuJ32OV+D8t6ddxvsxzNpCNpv3PlPQl65bgSfPn1uV68H+ipFstWOLZ45SCygJuk7nGA9sAAPEaakEAAHmIGgBA7h1UKOfAzfo//Wybtm4NKhKJyFfi0+x96r5haf8tCaQ6u3Z+90m6XtKFlv7vBrjftEKBnjFhfKWmT69VVWXO1vq7Kv/nSTpb0jAvHRsAQMGaZFl5LGEC8gwBACD3DimUc1BZWaKyMp9CobeuB5Yv73K3162yf++Dg5pKdcjB/1s6WF5eokCw3+uHgM36z5N0lFUcPl/S05ZREMraju3G8OHlmjc3Z5PtLoNrvKTLJX2Iz3MAQBbRChDIU1wwArnlcsYPKKRzMGdWfWdHR0trW1topD30A0lrJT3m7mxrCemv92/Z8fx959fpuefb9/SSbnb7N5L2tvsuo2CFpCcyuBu71dBQquYRb3U/2ntmfS42QfZ7c4wFSApqCQkAIC+M5TQB+YkaAEBuzSiwQNza8nLfBYOayt2s9Dp7bIykr9hs9S6efW6Pg39niaTvxbQb2kvSuZJGDvBzaVdR4dN+8+t7B/45HPyPkvRVa/FXTIN/VwNguAe2IxP2VBQTALxoitcL8wLoHwEAILfGp9Dezmv+a7PSrhDdbdbKL2D7d5wVAaxMYpsDlvL/W+sm4AIm75H0sWx/hr39qMFqbCzP5lv2NcMKKX6xgAfDu1OereKGIZ9PC2fPzsZbRb2WzTcDgDQo1KKsQMEjAADk1rx8ywAIBCK9bf5iuCn8n0v6sOs9HwpFgitXdbvq/VdYr3/Z4O1C60ufjB5b6/6q/WylFQTMSgHF6uoSHX/s4N4aBzlSa0GUByUdmWQgBQnoLs/qn2XO61kAQILc7P98DhqQfwgAALlTamvo8iIDIByOaOu2gJ56plWvLm7vDQS4Ab+kiyV9rp9WZlslfVbSMrtfLemGFAoHbZb0UUmv2/0aqw0wM/m9GlhjY6kOOqBB1dU5OU3uAmuyBVP+ImlELjYCAIB+5GwtHIDkEQAAcmeQrefOizV0W7YE9Nxz27VxY0CrV/e4Xv9Pvrq4/cylyzpudO3/d/NjL1m6erTqnxvM/jCF1MGFkr5mLQVlAZQrMtX+rrzcp33n16upKWdp/8fakoozKNoKAPAYOgEAeYgLSiB3hroJ5nw5/jU1pSq1T4wef0RLl3VNCYcjW3w+9QYEog5d0NT3R/8l6RZbAuBG0kdbZf+v2/r+RP1Z0n5WCNBt0fFWX8B1Gwimc59LS31qbMjZ4P8iK57YSKGlXi7jY4IHtgMA8Bay0oA8RAYAkDuDs1XULB1qa0uD+8ysc2n+293LhUKRwZGIbg6H1di2PaTo7W9/39L33bosAODWr0csCPBJSScm+RnUIel6SY/a/SpJZ0s6PN37/I7jhqT7JQdSYlkSrtDfdyQ1MfjfwVfAQWuXQbPSA9sBAIlgHAHkIf5wgdwZmkcBADfov2fYsIp3SPqWq5Fmjy+QdJX1pd+TN6yV3xv2HFfB/pLdtQaMQ/T1NtpT3VKKb0sancmDkGEVkt4l6RdWULFQukNgYOGYvykAyBdkZQF5iAAAkDvDrQ6A1221wfWFtqb/VmvJF3WqpNPimJ39j1Xu77L7IyytO1n/tHoA0YGT6whwSp7+PrsaBldaZsMCBv8AgDwwlpME5B8CAEBulNoSAK+3c3P9yY+S9CNJay2Fv9UK+UVb/NXYmv5DBngttz7/LlsO4FoHPixpVQrbFrT2gzfZ/Xsk3ZzC6+3kqCN2qWWQKa6Lwd22jGFMtt40T1XaEhIAAAAkgQAAkBtVXhrs+f1hLXutU4sXd/S2+7N19nfaoH5htFhfd/eOduUvWlAguuB/LytaN1BBoKA9b39JbWmoIBy0JQhn2TKAoSm+Xq/a2hJVVGT847Ha6iD8VdIRFGWNy7B8KpwJAADgNVxwArlR7pWBjBv8v7q4QytX9SgSiaiquqRn+LCKy2pqSm+z3vs7PPV0W+zd30maJukbdv8YG4hfvoe2gLJ/W2yBgM407MJ6STdIWmHrEVek8mJNjaWaP68+033/p1khxHMtGITiFooW1wQAAMgkAgBAblRYDYCcc2382ttDrqp/76a8/EpHaE1jz6K6upKdBv/jxlb33VS/td6bZ8XrKmxA6wr0/SyO/WpP877/LdUXKCvzab99G1Rfn7GPRhdVONJqFxzKZzCMy2TZwMEAAACZxsUnkBtu1rfZC8e+vLxEM2fUant7m7q6wvL7I9UbNwUu3rhJr8S2Jlv9pl/BYKTvj7tZyy/YjPZUSfXWJcAVC3wy6zuTItf2zwUBMuijkq6WNIT2fogRsSwAAACAjKIGAJAbpXG0zssG137sjYrKkrPqaksvswr9PqtE74rS1Ua3IRCIKLLL+L/XmzajHa0HMFLSV+y/nldZ6dMhBzXoPScNy9Tgv9RqJPzSWvwNZfCftFqWTAAAACSPAACQG6Wxg+sccYX+/iDpY7aG3lXQf8A2xWUHfVrSyXFsmgsL/MPS/nvsvi/FFn9ZUVIizZtbpxEjMtaMocKO4e153KLQS5o8EjgDAADISywBAHKjMsc1ANxs/bU2aF9jj62TdIGkuZLG22DrSivY9+wAr7fdugLMtM8VV5hvUxb2IyVvO7RRgwdVZOrlaywz4jRJo7OzRwAAAMDuEQAAcsNnWQC54AbmH5L0iBUfU093SJu39Hb6Wy7pg5IetAGsa1X4a0n7xlGx3w363y+pQdKxXv98cX3+Gxsz1lLe1UP4jaTZOTzPyB/dkpZyvgAAQKaxBADIjYyvY3YF+6ynf1S79ZyfYwP8YOw/xqzvf4VWgQwAACAASURBVM4K+UUH/G79+nfiXLLQYwGGOyRtTd/epM+IEeU6+KCGTA3+ayzl/0/WHYHBf3qVFvD3VtgD2wAAAAocGQBAbkzN5Lu6tn5vvtmtmtpSjRvbG2tYbev8b5G0Lfa5buC/fsNObfuDNoDfT9J77HPiw5Kel3SnqweYr78zc2bVatKkjJUmGG8dEU7zSovHAjSIGgAAAADJIwAA5EbGqs5t3RrQK4s7tGVLUBUVPlVWlKwZMaLiVElPWarxTlyWwJKlXX0fXivph1YPYIqbOJf0VUlPSFqSj78z++9bpzFjqjPx0u5z9DBJl7iyAnyuZlSVFVYEAABAErhQBQpMXV2Ztm0L9g7su7sjeuKp1oqSEt+S6OD/XScOjWeHI9bH37Xz+509NtWKBh6ab0ds3pzaTA7+PyHpcguS0N4PAAAAnkUAACgwbtZ/3py6zc88t70qElFdOKyh4XDkx5LOkNR6731xF+d3QYDfS/qepPMsa8EFAQ6yTIC8sPfMGk2YkPa0f7cOfYKkL1sbRXrTFxh/Wal6ampV2dmRjR1z6/93ScMBAABIN4oAAoXFLeb/Z31D6VllZb7f2np9Nyt9vKRPJjlQvcqK2rk2gf/Np8H/nNm1mjolntqFCXHH8ERJv5J0OoP/rKrIVuB6Y2211o4ala19c3+3q7L1ZgAAoHiRAQAUDld1/zpJt0UiWhUMRhZaJfr51tP/POvn/0iCe+yKBl4oaZytcfe8qVOqNHpUlZqa0l7pv9KWRXyK3v454YoA1hfhfgMAAKQFAQCgMLge/F+09foBl7wfiWixpPMlPWx76KrU/1TS9AT3OGKzk+72qNeP1uhRFdp7ZkbGiO5F/yZpAWv9c6aM1ooA4BlvcCqA/EMAAMiNzjS9q1s3/LjN7i/q59//Y0GA71qq+jRJP7FgQTKLmyNp2Oa4jRpZrgMPaOp9+vLXO7Vly64dCAOBsLp7Iqqve2tceMD+jeneDLeG4ARJV0qalO4XBwAgT63kxAH5hwAAkBvL0vCu7ov3Nkv736m3/5q1O3X7c/8+02oAlFn6+suSbrSe/540Za8qzZzxv5bvkyfVaHI/w+8ef1jdXSE1NqY93d8ZK+nzduyavXqsUBBCdiPDAQAAZAwBACA3/Cm+68u2Lv+h/nr7L12200NuUPEjVxBf0iH2d3+uvca/vHj+J0+q0vRpdSopGTjTvrKipPeWAQusA8K+FPrzlJFWwDZcYPvlgngtkoZ4YFsAAECBIgAA5IYboa9JpJBcIBDp7e1fUVHykM+nd0lqT2DLX7UgwF6Shlsq+8VSb52ANV75HfD5pJPfPSzXm+EqzZ8i6WpJg3O9MdjFkAINAAS8nJEDAAAKAwEAIDfGxPuukYjU0hLQkqWd2tYSXNvdHf70kYc37TL4r6oqVVXVHmfCXSu/Oda73v3tHyPpbEmXeGHgMWxYmQ4+sCnXmzHRjsnnJNXkemMAAACAdCIAAGSXa2P2ARtgxjX7HwxG9MKL7Wpp6R2ju8bk1z74cMtpkrbEPs9Vvx86tHxPZfr8lgUwRdKH7LFDrchday5/D0Y2l2vO7HqVluasuL4rIPBOG/wfmauNAAAAADKJAACQPTMkXSbpWEkNcb5rV1mZ79q2tpAbvH/dHjtO0gWSLo2tJbBmrb/3NoCtVjtgmi0HuDfBpQRp19RUqrlzG1RVmZF1/PFw5+IcSWfa+nIAAACgIBEAADLP/Z2dKOmGBNb8u3n8dZIu8vl0VzgccQPTAyx44F7v05Ket77/ibbmW2Pp/7OsjWAo278DJSXaUeDvyMNztszeZ2n+v5Z6ayogP0y0SvmFtl5+u91GeGBbAABAgSIAAGROpa25P13SZxJ4Fzew+bekb0t6zIqduUH7VZa+P8kK+Z1nRfwWJbgHLmCwWdKDuTj3FRU+zZ1Tp9GjclpY3836H+aWU9iAEvmj1oI3habDbgAAABlDAADIDDetfZoN/qcn8A4uRf8mST+RtLrPvz0s6YeSrrEZUJcRcJGkjyeRBZATc2fXqrq6VM3NlbncjHGW7v9JC6QAAAAARYEAAJB+s6zY3v7xrvXfujXgUuIXNTWVfVXS//XX299S9W+zfv6ft79fV1DwBWtZ52nz59Vp3Njq3lZ/OeSCMddZj/9qfvcBAABQTAgAAOlTJ+lUSd+3/x+Qa/G3dFmnXnm1N/N3la3r7x387zOzRpMm7dKJrstmr+dLOtCWGfzAfu5BL2YCuAH/zOk1Gj8up+NtV+X/w5J+mcuNQFoUYvo/AABAVuSs7DZQQMpsPflPbOY/rsG/s3JV9+bFSzrDdtcV+PuEpffrpVc69ae/bO699cOl/q+IedjVB5jpxUM6fVq1pk6tzeUm7GXH54ZcbgTSZlL0b6TABHNRkBMAABQXAgBAasZYe75fSTpFUryV7dyF/n8rK3zn+3z6pz3mZqnPt370A3nKagG02PNmS/qipCFeOp/z5tZq+rS44yGZ8A5JP7X+/vW53BCkTVWBZgG02g0AACBjWAIAJMcFzw6xSv0HWSp+Iu6RdMm2lsAb4XDkSUkPSJpgA3iXSbBU0qt7eL1uqwdwkKW2R1PcH5H081yf00kTK7XX5BrV1OTsI8YN9r8s6VOSmnO1EUACAnYDAADIGAIAQGKiveNdH/4rEywkF22/5wr93eoeCATCrg7AMmvp90srGjjC/v2EAWYEXc/wc62g3VjbruutiOCb2T6vFeU+vf3owaqszGlikc+OxZVWIJHPOAAAAMCwBACIX72llN9r6feJDP79kv4l6aOSbu/n3/9l7f+67P48SV+yQf2ebJT0fkkb7Dlusf3frNVd1jQ0lGrBgsZcD/5rbfnEXZI+wuC/YDVQCBAAACA5BACA+Li1/t+09Py3x/tDXV0hdXWFXbr+tZLOkHrX+/dX6Ktd0i0xlfyrrSDgUXEMdp6yIndtdt+1IbxU0uBsnNuqqhLtO69eTY3l2Xi73Rkv6WuSfmZLM1C4xhVoEUAAAICMY4YMGNhJki6TNC3etf6uvV9LS0CvLulQd1d4S1m5z7UG3Dhr7zoNGrTbgfIKCzIcZYXORlsq+xO2dGBP3PKBfSR93AZHH7DWgDdmsrL4EYc1qbq6RFVVOR2P7W0ZGQsSKMIIeE0LRQABAECmEQAA+udm3YdbZf2zE0z3V1tbIPzk022Rrq5wqQ3kr3D9+x/6T8ueiny5mf9nJH1B0s1W2M8Nbu+wIET3Hn7WBQh+KGm+pDnWivAsSY9Kei4T5/igA+v3FMzIBjfYP86yMkbkckNQmJ4bN1JDtm5Tw9aB4m9p0RWzBAgAACAjWAIA7MqtMX63pDstAJDQ4F/S+srK0l/4/ZG/WG9v532SPuRq5cXx87dZPQC/3T/WCgcOtB0vSbpcUofdn2qBh6YCO8c+6wX/HUl/YPAPAAAAxIcAALCzWTaTfrul4ieaJeNa+p0pRc4IhSLfjWnl12Q9/ufFWcDsB1YvIOp0ScfHsfb5TxYEiDreBsqJtin0smNs1v9MPsOK1l7FfgAAwAO2cBKA/MPFM/CW6Lr5O6343qAEj4ub6f+dpNMk3Wez98/a2vROG/TPsd70A1X2l7Xxc0GA5XZ/uC1FGD/AzwXsPe+Kecz1wv9cgZxn1xnh15KOLrCgBhLTzPECgJxbzCkA8g8BABQ7N8M/VNJ1ku62QnqJVLSLWOGuy6wA3xJJYfu3oFWlv8ue5173ZOv5P9B7uOc/ZMsBAhZEeMra/g3E1Qr4thUBjNhA+RxJh+Vp+zT3OTXFzo8rijiMNnAoUCH7mwWAfLCnukYAPIoAAIqZG/h/TNL/Sfp8EsfBzfI/Zr39L99DAS83c//vmPtfs3718bjaigC6ZQn3W7vAeCyx1oCb7LkTbDtG5dn5LrcCiC4Q8l4+s1DgVnJBDQAAMokuAChWsywd31WRH5LEMXCz7Ldam70lAzzXBQYulPQLSbOtmJ+boV8dR4X+Hhu4dyQ4+A3ZUoT9JF1gGQcnSFpqAYiUjGwuz0bf/2GW8v8xUr7RR6KFOfOFnwwAAACQScymodhU2Xr4f1pV/oQG/93dYYXDvbPwp1sA4dWYlP89WWRr89vsOTMlXWRr+wfSboOCRPv5u8DDpVaYUFZ7wBUifE+q57yurlTV1Rnt/e/aH/7Glksw+EdfszgiAAAAiSMDAMWi1CqHf13SBy21PG7hcERbtwW08MV2+f2R33d3h3/rUnX327dOw4ftWovu/n9s7ftQyNawHyzpk7Y977F1/dckMbiPlwsenCjpBUljbObUVdBfYY95TaV1X7gpjoKHKF7xtNMEAABAHwQAUAyabbB9urXhS1hra9D/5FPbK/z+3sl+V+n/YUm/eubZ9mD8y/J7n/gdKzR4kA1ivmJBgP9m8Dy4aMQXrdDhCKt9cKnVPViXwfdN1BQrpHihZWoAAAAASCOWAKCQuVn2I2w2+cfJDv4lvVxRUXKO3x9+NOaxr9trJ8rNvJ8RM/B2g/GbJU3M4Hlwywf+Lul2WxbgszZ6n4mzJWGmuUDk2+08fYXBP4rYWuseAgAAkBEEAFCoSqx4nmvB9+4UUob/4lr3lZf7brWq+tE2fBNsDf+EJF5zobXl67b7pVm46N9uGQAL7b4bZNcl80K1NSWaPi2pH90dFxD5paQjE2zBiOKV1l9AD2nL4HIgAAAAAgAoOG4N+QxJD0j6kaX/J/N7vlnSFZaS/ppdlN9v7ej8Not+hBUUrE3i9R+wmf+nbAC8OgsnYq0FHt6U9C8LCHQm8gKNjaU69pghKitLuQ1/qWU9/NK2YySfR0jAHA4WAABA4qgBgEIyTtIpks6UNDbJ/Qpaaz4XPPiDDfajAraUYLa11HOFBD9rxfR+m+D7tNkygpCl5WfL05KOkdTkShsk8p6jRpVr/tyGdGymC9K8w7oo7J/FfQcAAACKGgEAFIoTbXb70BTWtbvZ8DtsRnrRbp6zwVrpTbHbYCvs59oBvpjg+8VdPTDNFif6cq7v/5xZ9SovT3mSvtoG/p9MIUgDAAAAIAkEAJDvGiVdYmn0tZaan4weSRdL+ll/M/IPPrQt9u5SWxrwbxvQTrLWeidaxf2CUl1dov33a1Rpacpp/1MtwDKbNm5Av7qsaCeQis0WnGZZFQBgF3w5IF+VW0/9P9iMfF0yg/9IRKFAIPKKpGMlXb+7dPzOrnDfh1za//ctcODsa4GIgqlgX1dboiFDynT8sUNSHfy7IMlJVlBxPwb/SIPhBXoQV/ZZdgQkaoO1qr3Uir8CALATMgCQj6ZL+qD19R+T7PYHgxH/5s3+bWvW9vx8ZHPFf2L/raTUp+YRlXv68W7LFpgXUw/gw5KekXR3vrfyamoq1fx59WpsKE/1pVxdhs9bscRB6dk6oDebBMDO3PfOvZJcy9q/WQDgPEnjOU4AgCgCAMgnVdbS72xb65+0QCDSvuy1jtZVq3sGdXWFL1y1uucJSY9EX89VuR83tmegl19lnQLm2EDXVbL/qqT/2r/lpYoKn/ab36D6+pQ+HqK9/b8k6TA+awAg49bbcrRogdebJK2zOjWTOPwAALEEAHnGpdz/XNKCFDf7v6+v6Dpm6bKusq6ucI2lE//UBvG9gsGIXl/Rs+O2B66N37kx/zzTMgPy1nHHDEl18O9S/D8l6Vbr7c/gHwAyz3WpWRjzLu7L63f2HZXNbjMAAA8jAAAvcwvP6219vlunf5atJ092Qbor0HeDW48eCkWejkT07Zg++HtJ+pYVTkqEK9j1R0nfs7W7Ebvoyrs1yvX1pTr+2MGp9Pgvscr+10q6RtLoFM5VtvitG0PsrSPfl3AUiZTXp8Tjn3NnZvNo7lJsBIiTC0bf3E8RyZDVX1lg36P8jgFAkWNmDl62j80knyppaIrb6dr6XS3p9zHt9+6x4n0ftcGEW17wnKRbYor7xetaW+MeskDCxnz5zXIF/mZMr9bw4RWqri5N9mVcJsVRkr4i6ZD0bmFGPSDp733ewB2EYVZYMqqqT1XtQdZ1Irrv0cCRC1ANyaP9z2cTJC0rsH3aSPAJSXDB7QsteLk7z1txQBecPYgJIAAoXgQA4EVusPUR6+u/d4ozfX5LgbxK0ks2QNe69b3je1ct+UpJB1jq/mArmPS4FfNLxHob/HblW6rl2xY0atCglCZTa6yF4qds1j+fPGlZIQOpsIBA9KK5NqbjQ2VMsKDSslZkheoq7P4Y+7zdx/47pk+AAYlrLMBjti36GQUk4HbLABjI81ZDx9UEOIYgAAAUJwIA8JoxNlN/chraxW23C53rY2b9e7W17bjGXiLps1a4T1Yoya1dn5vge4VtFiarDj+sUf95pNW1M0zK0Uc2qSG1Sv+jJP0qjwv9tcbxHFkgKfb8bo7jZ6LpFL6YC+3oYyX2+GSbyZ7mmi9YQUl3f0q2UtwB5LXn7TM4nqy1kD3/FEn3W/AbAFBkCADAKxothfwbSQy++3IXOcttRv4PcTzftUw637IBKm0Q5iopf3GAlMqccZX6582t0+BBFTr53cN22Yzt7UEteql9l8e3bQu6DggaPrxce02qTmXw72b9j5P0ozxvMbUwjuckK56Z3IV72IZmCwZMsGMc/f+R9nvaYEGCaDYCs3lAcemytrMvJ7DXEQtmHi3pN5KOiFnOBCSKjCUgDxEAQK6V2npElz7+fhvUpKLVUv5/aAWPdrFhY78TJT+x2ZAP2jZ9TNKL1h3A77XfEjf4HzWyarf/Xl9XpkMOatrl8bVru9XdE9akiTWpvL0r9He63ZpTeSHs0Xq7PdHnSXVWE2OyZQ2MsaKTo+zxMVajoNB7fzNoQbF7QdIvk6wb4SLEH5f0dUmfYUkSkvQ6Bw7Ys45IpZaGdn/NngsEAJBL7gL+05LOtPXSSVeMb2sLasMmv7+zI/TTKVNqrqipLm3Z3XOXL+93iX63VfJ3SwAOtGJu59nMykNe+i05/G2NGjw4udURo0al/AHkCvxdEXOMkH3RjgVv9Hnners12d/WYMsY2NtuEwqsF/hESQ97YDvSbbMFcYCBuM/itSkcpa22TC5gGW9JV4FF0Url9w8oCtvDFfpH0FuXzAQAkCuNlrp4dKoXHR0dIf33sRb5/ZGKSERzVq7qqfP5tFMAoLzcp+OP3WNx9ojN+LvMgRutkvtkWxrgOghs8cJvSiqD/xSV24z/5Um0SkR2bLdb7AVZtP5AtObAYGurOcuCOG/L43NT6YFtyITX0rAMCoXPFf77Wxr2cpMtl1ss6Wf83gBA4SMAgGzyWYryCZJ+kIbWfm7Qvm3pso7lPT2Refb7fEwoFHHdA74amxYZDEZ0732b4nk9F5TY3wb+pdYa8CxJ387FWrchQ8pUWeHTrH3q1dIayNXgf5JlaXze1v4jf0Ts9zb6u7veUoajaqzmxSz77362fKDJluMU6iDby5Is6YkislLSZWn8XXGfD7dZVtc37bs56Yw8AIC3EQBANh1lKf/vjGmVlgqXnn99IBBxvdy/L+l99lrnSnrVZkiScblVZX+X/aybHVkq6a5sHqyRzeWaM7t+R2/+mpqsZ2e6z4d3SPpSns8UY/c6re3l4/aMaluOM9VS7Kfa0oGpVvsBQG61Wy//NRnYip/bZ8IlBbZcCAAQgwAAssHNJl4g6VRJ49JUrfwBu0hZaEX6zrOiZ/tZ+8Dv2aD90SReu80GveNsVrTS1km+KemRbBywwYPKNHdOvaqqcrYks9H6RZ+Rh739kbyuPp0J6mw5zDD7e1hgt3lpaNOZKtbJoxg9Zd1tAhnYd9f15g5bFnBHGoryAgA8iLZRyLTZkv5iKfkT0vA754r1fU3S8ZKejqnQ/6bN1G+w+8MsCDA8yfdxwYNvxaz9n2AtCkdm/pC5/v6Dcjn4r7G+0pcx+C967ZZu/IwNOi6UdLD9XX1I0j1WdyAXRhT7yUHRabXONCszuON++84+wupRAAAKDBkAyBQ3O3eizdKnPFPn94dVUVHykg3q797N2sfHrIjRF60v+n6WeXBZEv383ev/U9KttqSgymY+XbvCqy0QkVb19aU6YP8GNdTn7M+y3qr830j6J3Yj+nfXan+Hd9ss4b4WlDvAlgoMY/Ywaa4Y6QfydNuRWS4D7d5E3qEzUqE7u8booVBC5TzcUqAJV9esvqCxpOvrVb7QPDoEAEDhIACAdKuxtf5fkHRkqkXEurvD2rotoHVrezRkaNmVlpbYa8L4XerRubWLN1vWwTvtvT9p6cx3JvH2bvbzBisKeJRdFJ1lXQH+lO4DN2FcZS4H/+Ms3f8zNngrFhuKaF8zxS2ZedBurv3gPnZzg4b5VmCQHuPx68yXDUVWuSy3iyX1xPumXZEK3ds9KtHBf5nV6vneZV2jHz2pouX3h5Vv3l7lCx3J6QaAwkAAAOnUYGnyp0hqTrWKcCgU0ZtrurVkaVdvBsCqN3tc94D7rXexNm58awnkli07LYVcbRdJ+9k2uMHsVZKelLQ8ic1YbR0B/mlpz+41r7NZur592PPVPrZPBxRhlf9kfiewex32t/ak/S41W0bA4ZYRdADHDkiK60TzSiI/+LOusXoilFCpDjfLf5J9h9a0RkqOus/f1DGrtPOSkaXbL7GisACAPEcNAKSDz2b5nrCU+5HpaCEUCkU2tLQEn3WDf+MuTD4RDVytWevvvXX37LIa4BWr4B/9h9GWOZDsLOSLVsAw+nrjrCNAbZKv5xU+C9YssvWexdjiLxjHc5AcN5P9uqSHbRnOwVZU8xoLFKTawmwq5wVF4h+23CZuF7ZPS3TwL1sCdl3Msr2u1kjJw1/qHPOUte+9nzaVAJD/CAAgFSVWHO+rNuM3I01Hs9WKi+1nKfxP2OO11o9+QRyv8ZykS2PW6rvX+noKQYBHLJMg+nrzrBhhPg6afbbG/zorKAVkQ9iCaedZNs3HbVCzOIkaHUpTK1HA67ZYLZqWeLdza7gm0RYBpbZk766YQrfbrfvNjTGB0tMk3cQyFQDIbwQAkKxKK1R1uxX6q07DkXQDhCWSvulm+oPByJtt24OLrBp/dIAw2d5vUByvdZul7oftAudjlkVQnsS2dVt9gX/b61Xa7PmxeVgcyW3zLbbmvxhn/ZF7bgDxa/ubPMUKd/5O0jrOjTZ6YBvgDSFJf5f0ULwz7xtCdfpZ1yhticR9eecy6t5nnV+iXV+2WoD76phOO7L2gJfZdyEAIE8RAEAyxtsA8lpLHa9K01H8j6TT7eKi09UAaG111z+9g/gvxjzvSJuVGMgaSd+VtMqe12xLCJItcrfSuhBstvvjrPXg4KT32AwaVKqxY9MRQ9mjert4c7NJR1PVGR7gBhfP2+fJmTYQ+XYB1ddIRjHvO3bWYt+Hm+M9LuvD1VoYTijGfagF2WMH/1+2mX5/P893hVMvl3SOWyLA+QKA/EMAAIlwMwXH2DrAj6fQY78vl174c1u3/0g/VY5DNkC402ZB3MD1w9aeb0+1BtxzH7eLlZD19neDi7VJbmfEghSXWRZA2NKX467KvDuVlSW9twzx2cXdLbZcI+W2jEAGbLK/V7dUZ6KksyW9tIc6Db501BqJx31HHJrN8x3K5pvB01yw9r/xbuDmcK2+3z00kf2ZarP80+1+u31H3j5AfRQXmLjegnbJLN8BAOQQXQAQDzfg3ssK4Z2Tjv7ekYjU0hpQwB/pKSnV10pLfD8eNKh8oAvfS+2CZV+78D/XCtg9ZIPx3bnNtvmPaZpdc60Bp1iGwc22VjJpY8dUaL99G9OwWf1yKf6HSbrCWrIB+cINMH5pxcc+ZQUEY4OOdbYk6DXOKArQIgs2x2VNqEEXd45O5Cjsbd+N0e+FoC3L+UWcxVFdQPy3lll2EYFlAMgfBAAwkEZb6396Olt4bd0a0KOPt8rnU1kwGHHBhZLZs2p2CgB0d+8ypncVxa+0pQejbCnChZKWWbu+Pflxms/0xRZ0SLDW0s6mTqnSjOkZa5Hujs/nrZBiurI1gGxqk/QbSX+z2hUnWzvBJs4CCliLLS+Lq9je0uAQXdOd0Mq2Q60bR3Tw77fvVVf0b1sCr9NlSwXWWMBuZBw/AwDIMQIA2BM3yP6hpOPSfMHdtXhJxzOhUORtll3gKgu/8uKizusG+DkXIPir9a2/1JawHCXpC7ZmMZtSTvvfa3KVpk2tU0lJRrKYZ1vXgiOsYCGQz1wg4PdWhPOntjxgNmcUBep31j4zLi8Ha9Uaift75CBJP7JONrLB/1VW36Z9dz90Q+fk3f2Tyxa47ws1yzfY0oEp/FICgLcRAEB/ym3Qf0c60v1jRGwW/3Nt20PP2Hr/WdZBwM0+PGNrgPek2woWvcMyEiptNv5BSQ/kS4/i5hHlmrVPRrqYlVudhtuZ9R9Qm8e3DzuLWIGyh+12oLVIKzQDfQaisC2zz+/dDsZjLQoM0+8DtfEeEFew9qyYZXQBW8Z21UDv93ioor+HfVYM967Ht8+47diy7vefWv3G7SWKzMtWfQ4AQOIoAohYbjZ+rvWHvyfNg/8um8FzKbz/sl7/bg3/ipjn3GBreuPxESsQFnV3vqxxHz+uUgcflPYM5hLr7f9dy5Jg8D8w1o7ntycTTFcGvM5v32VPZWg7W2yd/6sWUPujBdSTrWMz1a4XXDD+5geCVYc95x/+JUlPpHm7AQBpRAAAUY02IHczD59JY2s/WRs+V9n7s30G7Y/bxUOL3Z8p6fw42+qtsGUAa+x+vbUQ87RpU6s1d05GZv6PsSr/Z3n9GAD5Zt7KZBuHAAl51Za4xFOELxlha6t7gXUYuNiyapIx1joInGCTBz77Dn/CluXdw6kHAG9iCQCc/W0WwFWLjzuXMA7uYuNRG/w/1k/BvG6r8v02ywyotHoAbvbjV3Gk8//DAhau0N3PbBmBZ7k1/1On1KZ7zX+N7b+7oGsm7RJIv3ErXueoIhvc9/DKDL9PyJbLPZbCMijXa/BeQ2di1AAAIABJREFUqyMQnUhy979phQuftzodLqPho2ncdgBAGhAAKG5usP9+SxtPd/VeVyTvPpvR39P02RZ7jgs+DLHWXj+w+gAr9vBzsv7D11vK5KI0b39ajWxO+5r/Eqvy//18yHwA8tUxL7zCuUOmuWD3X2wQnZAyRVStiLoSi/2GUxj8N1rm3r4xr/UH6xYUyxUF/KIFAU6hGG1BGqh1MwCPYglAcaq2WX+XMv6TNA/+3cXAEpuR/sQAg/8oN+PxMUmb7f4w6y8cT1/hDV4f/E8YX6mDDkzrmv9ya4X2C8ucAJABg7t6VBZIqdNnspJNy0Z+WmWz5wmbUb5ZJ5TH1S0wHUZYK97o945bqvAfSRdFX3tduEI9kR1zSxutVe/PUm2ZC096KV8KLwPYGRkAxcd9gZ9hEfmp6dr7bdsCau8IKRAIrw2FIl+PRPSHqVNq+40Or1vfrWBgl++M++3C4jJLa3cBiq9Ze7/WfD1Lbs3/9GnpXFXRm3p5vgVXRqXzhZF/uia9Z8c2V6/4sxTJ1NLh4jRh01bVbM/Jx88y63KAwue3pWyvenxP3cTB5ZbSH60R9JgF+3csW/htoE4HlldpeOmOpgJb7bu81eoADcnJ1gMAdiAAUFxchf8fW8Xe6nTueWdnWC8sbFc4rGGRSGR8JKKS9Rv8/QYA2reHFAz1GzS+3Xr8f8Luf1DSc/Z43o1sJk9yff7TuuZ/vi2PWCCp355MKA5dk9+rYN0Ihar+t6wk2HB6v3MxFZteVeXah/jNSFBze6fGrF6dV9uMvPSstdzt9vDGu6D8ndZ+N/rd87KkT1lr350+eW7pHqmqnR9qqfFFvn1mzXL33O/FWegXAJAhBAAKn8/W+n/OBo/pFg6FIhteebU9GAxGxto6P1fI6MEtW4LPJvhebqbgJkn7WSDAXSScZwWFnsmnM+XW/M+elbY1/+6YHm5LNsan60WRPyJldVJJuVrnnb7bbQ5V9v/71jX2gN5bf8raN6t2Wcyy43BAvmBc7ccLXo0/oPIeL4/JUAA6bfCfUkvSaoV7y/BnaEG2+/65UdJJdt8t83tB0pG7qyOwOLzLpaW7BjmrsWvCrz9UvaqhTOGvEQQAgNwhAFDYKm222LX3Oz4De+oK/f2ttNT3HZ+vd1Ygum4/OlvwTktlTYTrAHCV1SaotrZCp1kmQDgfztbECZWaO6chXS832dImz0lza0bkATfwDw6aqe7mOQrVDEr7Bgfrhu4UVCjtalXVuuftXljlm/Iq7pY2pZGI5r2wsED2Bh72iHW8ScnxVW/q4eBUrY6UpntP662af3TwH7E2f59LoIigG+j/SNKp9werD23oHv3V4yrXra3wBa8koA0AuUEAoHCNswq8rljcXhnYy22WyvfrmF78rt3fDyUNsvoCrkL9J+25ifiNpCm2btCtMfx7vhSamT6tujftPw3KbNbf9Wk+moKdGbHKqxvmH3mYQrXDFC6tVKApnlqY6RGqblTHpCPeeq1IRJWN/7s+r37t91nbjlzb//Wcp/6TelD4Wqx4XrLV+LPh83YdEa1iu8SKFcZbr2CQ/fx77Tvs2N8G6p7o0ejvv79qZasFBqYV+e8BAGQdAYDC487p2yVdIWmWVYxPN7f27wuSHrcCRlFuhLC3ZRy49z3GCg5+P8E1/AFrTejSIh+yAIPnAwBuzX8a+/x/zgb/oxn8Z8wWr21QuHqUOqadrHB5lSIlOf549vnUM2TyjrvBujN3/H/t0j+ppPPNHG1Y5o1e+UauN2GxBQBRuL4t6UWP793wmKJ9LlDxGUlPxrnaoMyyB86zJQCy7/R//TFQE3h/lf5h2X0uCHBwBvcBANAHAYDC4bNouxuYf8lS99KtS9KfrDJ/f1fI263dj/syP8SWApxh6/f/L8FBvHuvX+bL2Rk1Mi1r/kussr8Lfpyani2D10VKq3tT/bfv81FFyrxb2zFUWbfj/9tmnbLj/6vXLlT5xud6/98X7pEv4OUJzYG9faEnirH743gO8lM0jf6udG59c0lIq0NpXwLwPes8c7gt6Xs5zp+rsoH/t2IeW2vL2Z6w+xELJnzBMglnpnvjAQD9IwBQGBolvc2i7cdmaI+W2+D+lr4zp23bgwr8b35/sV00/NRaDrqlCJfY4wVZUnvSxErNmZ3ymv8Ky9z4hnVpQBGIlNWqa8IJ8g+ZmLc72zVqTu/NKevcqooNL6l86yL5gh0537ZEDenqVrmfsTcyyi2Ju1nShnS+ybk1y3Xq9hnp3u5Nkr5iM/jxFiocYtci34x57EVbTvBYP893RUc+bm2Aj+C6FAAyjw/a/DfF+sKf7IrPZ2Bv3ND+31aY71/9PWH16i51d+9Un+9+i/zfaPcPs1ntzxTi2tbp0+rieNaARlgNBXp/F5HOySdldY1/pgVrBis48TCVD5okX8ivsvYNqlj/SN5s/9jNLbnq+4/i4L4o/yvpgcwV7U+7dQm8YJUN5s+LecwV9r1gN4P/qGet/a+bPPgQ16YAkFl8yOY3V9n/eptlz8Raf7/N5Lsv5UQW/Lqgwa1Wg+Dz9tiHrHVQJloR5sx++9apoiItS/Rdx4Zh+XkUkKxCGvzHiu5XYNA4dY+co7pX71ZJ90avbF6/XN//8StXenDLUEBc279r0j377xFuGeL7rHhvo23SCstq22Xwf3nHlL4PrT24rPMrb6/srSlMEAAAMogP2PzjFvk122zx5zK09W5t3mb7Iv/pnp4YCkUUDPa7tN8V8rtc0myrB1Bm1YBfsIyCvGjptycVFT5VV5W6WmlAwtrmn1PwB80VMoxUlKltzidUEuhW3Su/7X28pGezFPHWBGhtj19l/h4PbEkvIhGF6R77/suISb6QXk9/K8B4lNuExC1W+0e21MEVOvxHfz+/JLzT5af7+aOX+Bs21vtCZ+xfscFfosipGZrYAICiR3Xx/OJyzT8g6W5Jp2doyzus7d67Bxr8O5s2+fX6it1eNG+w7IG1dn+EVbbPRFvCrJswvlJDh3q3aBu8K9g0U5GSnFyo54zrbNA257TeW8/oI+VvXqBg43RPbJuL4c1d6KmC7Os9sA1IL1cH58JMHtPza3LSmcMN+D9m7Xujg//Vtgzgtjh+vsyK3rouQrdd1zPoqO3hqvNsCWFLhrcdAIoSAYD84QrD/UTStTajnolz59bnX22ZBU+m4fXCVjfgZltOUGLFCt+X79knNdUlGje22gNbgnzkHz5LkdLindzqGj1fneMXqHPS0Qo25r4N+MHLct72D4Wt3eribC2wvYyu+b8iZvC/wgId8XTxKbX6Rd+yn3fVRM+/v2d4lRUPvpxgGACkH0sAvM+tDf+ofRmOz2DQZr29z2NpLtTn1jz+P3vnAR1Hdb3xb6t6l2VbcsMYGxtTbMCm984fAgkJJKTQa2hJ6KEmQKihhU7oJCGUUENvMd3Y2BiDbYyN5SJZktXb1v958rfJIFS2zcyb3fs7Z452V7s7b97uzrx3373fp4IKu1Dl/l1aCWopgDRzRiFGj8oZ/okuwO+T+JmQOMGq2QiWZGbtf6JE/AXo3OxAuCL7oXjebba1Y3TtKtv2LWQFzwJ4LQMPVI1JjmdZIjiOuAjA03G81sUxwfUAYidEpcD5zxdC+c1HbSwjvJ2aQlfTiUAQBEFIAxIA0BcPVf1VBPynDASYQTdr9JRK7zcm7kOVLpwL4C+6CiBtOjEX48fZtqqfQ79lwTqst6V0eRHJKcm69P+hiHr8UGXLLbPPg7+lFrm178LdXWeZRsDen39lyX6ErGUNfe6bzO4ADyIY6wqj1jodgOXMTBwLoAjAzSwFGA43sxqVtXANn9tOt6H7qCEEZg7eysDA9SKUKwiCkB4kAKAnKpp+ECfMZhbJrqNoz10WpNm1Uw1YS7xeF0ZU2pqS7TMoJwvW0GB1P0dyR6C7ehv5eAchUDoWgdKjkbdmHnJWv276/kZ0dcPfo43wn5FOfZoipICKYj0D4G0rOrHY3YOjcppxfY9lsWS1Ov+QQZz45jheo8adBwK40zD5b6Fe0E2c9PdH7WM9/6+HcIggCIKDkQCAfszmxH9vAKUmtk55EV8O4EMZbAI+nwujR+dq0BIhk+mesI98vnGgNALC+ZXwttXCX/eeafup2dCqq+//cg3aIKROLVew01lWpxtBruS7DCv3Q7ETV/pjk/8NLHG8b5jXqxKKc6g3MIP7EwRBEJJAAgB6oS5ulzGVzqwCc3WBfYSr8Wuc2lHpZu+9yjPrgAQtCRaPlg8mTgJl4xAsqUF3zXYoXvgAXME2R7Q7TXRnxFEIFwD4Ogt6IRTn87YEcAOAmPJnFyf098cRPAgxCFDLrIrNUmyzIAhC1iIqZvbjZTT7WYrllZj4uaxjpP1Mmfz/j9JSD3xeWUwQzKVt5q+lhxNEaSVEvTlonXkKInnpDZ6Mbu/EpkuXWnAUQpbyKoB/qK+xlYef54qgwhXRsccn0lp4e67eB6iN8MAgaf8DoUoqvmAJwaI4Mw4EQRCEfkgAwF6qabn3OH33zZqFqsj5mwB+xdS7rE/5NzJreym9F8wlVLYlou7stf1LBx1Tf4xA9R5pCwTUNInFuGAaa6lcbzmTvU3Y1atdxcEsBkNm836AKf/KMaA5ifdbzjGTchvQUsRDEARBZ6QEwB58rPE/j9HwQhNb0cKo+10mqvw7ls0n5yE3R+JggrkEKqdmte9/Ooj4ctE1dha8FZNQsPgxuMKpZcmP/0bK7AVTUKvUfwMwV7q3j10o3rcd7wdYBqBE/wat6/ln9/gh37TEHV65X87qC7mQdbiMZwVBEOJHTpjWU0jLvTMAVJi8d3WhPQ3AUwmk2GUVRcVeeDyS/i+Yh/L9V/XsQnoI5ZejbcYpKJn756Tf79D3Ptb90wiwTKsmjucKerGYqe2SaQcoX92jDZN/lbJ/23CTf8Wzofwh39irKoRQs2KfnDXH0NHltHQ2XIiLFdJNguBMJABgHUpifjqAK1m/ZiZdVPlXRcfLsqBvk2LiJjkYUyPK/4KJuH0I55YBLskySScqm6Jl9nlJv2P3t7fCt/xVHQ8tRit1YX4MoFIUzx2DKrd7EMBndja40hXsSzPUoEBepencTvG/Hfmdvn64yf8wqIWTG0JA5MFA8blFrvCG7f31p7sRVX1/PIACS45MAO2dBUFwIDIqNR8XxW/Uqv8LFkz+ldDfLQCOlcn/4KhV/5FVObo2T8gQIv5y9IzeSj5OzfjnT87E2tnH6dzEVpaInUgxOcngcgaf0LPeVvbIWauTEOAX1Dq6lzX/9Sm8l7LruQTAT5lZcOVtvWVVHwVGggLHqrSgLn1NFwRByEwkAGA+B3NAcDGAkSbvbRkvtNdQhEgYBK8XGDVKAgBZjulF4F0TD8j2PtaWd3c5GGt2PEHnJnZyxfRkloxJuq3edNNhpynbO2IAvqDNcSqLEipd7ySKGedwU3aC/r/0loGr0Tcwy7LLrAMRBEHIBKQEwDxUAdutAH7OC5XZqDr/XwDosdp2yInsv5/Z8guCA2g1s4ntW5+CcG6x2b0wE4AxyhCm2GdsFayTNcnayYLbTac/B6/tdigObW1A+eJndW7qt1RM/w9dXA6S4L2W3Azg02zvhCFITbVz4+T/SoooKxrptGC0NO4AcA/Pe6r0oCjtRyEIgpABSAAg/eRR9faPBr9bM1Er/Xdz8JHqBTYrqKjwwuOWklrBXJSHvQUoe62r4tzNUrqC1ALYwMmKSsddyQBBJ88hbdmSch52u/HMD07EEcEASpb9W4MWDYrK5/6SmgCqduF3AMbKNVwb5jHFXZvg+3RPAHWhjNC4KeTk/0bDY6uZCfDWAM9XQdCHeZ67H8AE0dAQBEH4LjJ4SC9bAzgSgFKlTY9Z9dDM4YrQvyk+JMTBtjNkUUDISibzoGfx74n8qyb96wGsYkBgKdPNV3N1bWWmiz09dcTp2P+tatR8eL8GrRkSFai5A8CHTDdXXuhlGrc3G1CZRA/w96INx+StwOvtU53e/aUATmF9f4yF1FR6c5jXqoyZsxkg3UKCAIIgCP9DAgDpIY+iNGfyQmN2v6o0t7+yxEDMrBNg8yl5yM21ZGVWEJyCOn+N5xZDZQM0M2NApdp+DuADbisz7ZNVy7bv7nwQdnW5MeaDezVo0bDMZxbAe9R8kZom+1B+/0/qIbofP8GRYxF1DT4n9tfV2p3QoMZRP6QYZkzZX5UznTvIyn9/1KLIyyyHUj9qUWMVBEEgEgBIHRWh/jNX/vMs2J8ajF9An+FeC/aXURQWesT3XxCGp4DbGD5zNwCnMr32c054HmeabUbQpTQBdj8EhzXXoeyr53U/pCivBfdTKPAJALtr0K5sQ00y79RVeb5n/OTB/znE5H/jazdD7rdL09+o+NmVY6uYkEoLgwGvJRCZUKVMHwPYm8GyITpEEAQhexAhoeQppaXfe0z5N3vyr1I/F7AG9H6Z/CfOhPE5GDvGihiNIGQcbgaMlaDpdgD+xDKB9wFcCGA2gFEGgS5HEnG58fThJ6N580Oc0vwIyzcOM7i/iAisdTxNAV6taPGMwGnlh2yc5A+2DYfLhUDNJoh6/VYfmtrhDwA8b5j8K2eFSwG8ONj3uy5cNNTWyPHaczJ2EgRBkAyAZPAwlewE+tCWWLBPVZf7CICb6PMvJIjHDVRXi+2fIKQRdS7ckVsDywM+YlDgAycPtP912EnY752RqPngPg1aExctrHVeyNKAbR3QZqfzNYDzdTuGBm8NHiycjvWu1EvdIj4/giNGw9e4Dq6gJbqgSrXwCADXG9L+lbbCFXTCGJTfdY0Z6t+bnpnTvHy0p/u3Yz2tajHlRzx/CYIgZCWSAZA4pzH19QSLJv/LKHjzB5n8J8fs7Yuw+26lGFklAQBBMIkRFKS7jIJoT7MsyopzZNqJuFx4d6cDsWbHE5zUbKXb8E9azz6ULU4ONhGg0492ehhrfBX4yJO+TLdITi6CVTVpe78h8DCTRQWyRvJp63hOeTiF91Xnpcdv7S3b6f6ekV+vCxepANltph6JIAiC5kgAIH7GsfbsFqUlxzQ1s1Ep/3sAeIzWXEISFBd7UVLi6MxkQXAKftpuKa/6v1Eg7WiLzpdpRWkCvLLHYWiZfLCTmq00Gr4CcDqAy+W6YRqvA3hVt0Y1e0bi6vyJaX9flQnQM2FK2t+3H2NZxjKOiv1dXPn/awrBrD05ZlPOJ3/7OuKZdX7XmNpA1Psb/j4EQRCyEgkADE8pB7DKcmYfC6xkoqzpvBbATNZ0Ckmy7cxCFBZKpYvwPRpof+d0dPb5UufKSRQsVar1J6tUXCcFA9TJ+KkfnYoN0w7ToDUJobIBbqCF2hIHtdsJ1FOHR6uMvHrfWJxYumOfKITDUOPQ7TnGmsCmq8n/1QDuTuFQduNKf+w91Vhur8jGMoMoBQavptuJIAhCViEBgMHxUVVZRY//woGrFXwC4Aym/DvwWq4PZaUelMrKvzAwHU6z7RqEfC1b9X2mAbidwYBTDCm+juC5Q47D6p1OclKTwe+3ysL4JYAXqFgvpIaaOP4bwBs69ePXOZNxSdEMDVqSMCrtfy+u8m/CF7cxeHVDCu97AIMHW/B+LxdV7qCgcmw/1zIToN3CYxYEQbAdCQAMTBmt9v7KwZNVdayPsH7zSa7gCEnidgOzti/pS/93CE6ZyAlCsqgf4w4ArgTwEoCf0FVAe8JuN/6z4/5O0wSI8TFLAu7kyqqQPG1cNW7VqQ8X+Edig8txwzmVIbQTgBsZIAQn4jdy8p+siOgeXPnfnPfVhF+l/N88QEmMun8Pg5Ly2xAEIWuQAMD3Gc9VEzVITX8x3cAoBedjAfyKon+y8p8ibrcL+fmOEvmdFsdzBCETKGF502MU9xrnhGNSmgAv73EYWjc7UIPWJMwqAOfyuhZ2WNt14hJeo7VhYe6W+Ju/wol9OZa//604Fg1yMv6nFFbkp3BVfxLv99Kp4Z4hJvg9FHZWegFrktyvIAiCo5AAwEZUJHo0a1RVCv7+Fu03RLusn3P1X/yb08QhB1dmxHEIQgbjZRaAElc9CkC5Ew71ySNOR+P0H2nQkoSJpUEfA2CFBJoT5gPd1OMX507DlQVWVSemlU3pFhKrzw8xPf/3KQj+qSD6rRT8A7/v9zPQGE/5y1y6PC21uC8EQRAsRwIAGweh+/LCcTPtrKxgA2tiVU7pi7Iqkz6mbp4+CyRBEExnMoAHmfa7vRP8uV88+Feo3flkDVqSFEqHQQkavCtBgLhpoC6PNnyUNwOXFkzWv+e+z9YA7mLtP7jy/zBX6nsSeSMDW3I8tZ/hsQdYrtEU53tEWJp0FstmBEEQMpZsl0fPp+esWs6ptnDg+Q1TMZ8W8Zn0U1Odm2mHJAiZTg71VrbhROs5nYOiIbcbc3bYD7uFQ6j58H4NWpQwbwGoA3AdAEfWNFhImNfq93Vq1L9yqzVoRcJM5nduD75Qrcw/xNKKZGv+1TnjXgDbGR67hWOsDQO94P7u8fAMnHCp2vPyCfkrl7kReZgaBYIgCBlHtgYA3KxBfcQgFGMFUaaZqRTMxfYdfuay7YxCFBVle1xLEByJCsDO4Ar1WVzB0zYI0KcJsOfh+FFzHUqXvKhBixJC9esilmA8ySw4yQgcmJVMI9dC+C8KN54p2hnL3DY43LhcQDTpSkXV4FNpp+zmivuzAC4E0Jjke45h5lBs8h9hKcGFQ9m8vhce0onU9W77lOUPFy35KYMAu1lg/ywIgmAp2XjBr6EY0vMWT/7XM0p9oEz+zSE/z428PBnDCoLDyee58kZmZmnNUz88FY1b/dipPd5By7RbKEYrfJ+/A/iPDv0ScvnxRsEsPG6T6F+gegKivqSNO4L8nj3O791zdKdIdvJfxMyB3Xk/xM/qqqEm/0PgojaB+j2U3Ng5cVVrJO9YZn+IPpMgCBlFNs2W8ik0dTdTTEdZtF8VkZ4H4He82MVbjyYkSEWlFyNGOMJVTLCfoNQ/a88pHMxP1H0F7qUDfo7aXU7RoCVJo9Klr2Gtu/A/vqA+kBa8WrAd7sq1aujyfSI+P4IjRiHqG3IFfShUNsV53JQORX0KzfFSsyl2bniD3+G6JN9vHB0IVLbH9QsivsqFwdIVHLs9lEKJQiYjJayC4FCyJQAwlqtJ6kJ+MFPRrELlhh5Na8F4lGiFJFC+/1tMLZSuE+KlXnyftSeHQdv7LAzYJkXQ48F/dtgPa3Y43pk9vXH1X4moXaxBW3Shiynr63Vp0F9zqmxvQ8Sfi8DIMam8xTra8qUabGphqv+bKjZCQeVFSb5XIReHfgCgDMBxasHmlWAR6sOFKmhxDheOJAjwXWp1aowgCPGT6QEAFSHeFsArXE2ySuE/ygvFHwEcCuArmfybi9/vQl6eo3z/BXuRDABnkEt/7tdVko/OLe72+dFVVI6oO+nVUbvpYunFoZKp1ncNf1yX1P+wy4eLyw7SoCUbiXp96JkwBXAlPYRMh7aH+oyWAPgZANU5q5N8Hx8doPbn7ZhW040rox4ENmpDt/A5f07BqSATCWZ7BwiCU8nUAIA6Y2/G9FFldTTVwn2rif4ndBa4zML9ZjUH7i++/4KQwUzjADylpUezeXe73bFiz9Od/ik8z6y1pVlc+7yE9eq20+Euw0NFu2KJhoGlQPV4RP22l901phBQqGJ26DG8H+H47QDqFBjpBHAtgMt1EYQUBEFIlkwMAKjJ/8+5knEOa/+toofOAqq27d+ywmgNW0yz8iMWBMEmjmDKr9bRvrdm7Y0vDrlUg5akxJsUy13u4GNIlk7WfC+zuyG9rgI8WTgDL/mK7W7KgPRpAlSOTkUTwE5Uqv9FnPx7OF6bA+DXQ0zwVSbATQB+m4J4oSAIgu1kWgBgPFVg/0zrFitr/deyzEAJxiyQyb/5jBzpw377lGHTiRIAEIQsQJUD/BLAkRywa8vHW2yHz39whZM/kSCD2CdnodDXMqb/217vHXT58YKmk/8YEX9OqpoAdqFKNE+kmwAo+Hg2RZuHynxRv40HOd5b4sQDFwRByBTD9BzWgN1hg1iUSj37jNkGc8QuxjqU7V9BgXj+C0IWocS6rlML7TrbqUZcbny4+Uzc0fUIHl/YmfDrfxXuxI1NV8MXtbUUP8hMgN24Ij49C3SDIvSVX2V3QwKufBxTtnscz7SfmCaAu7cb/rrVQFTr9Q8fU/lP4301ZlsD4IcAvu7/5Au7qgdyIw0/ULj0KZ8r3M1x53hLWi4IgpAmMuFivoWybAHwgA2T/zbu9wiKBcnk30K22VrvlRFBEExBpfw8CWC0zt27vq4nqcm/4iFPAe4pPQMdns3T3q4kUAHuXwH4IE3ibTqjXHuesrt9Dd5qXFy6p9YdNRCRnDwER4xG1KNtgk4RnR1OMzw2H8C+A03+B6FATfhv69oELZG8lwD8BsDnlh2BIAhCGnByAEDVgZ7BVCz1t8Ti/X/GdLGz6W0rWMjs7YukuwUhe5lqEO7KSC7yj8LDxUch4Bqpw+Et5ETnEw3aYhZrmMlnq8r7em8N7i/cCivcVlYwpo9wfiFClVrG5lTgUPl0/p5Zo4ovAZyfQCp/EX8H98+L+HZ4vKcabZHcp1ma9LqJbRcEQUgrTg0ATKPI3zUAtrN43xHaCh7DtMjklniElKiuzpUOFITsZhNdjz4YjODVD1tSfp8L/aNwUcXv0tKmFImpo/+KejeZyHU6iB5u8BRjrsfZ17dwXgEC1RM0aMl3OJYK/jE76HUUunwnzuzNPAoEqh/k3gDufj/s3+uW7rEwlIG+bc2hCIIgpIaTAgAuRnCP4En2MKZiWUknAw+Hi9Cffey1R2m2HrqQPsJSsiOYRaA3gs9a0pMtf6+nCCUj78I/S85F2GVr2VOU1oCHAqjPoN9PlKu3z9rdkCbvaPy+cIrdzfBxRTulrMo+ccDR4wC3FsPMzWn3FzumdgYEXozTy95gRRCuAAAgAElEQVTL5yt7j9iPUOmR5CyJ/FeHaBGAoyieKdcWQRC0xikBAOUxMxvAXwD80xDBtYoQ68SOo/Jrt31dkd1UVnjh82W6DpVgAeske0cwi0ueqEv7O5+QuyleLjoWYZft5U/zOBlakiETnWYAjwJYbXdDTi6ZbXcT1ELLIRTJe46lNknTpwlQqYUmwFcArlIxFro8/ISZnPFQyJX/G+lEoljBFf9/93t9PceJz3LcKAiCoCVOmEmpVf+zANwH4Bc27D/AoMNxFJ4SbGTMmBzk52vtACY4g4Bk8Dieb3U8gCVfmeea97O8qXiy+FTT3j9O1KT/DQDncSLkdN7lhM1WgcM5+VZXMw5Ilfqa8e9uXHTZKZWxokaaAMq//wLqNr0a52tUNsRJLDeNTf6/4HjwuUFeU8fX3EyhaEEQBO3QPQCwLa31LqPav9Uzvw4AvwVwuqT828/IKh/GjsnL9m4QBCNWZ0PpRKOOjVr8TZep739S7kTcU3apqfuIgwBXP49lOrWTUaJwqQs2pICa/N+TV6NDFyrfwf8zjA1VEOBuALNSedM+TYAa2yU7Oqnb9GqcYzk13jySOgHGlf8z46j1bwDwB1oESsaoIAjaoauJeilF9i4BUG7D/kOM8p7J1QFBAwoK3PB6XfJRCML/GCt9oQ8LFrTgP3XxlBSnxrn+apw78i680/4utu56Ai57so1DvD6qevFHmCrtJNSK/8W81ttGyOVHgycPXbD92pbLMVeO4TE1CZ4O4G8A9uMEOKkvW8TnR2DUOPjXrwYitq2lxPvjVAGQA5j2X8XHGlka8b0x4c/bv18psZenp+0Xeauu8LnCbpYQ5KfaeEEQhHShWwaAlxHnu6jIa8fkv4NR4p/S218YhHA4iuYW8we7MbbeSnz/BUHQk56eMJparJ2I7160Gz7LP9Lu/nieyujr7G5IgihXgzvtbsQ3/ol4zF9hdzNAO7zpg/xPSfq/RpG7pC0KIrkbNQFgvybAUHgpMn2fYfKvdCKuAPDXOAMgM98M53qf763p6Yn6zmcWQfqFQQRBEJJEpwyATVhXper8x9vUhnW0iXla1/RSHair70VzcxDBYBTLv7HGMnnH2Rnv+6+dZ5IgCPHT2hLEC8utt5Dfo2hXPOsuwh4dd9n1aYUpoqcC9hfSK113mlijbWv5QsCVh3dztUj935FaS0OhxmV/Yl384wB6k9mR0gSAqxqIDC254IpE4G2yfM7s4xj0GsPkfz29/5+IM4NAlVBcDeCWp4MFDweiNcGj8lbexRIEVW4yyeRjEARBGBZdAgC7MNVqGyr+28EbvAAuEfXWgXnz7Q19j3d3RxAIWCv+vPirLowaldHe/5UatEEQhCQIhSJ4/t1m27ruvIKtcD1Oxu4dd9vVBDW5uYWaFOfY1YgEeJXWf7a6GFxZuie+cts15PkvqgFnsPRyOGqYBp+bSvZEOC++bPhwfgG8LU3wtFsm0bALhQKNaf9nUgA6HpFIVTbwZ07ylQaA+4VQ3kO1nZMC5xZ8/TizAFRmwRiTj0MQBGFI7CwBcHPFQAn8vUyRGTuuhGrg8gCVb7+Qyf9GAoEIens3bp8vasczzzagtTXct1k9+Veo/X7wYQtCIbHXFQRBL7q7wljcYZ+I/BK4cWjBDHyW/zO0ebawqxldXCl9RvPraC1TuZvsbESnu1SHyb+LK9Z78nY8jKC4nfqsTVXljXq8CFaMRCSvwMzdxJjMrJDNeL+d1oFPxTn534VOA7EV/kIGEjwron1rbUFaDx5DkUAZzAiCYBt2ZQCoi8ZeXHHfJ4ELT7pZCOBeAPdQ1TiriUSiWN+wsRs+/7wDHZ16mR7U1Qex6It2TJtaCL/fCQ6WgiBkA5c9Wa/FUSpNABTthk9bX8SknuftasYJXB0+nCnVuqEs/96xu023F++gQ7eoyfzRAEYl8drrARTzszb1BxAYOQa+xjp4OlrN3E0BJ+kRBrBUkOPBOINZMcvEmBpgD4MBtw3gAqCyTQ9lmcGuNrhbCYIg2BIAGMeUqh8zDcqOyX8vBwE3UAgoq6mv70VjUwDhMCyr6U+WFSt7+8QHt51Zku0fm5AaQbH1FNLBl4v1s/q+uHhfXObKwbTuJ+3YvaoVu5QZfntpJja8hHXs1qnXDsDi3GlY5dYiNrIz1f2TwU2b5NH8vE0NAqhMACUe6GndYNYuPufxqBKHf3FCH49GxCxmkU7k/R66S9xDUemB+IilMqr0dQ8HWHILgpBhWB0AOJwR0SobVwYCrNG6gQOVrOWNNzcefk+v9TX9qbCqNoCWlg3Yey87TCKEDGEty38EISWWrdIvaPqyy4/2oj1wV6QV43pfs6MJy6gq/wyD/rqgsg7X2N2WVd4S1Lu0WPi9JkX7RvXaY/n36DS26/u4XAiWVir7IbMyAUJ0fjqYE/94skJVvc3thsl/LxX/7x4myBRlBuoJzDQ4IE3HIAiCEBdWRR3Hc8L9MEVk7Jj8q5P7UgA/pFJxUzbVYKla/o6OEObOa8UXizfW9Le1h/s2J03+Y6h2f/CRaAIISRORGkwhVT5f2Iq31+pZPfaey4stS3+ERt9sO3avfl/zABxvt9I+Ub/1R5SWrb2NcGN+3la4L2eknc0Ax37K839KGt7LRw2lOXRzMi+rUwUBKkchkp9KzGJIIhwbxvOjnkrNgO15P8Ax7t/izDBR+1oB4AhqA9ialZIkch0VBIdidgBA2QH9gBfe36YYaU6FNtrWqBPtiza1wXKiUWBdXU/fNuf9Frz2RjNqawNYukzvNP94qavbqAkQCEomtyAI1tLTHcb6DfqP2TctPxbLcg+1a/evU1W9wa4GkJXU+7H1A+t15+Oq/IlxPNN0tgRwdpp3shP7eEuzSzsDVTUIF8VjWmAak1njv49hB2qce2US4pKdDKAoK03L7A7ShOU+jYLgRJaE9HPHNasEwM2LgLKWOQxAhUn7iQflzXQFAwB2D0IsYX1DL+rrA30BAN1r+lNFaQKoLIDtthVNAEEQrKO1NYgXHXJ+vaRoH1zq8tulCXAfLeYu4KKA1agP6TEAn9px8Eb+VbCt3U0ARZjPitP2LxFcFMO7lVmWH5h5EMHyKsDtNlMTYDC2BqB8/Y0qjndy8j/ghLg76sIzPUNWwmwY7+45f6Z/fR01siyxPUgDWTGmFoRUuTeg3xzFrADAERRSGWuzwulntFxZ7ND0qoR49bWNgedAMIpgMHuysmpXB9Dc0oR997YzziQIQrYQDkXxz7ecIyHzb7cfjUV74oFwC8YGXrd69wEGAaYDONIGwbNVtP3rsni/3+NJf5ndTQBF/w4y6XPwMQigIk37cuxlDuZrAgzECGpIGSf/t1LvYtBooBp8PhUcck5flo/8vLNdkSun+RpzaLEoCIJgGukMAHhZ/6UEUE60+SNTKVX/ZFsabW6LKaiafqWG/8prWa1j+F86OiL48OMWbDezBF6vXa6SKaGiN9/yDfL5Vx1IDoNo6rZfLIMEwX46OkP4pttZpUefuDyYXnYEvt7QgRHBD63e/XquCqvUaSuXwSMUaVth4T4H5MbS/e1uAujMoByYzBQhUNeqagBvU3PpE4rjmbCnjZoAastZsxKuoDm7Icrt4CoGOEBdKTXOvHqoyf8wuPibeK4LrvVX94w48w+u8HmbeJvV4tUtKjBg5gEJgpC9pCsAUMpU/7OYHmUnywz+rU6rpxqWtWs3XmeWLOtCS0tY67Zazbp1GzUBtphWCJ/Pca46t/A7q9iUqzNe+jPnGm7n8TlGJ40a/vVygOfj7VIGEARBSCNXPKWH738yTCo/Bp+0jsLknn9ZvWsV4DydtdKbWbTPt2nHZitrfePR6LLDdfl77EU3JitQq+UPMTX+HylMkuMiMLIGOau/MevtKwH8AcDPDUH4N2gpmezJQF3jZzODYDK3Gy/pHnX0o0XNf+e1+/d00XDkqoYgCPqSjivSTHrA7sQTvp08D+CPVB8OZcr3rrExgDWc+H+zwtQIt+NRmgCq/CE3140tp+snujEE67mBQazhKDP8fiv5Vw0oivm4h/W2Pg4epvE5eQwwgHWGMVeOPJbsaGFOLQi6smiRZenGpnFp0V641OW1QxPgIwoC32/BeGE9vdZtvWiu947BfYXTsMx+3/98Kv/nx/HcdDGRY7IwRe6cyCjW/B9suOa+xVr9pSkczwQAlwGYwfuqRGWuSjB6sWds8ODc2scZXLiVzxUEQUgbqQQA/IzmX8xVRzsjlN1M87s2CQVWrWlvD+HDj9uyqqY/VVav2ejgs2ZtAFtuUYCamlwnH85gNBsej0eI5znD7djv3mVYzXAZSg28XJkAgwixrJ4yrtypkWwJVyz85hyeIOjJitXOD8IqTYB1RXvisfAGjAlY7oz3Mv3n/2Ty+eMeU2vQ46TDnYeFbi0SsX5HcWarGcPPYiKzAZzECE7+DzFoJrxJd6uOFI4jlxaC+/C6G+XvQmUZtM8J5aloQxddq9Zxn45a0RAEQW+SCQB4uJqoFH1/YqKQYDxEmFZ4JVX+9TRkToKennBffX9EHO6Sprs7go/ntgNz27HfPmXweN3IzXFcaUC6MIpgxiOI+bzh9uPDPFcN4rfi7ZHMJABXTqoZVFADqfF83GcoTfAbJgHG2z4TyxfCmXSuEKxDrf6/panvf6J85vJgi7KfYNmGHlQF37dy10GeU7ajKGC6dU3UZOpj7sPWTMCAKx/nFW1hZxNibE5NJLsWavKYfaDO69epSa5N7UiEYjpZ7cPJf4gr/yenOPkfxQyYg3hfjfL+w4yC/v0SYVbAPgxEbGnzmFsQhAwh0ROJGtz/iLX+k23uAiX09wpXEuba3Ja00tERwqfz2mXyn0Zefb0ZlRVebLJJHkZW+Z2oEaAzgQR/g0UGEapSQwlDuUH0yPh4ocGyqpgb+P9cDs5KErBOauOqiiDETXd3GHUNmWcms1n5L/Fx60hM6XnGyt3WUzxtc5YRppMO6gykkp6dFubnTbG7CeD58xyDfoxdeJk16qWHvs4WcjEl/rMM15UFrMlPRVByMjNfYpP/ELPzfj3MNUkJKR7PfttVxIAFQUiVeAMA6mSzO0+G+2pwIVEXjutZU5ZRA3k1yJw3vx0bmjNGwkAbGptCaGxqx5gavxM1AjKJ9gRXgHI5iAXPPbEa1mKDxkEBnwfqGsQCCRMNA7hNeLs1EwVCBXPpaA/ipRXO8P1PlH/nz7A6AKD4gmOKV9Jcl64sDv7OTB/beKNgNu7MHW1nE2IofaYDNZk0lnFVXWWJnaSDNeMA5LKc9HjDtWMFV+g/TeF9xzHF/2DeD9NF4KI4xrFRBiDO5qLXgSm0QxAEIe4AwIWMhpZqoEaqavyPAvCO3Rd4M3jjrWap9zeZmEbAqtpezNi6ENXVGakRkEn0JKgg7Tacpwa6HY2zDMIJPMAJVKpsSpurdFPAVa9Cp3awIhKO4oFXMkpe5jvc7RuB7QpPxC4d91q96/cA/AxAOi0JLtNBC+hzX4ndTQDHbEezDl8X1DnhpywLO1yzIEAOJ/+nGcbHK2j9t4bXjmTwcpX/CF6H1Pu8Tl2GtXG+X4RBANVnf7PQzUEQhAxkqABAHut6VbRxTw0OvZ0iKWdlYvquqvlXaerK21+whkAgio8+accuO7mQn+9BQYGU1mUIxuKZTPfKvF2DNmQ8bW1B1FkbmN2PdeyWZKqshQsHF2yLtyNdmNH1mBW7jKE69TUqnZ+aogtJhCnSH6S3iYmjVv/neKwU2x+UnamzoJuNnJvZpC+yLOCrfudtO8ijQ8XxHBur9ixipsLqFNqjIkHnUYMhxpc87gEn/0G40BAZOGb6l+7q3jPyVh9T4e7qYhBAiy+aIAjOYrAZjxIpOY4nwk00OCJl7nongPsyLXU3EIygvq4X36zskcm/Tcx5vw0+nwtbb1mA8nKfBAIEQfgOVz6z3uoOUX7tszihtWyFdI+iXfGyKwc7dv7Vql2Cx3cXtQB2TmGyOp8Cc7bS5qnEcq8WCS/FrFnXwoJgAFysZ7+RGaZf2tyeoynwF0v7/4baCZ+k8J5qLH0+U/djvM9sgOWDvagu6sY5nWMH+3fRH7vG9p6dW3/ueG/LOgYS7C7LFQTBYQymhPY065ImahA5VifLX6nAZybW7c6b34a58zqwYYPU/NuJKrtQn8On89v7PhNBEATFwoW2+P6rVb0TAOxi9TX454XbW7m7GEsAXNXP3jQRupgNY2vqf9jlx1+LZuJVrxb6MipbcgcN2jEUHmYCPEadKbs4g9+/WKlEJ1fs304hM8HPhbSTDY+9y33NT/I9VTDn6oao+w/39VRtqA2XXM2SBUEQhIQYLACwYwKK2maiVgX2UIu09PrPKF5+tQnr1mWeqrSTaWoK4dtVvXj+xUYs+sIJTkWCIJjJ6jrbfP/H0+LW0mLyJrhwZ9llVu4SnGQpLYvbkny9qqd+ye408gjcuqT+T+OquhNQQYAZXHja1Yb2ns7MkSreV5P/AwA8m+L3KcDvZT3vL6SQYLKTfx8X5lRg8MwVUc+lV3SN7uyI5vxRxe00FVQUBEFTdPVCU6sBJ/IClnEz5EAggo8+bunzqRf0JBSKYtnXPXjm2QY0NPT2WTMKgpBdLP6iDa+vttX3fzbTuP1W7VAVol3gH413C0+yapfGXV+exERe1Wc8xL+28tPyA+xuApgOfjbtVp1EORd9Dk5RCyJecjiZvoTK/+r7V8uM0/dSEPwz8jEn5x+ypHZBku+bx+DBWWyrOh/s0wPXtPpwvtK5eYKZBXVpaLMgCFmAbgGAAEVhlBjQg5m46h8MRrDoiw6slZV/x6A0At6d04KmDbZOBARBsJDurjDW1Nu2+m/kdNYnW8rnvmp0eDa343jP52ppvLxAgWBbWZy7hd1NAMtFlGjz/g71ileZC3fQGcJsJgG4GMBI7mcNHa9eSNPkP8Z7tO2bm+Tr/Zz4/96QDbScloKfX9atZAb6Fsr+zuNZkca2C4KQoegUAFC1f1dQcfUttQirQZvSymcLVL1/W1+KueAsenujmDevHXPntfZlcAiCkNl0dobw75VanKtzmfo728qdXuQfhZtLf2nlLmN8RWG4eFb0G2j7Z2v68+e503F7/kQ7mxCjhBZ7gyrIOYBxTMk/NZGmRj1ehEsrE3mJ+u68ypR/xQUAnlSXexO6KFn9qhxmxfyelo6KVQCOBfDvfi436jfwCIBf8jmCIAiDoksAQCmZ/oKWg/F6ojqKBQvbsGJlL+rqZOXfqXR0RlBbG8BLLzfhzbc3ZHt3CELGEolEcf0LDTod3iROUEZYudPrveXYteovVu4SDP4/wWzA4aKtp6Ro0ZYWmjz5WO/SYsFdOSn8UEPbv0RR9fg3U+AuvvIXlwvB0gqEi0rjeHIf67my/jCF+h4zafKfCsfQMSCmyVXLEok5g1jcBvm/g/lcQRCEARksADCCdUsP0gJltUknxk56AB/Ii33G+eCpgeTSZZ34ZoWs+mcK0SjQ2hru0wf4ZkVXn0e4IAiZQ0tzANba/sfFfgyUW+pT2uFyo9E3y8pdguWAfwKwdJD/q8DA81zBtZVv/Zvi9txqu5sB2v5dnkG+8H5mASg1/rh9FYMVIxEpLI736T0ATgNwT9KtNAcVTTqSmT8xLYdaBgMW99/junBx/21RayTvULoOSMqiIAjfY7CBRCOjoY8xGKAUWrcCsCUAVeg2OQ0CM6t40v1zJquXLvu6E4u/zDgpA4EsWLgxe3DGNgUoKvKiotwyrS5BEEzij89qtfofI5/CuCoo/x+rdvoNXPhjyU9wblsBagJvWbVbcPKvBNoeHcDLfg1rxTsHea0lRODBvBwtJv/gKrYdKvpmUsQAQDkDQnH9MAOVo+Hz+OBptdUVMhWOpC3hOL5HE2v+XxtoQn9uV833drWDJ/DZz3LX/bbc3aX6bW+Nj1UQBBuIpwQgVid1E9Olfsr0ovN5MkqmVv9Tpu7dlMmT//mftcnkP0uY/1lnn0bAx5+09gk9CoLgTD77LNlyXUuooVVeQsXOqfKApxAr/ZvacbzPALi132MhCrW9a3fW4D0le+Ixf4WdTYixDVeHM5ESjj3vNgj2DUtfOUBimgC6cALLHyawPV3MUngkAWHsAz8M+6ff3109tzfqPV7DDAdBEGwmEQ2ACIVMlnH14TqmJFZSdEQFCTp4QR7soqwef47e/v/ORJX/GAs/b8fKbyXtP5tQGgFr1gbwwktNePsd0QgQBCdS16h9Sc/WtEuztM77oILtsNa/h5W7BOuc1ULBPMNjazlBsnXxIAoXXvfGnZluJjlcUPn+MnDmoFLif8Dv/ei4jiqmCVBYEseTtUGV+Fxv0PpQ3/GjqInRE2cjj6SV5u0LIr5Nj+/Y7FsA51HrIJ0Bs55MtOkWhGwhHSKArYxMKtuZzQAczgv2+7Qq6eJFfCVPQj9koCAjqavv7asNX/5NvOdqIRNpbgn3ZYC0tAT7NAMEQdCfL79sw6vOcGnZm77iVvil/5epZUehNmdfK3cJirVdR6cgMANiMG0Ay7ijZB+7mwAGgXYDsK9Dbf8SQY1XDwNwP4C4/SmDlaMQ0T8IEPsczzOo/a9nVscrcb5HDhfj7uX93Vk+kVcfLmqlk8CdaVx4q8/ksbwgZDrpFhOqA/AstzJ6uirdgDEA3mHK3kDKpRnBt6u6MW++nA+FjagMELVNn5aPvHw3xtTkSc8IgqZ0d4Wwaq1jsrbUJOEMJUNCf3HLwozHlByGN9a/ZtXuwOzDN5n2P46p4LZS65+I1W4t9F6K6Zk/XoO2WMWBnOyex3LSYQlUjoLP49VZE8BNfa1NeF+diG6ht38gjter4M8+1MyI6XOt4Jg7+HDPSJxb0F5LUcEm9l1/XQ1BELIIM20AVbT+PaZsKfGSNzS0WEkbK1Z2YcFCmfwL32fR4i58tqATH33cgpZWyZgTBB3p6grjFWeVbakJw4UAcq3c6SqXGy8XnWHlLkEtouu4Itpu9c77s8JbgWVuS5MvBkOtGv8oC1b/+7MXgL8C+L94X6DKAQLVExDJ06Jsoz9qYexJZtMGOGa+PYHV+lnMvI0JdXSwTObpfjpdrRRTvDBeQUVBEDITMwMARnoz2YpkzdqevgleOGNzG4RUCQajWLsuiLfebukrEVH2kFIaIAh6oH6LVz3nuPGwhyV3J1qpB7AeLhyZvwU+KDjOql3GWMTNVtTq/615WpTbe/qt+GYbW9FFate4vv8uFyL+HARG1iDq1SJ4058GunzsSgeAtjhe46ImyMt053IxmHALxTMHqkXt4v9+B0DEigQhS7EqAJCRtLYGUVfXi48/sX1BQnAYzz7fiAUL29DcLBoBgmA3jY3aabaMSuC5VwPY08S2DMg6bzkC7kSamQm4sMZbqstx/BbA9hq0w04m0Q7y8ERKWnvHTEQkr0DH41Er/h/H+VwftUCeZykImHn7B9b7/5dOuLEqXGLcws2R/L8BuAzAanMORRAEnUm3BkDW0NDQi4/ntiMQkNmbkBwrVvb2bRs1AjwYU2NpJq8gCOSa5xt164pxcTwnRgHTepWC+BJzm/U/js2dhHvwSxzZep1Vu7Sdtwq2x19ytfD9nw7gVA3aoQPTqQsxgmUBcdXZBUeMhq9pPdyd8Sy0a4da6d+BGRBj2LhGlgH8uX9jv454cFHXd7+3sz2B4NG56+4ud3cpge5rqdklCEKWIAGAJGhqCuDT+R0y+RfSgtII8PlcWFUb/yrkTjtoswolCI5m3jytff/jRfnAn83aXssO6KTciVjruRLnbLjUql3axouFO+OBnBE6NMVHB4gxcTw3W6jkyncuPe+HrZ2Puj0IVlTBFwnD3d3ptG4aS02MLRgM6GLN/21x2gWO+SjsH9/eXfNeiSvywun5y1uo17WFBW0XBEEDJACQIJ1dYbw7p9VRbRb0R2kE1NfHLxCodATixeNx4eADK+J+vssFuN2WWoxrieg0ZD7qM25ozghhTjUpPJpq+U9a6Qpwua8K+WWX4sSWG+CO2mrNbxpz8rfTZfKv2IWe+DJ++y4jOCnO4yr4sIqeKggQGJl8HMXb1gLvhvVW/twUVaz5n8r7Sl/rVa7+xyMaOJKi3P7FEe/p6r3CXZvOOTN/+dHMoJhpcvsFQdAAuYAkgPJ0f+udjFgtErKIcDiK516IP8XZ73dhx9nFcTxzIypYUFqqpahSUgSDEbS3h/pcPVpak1f2nD5iDUZsNtnWYxGGZumSdqcp/w9FEVdBF1pZCqA4z1+NyuLTcEj7o/BH6qzcten0uAtR78nXpTmFtP3bJI7nZiPKm/FyzsjvNjsbJlRcCkQj8DZbIiDqpq32PYbJv5rwPwHgtDgn/zMAPETBQNBpYPe2qLt2QyR/Qbm761j22w4mHocgCBogAYA4Wd/Qi7lzRexPyHxUacs7/4k/y0UFDCZvlhf38zebpKX4Uh/Lvu5EZ2e4T5shVRY9cC+m/ORnqN5mht2HJfTj84Ubv9+19RnnTDuFK4E/jVNFPG0clzsJX3dtghEZFgB4rmBbPOEv06AlfexI2z9hcJS//ZUMkihtjJVm9lWopBxwe+BtMv17X0rl/m15X6XbPAjgUt4ejs3YH7E0f1X38IzSs/4q4sVnwTLsldOlgocqCHABA02ZE9kXBOE7SABgGAKBCD6Z24r2jgh6peZfEL6HChgs+iL+1N/16wMJdeLOO5k/+F69pgffftuN9Q2hOJ4dP8uefQrRSAQ1M7dN11sKKbDq20589mUn3l6b2HfQYexPe7hzrW72dSU/xPWNHzi9//7LTaX74X19Vv8V1wDQJhqhMSoT4DhmTJwHYK2ZTQ0VlSDqdsHXsM7M3agVqH8BOIiq/0rF/wolSxXHaysp9LcHMwkidA+4boBA4VcMAKjaqGNkniAImYn8sIdApU6/+O94zq2CIMRLopPsRPQOFIccXBn3c30PRM4AACAASURBVFUNuJm/8UhvL5Y++Xf4CwowYvKUjQILgqWEQ1FEolGc/4ipcwCdUP7wPwfwLoAXrCxQvsdThKVVt+HJhivhi1qSFm0a95XsrdPkX504zjes/grDE9PFUEGAE+mzbxrhgmK4wqocYD1MEo9RE/KnVMydE/Mz4kz7z2emwMG8rxr3Hm0k6wd5TR0FRctEb0IQMhP5UQ9CR2cI738gYn+C4DSef1E7Szcseuh+TD/mBESKx1uyv7JyP/x+tyX70pX6uo1i2B/Ob8M76zJ6xX8gRnGAr1bzllm547ddPtxYfjZObf0HSkILrdx12mjxVGGDS6vhkarZPlmDdjgRNYGtYP8tNrP9FmkCPM8tHjahO0Bs8q9EbV4DcEIcWRGNDCRepQw/GEgRBCFDkADAAHR0hDDvs3Z0dka0a5sgCM5k0YP34flJZ1nS9h9OyUNRoSeh1ygxxy23LDGtTVbx7cpOtLQG8dCnHY4/lhRR9eJnAjhHzU2s3PE13gr4i3+Mk1u7URC2NP6QMm2eSjxauDU+9sSva2Iy+fT8r9GxvxzCLrS5+z1Xv5NXdx2GPk0AjwfeRtu1MJRV4B9ZMgCeA55iadCaON+jh5kAG2gzGn96nSAIWiMBgH4oBfAPP25De7tp1wdBEARTeXpJPJmh38XnAmatisdC+n9MHpuLLbfSI2igArevvNOE2pYQVvWKXgvroJVf/BwA/7B651f4RmBV2Sm4ufG3Vu86JW4snoUv3H6dmrQ9gENFkC1ldgZwJ4Bfq0QVM0tjQoUliLrc8DXYVnZUwMDfjzjOj9X8q9r+1Qm+V4DCoiqicTVtCAVBcDgSACCq3v/dOc1oaZGJvyAI2UcwCrxXn5gnft/zk3BHueKIkcjJTSxDoX9JgyqzVQFbxe1PrMNqEWkdiDzahs2zuhRA8YCnANe4xyMv8q3Vu06KbneRbpN/9fkdLrZ/aUGdQKYZ6uG/NDMTIFxQBFe4amM5gDmaAIORQ72Icwz/X0ph0EEdEQJRF7qjg8aYun2I3O91hXMoJijlAILgcCQAAKC3N4LPF7XL5F8QBMECLntyMO2pwTn3gIrv/K+zM4Q7ErCrzGKUYvhtAH41hOiXaRxReS7ubXkS1YG3tf4E1vgm4JzibTRoyXfYjmr2QvoYB+BF2uc9EaeQXlKEisv6Jv8mawIYGcEUf6MDiAr+nQLgi6Fe+GiwqG8bjEO8XTg0d90dea5AG8sC9PXzFQRhWLI+AKBW/tXkv3Z11olECYIgOIbrXxZHlhTYhZOAG+j/bRlzXF5cW3wIftfmxdjA61p2zkr/prinYHNopvqTS9u/wWdlQrKMowWe6uOHTQ0C9GkCeOFtNNUiMMYPAZxuuP8uMwHmpfrGz4fyEe6pxk/zvn3Uheg6llIIguBQslsmWp0d5zTL5F8QBEHIZAqo5L29Hcf4oKcAF5UcglbPltp1caO3GrcUTsVSt3Yl9idQyFEwB1XL/ge6AyRWj5QgocJi9I6ZiLDKCDAXldkwn3v4GMBvDPeTRbko/F3110uhPFzbOQnUUFDiHl/Ld1MQnEnWZgCEQlHMeU9q/gVBEISsoFolUgDYB4DltRPPuXPwXOXpWNt4o1bOAG3uAtTqZfkHrlBfIIs0pqNS5v/MTICbqXpvClGvD8HyKrjCIbg7E9dNiRMl8HcggPtZq/9pCu/l4+T/MQZIVN/8blHE23hv18TwifnffDPYCzujOWYdnyA4jrM69JRwyboAQCQSRWNjAKtW96BZJv+CIAhC9rAd08p/a2ba81CcXn46Hmw4W4sOX5KzOS4u3FyDlnwHNRk9S9TWLeUaZsncAcDUXP3AiGr4XPXwdLSYtQsVXfhJiu/h5+T/Rt5W7A5gikqaGeqFX4Uq8Mdu+eoKgu5kXXR58ZcdeO+DNtTWStq/IAiCkHUcb6ew3LcuH+bnH217n3+atzUu02/yr5gptn+28BuWBIwxe+fBiiqESyrieKZtzAJwOYCxbEADLQCHLCeYGxgpk39BcAhZlwGw7GvTMrzMQuVSzQZwFCPTKrrbqxYvAHQxLWs5HxcEQRCEoVAremdyMP++1T01z+XB+YU74uZoL6Z1P2nLB7Uwd0vckTceIVv2PiQFdGuYqF/TMp58AL+g6KKKUJn39XC5ECytAKIReNqadetXFRV7BMB4w2PKReQhlcAw2IvmB6twX6/pGgeCIKSJrHcBcAC9VHJV2w4A9uO2CS9Y+YYUrQiFXxTrAazg7W8ZPIgwWBCT0w7wsShvR3k/yNth3hYEQRAyh8lc8VxuhzXgRy4vdizeB4vCLZY7A4RdPmzw5KHVpWUC5HROQqX23x78TJ+fAOBIjp3MMfFXQQDzNQESQdX5zwDwAoCRfJ0qE7qbmRGD8nWoHDf2aJ3RIAhCPyQA4Cw+5HYlRYJm8oQ9ldHaSQwSxMsqnuDV5L+WEe9OBgtCzCpYy/dSj7fxditfF+HtXj5uic+NIAiCkDIHcrX5etMmOcMwvewIfNhWgqndT1m2z/fztsbtudWW7S8B8mlNl6dj47IMlQL/KDNlPuNYxxT6NAHc9fC0m6YJEA8eWoXebNCeUKkJdwK4bKjXLw5W4uqeEVn3BREEpyMBAOeyitu/ABSyVmsiV3aU0NO2FGwZinGG/w3nz9RlKDNoYwAg2i8AEFtJigUO1EWzg4EBlU3QYggS1PJ/giAIgvWoCefv1II8gHfs6v9fF+2F6115mNn1qOn7eqFwZzyYo+1kRQVjdtOgHcJGVOnlLQB+b/bvQ2UCwOOBp6UpjmebwlYAbuJfF8dmd1AEcNBSiE8CI3Frb7ldbRYEIQUkAJAZqJP1l9xeoYqwWkUYBWB/brvw8WSJlRvAkB42GBFD6UCEF5BYSUHsYhLk/1T2wVIGDVRQ4StDQOED/m0Qv1lBELKIQosOdQRre7fnedZy5ro8WOar7ktnM5t/+bVNU1bB+3M0aIfwP9T4eCdmAhwE4HPT+kaVAyhRwIgtmgBFXOmfwcm/4i6K/nUN9IJPwn6s7pyMuojbntQhQRBSRgIAmUeIAYEODujUResGigvtQg/o3al0W8DNk+ZecFO8MF4SETxaw03xjcGS5iP+7WVAIVai0GvQNogFFgIMRsRua6gFJQhCFrOFhYc+nqm/Jw424Debk3InoiZ8AnbqeAxuE9wJe10FeKR4B7ToWfev1P5P6Ce6JuiBm2Ol9wD8H8cZvaa0jJoAastZsxKuoDm7Me6RWaD/ZAAQXJhRohznDvXCLriwPDLosLGMmaGmlU0IgpA6EgDIHjqZHfAKJ/1K6XUbpnxNoujNOAtXnpKlhhtYpxfj1wO8Xw9LEWLaBrHAQR0vUKBYYguDBC0Gb+x1hveI/b+bdXGCIAiZhMoS+zmAB4dS+jaTgwu2w4sqSt1xX1r30uMuxHMFM/Gyt0jHj8vFkr3DDGK+gn4UURn/jwAeMztQ1ls9Dv6GdXB3mVYlqb5307g4tC0fU2MdZctxRgrvq8aUFwD4K4A3DAstgiBohgQAshM1Gf6Um/oOVHJSPYYqxNsxIlzj8N7J7ZddMGOI50apbRALu6/n3wAfj2UQxAIH6rHVvL2G90O83cnbK+0aTAuCICRABQXP5iqnPrs6TgUBHnMX4v/abk7be/6jcHs87ytJ2/ulmRxa/A6n1yPYzzh644c5wTUPlxvholIzAwATKP65N7Mc1DjlCeodJKtGuBmAa+lSpTSlLgLwkjhJCYKeSABACHFFvI4BgZe4EpHDFfYDuW2a4dZEKiJuHCVWDfFcMCAQi26HDOluMb2DqOF2u6F+sJF6BhFmGcSsGpfzMxAEQbCDaaz7PcDO3v9dnpoLn522IIDGk3/Qwedksf1zDNX0xJ/IybJTUWk2exi+d6/QFjRZFcIRDI7szftTeft1CQAIgp5IAEDoT5CbWsV+mdtZDADsCWAvAFuzzquIwoDZOHhxG47bN8xzq9h/8fKpIeNgOT+Lbmob9DKg8BXfK2C4wBr1DHoNAYrO9B66IAgZiIulAOcPp/5tJuvgwtF5m+O94E8wvfuJpPfU4S7Db0t31flTyqPKfCJ6OYL9qDHPxVwo+YPBHckJqHHbrRzHgeOMVwH8NIVxQimAqwD8zPCYck34i4w9BEFfJAAgxMtybvfxIrIF9QOmM31xUj9bQSF5tjW8cpdh3qWBKXsR3m5n1kG9YWCyjH9jegZh3o5F+9sMz22Ri7YgZDWXMsD4rJ2d8IV/Aqb0VMEXXR/Hs79Lk3c0HizcCk16iv7FULZ/WkcohCGJZW7caNAM0pkx9PQ/im1U44C3KP6Z7DV/HHURfmF47HWWEy2Rr48g6IsEAIRkUEJ4c7j5mRan9ALG0jt3Fjf5fpnPCG6Io440yIl+zH4xpmfQZRA1amdwIEwBxTbeXsGsgm66L4D/WyNCP4KQUagVzgsZOFxs14EpZ4Bm96k4pfmKhF7X7qnom/x/4MkzrW1pYDKA03VuoDAsxQBO5djnBM0D52VM0f8px2URTv5/YxBHThSlI3CNIaCgeIZ2lt9af4iCICSCTNCEVAlQ7G4lU0ifZlBAbfvSP/cgCg0K9qJKFcoNLagepjVhg55B/9vop4Ow3pBp8I1hReQTfkc6WMJgi82YIAgJsT2dVS5goM8WzvePRmPFNfh904Vx777X5dd98q/OwyfRiUdwNipY9mMAo5WGpcZBAKVbcKRhzL8IwGnUI0rGyj+f3+HDDY+9xICCTP4FwQFIAEBIJ1FO9mLK9//gBqay78W/Eyi4VyL1j1pjNPodTuegPIEBbYDBgB4GBmKpgmsohBhzU4jl/nYZRBZjsshhZiTEghDpNw8XhOzFTVvA/wD4m529cL23DDWlF+NnbQ8iJzL0YuUG7yicUjLbsrYlyTbUWpDxV2agrpO70/ZOpdN/oZEHfiHT/o/mfdWuhZy4r0zyPfOoC/Ubw/jtE2YNJfuegiBYjFyABKuIlQx4WTc2nVYxm1Mgb9M4lPeFzMDPzz/GHsMcVa3BnvEbBpq6GSAI8nZsZtBmWLFsMAQJWgzZB/WiTCwIw1LE+t7PAHxpZ3ednTMWeUU/x4/a7ocv2jjgc1b6J+GqwmmWty1BcrgSK6v/mYfKmrkJwG85ybabMpYo/NrQjnkM7CU7US/hxP98w+R/MS3/dDhmQRDiRAIAgtWEOIlT2/McZI7iNomiSLvSZscln45AbYkYk4bpkC5DNkArJ/pRpmbGgghzObFpkM4VhCFR5+E7uGKYrD94Wjg5dxNscP8a/kEkR7501aLZZWsT42E7iv/J2CvzcNMp6QHlZska+6SJ+HMRKSiCuzNpk4Fd+/w0gVzeX2jQ9kiGUlofnsEgvmI+9Q/mZfuHLwhOQy5Cgp1EDSu2S5lu+gjTzccD+D9uswwXMUEYinxuiopBnuc3PMfJ/I7pnasp0vg+J2kLAHxu94RNyBh2o4DY2XYf0IX+UYP+b8dwMwqj2n/l/yh6OBmNKgeYycWNQwG8mezBRj0eRL3DVd4NyUdU5P8Jg91nMAszmfKEfF5vfm2Y/CsdgeMZBEiWGSm+XhCEJJEAgKATUa7YBplyqrbrOZHbkXV2syheV0kVXq19ngQtmcYBWiCOxp3AFGgd8bPGc3NuBw7Qxk9p97iav6d62nm28XfWaSij6ImzT4TsQp1jf8QVzRfE9SMpVB8eF0e5k5AZFAC4m+nyrxqyzxIiWDYCCIfh6WhN5uX1/M6pFz8B4N0UelZdZzYxjLe+otVfspP3PNooXkbthNMMmj+CIFiABAAEJ9DEgecLzATYlF75W9BOSaWFbyaCgkKc5FN/Ih4KHd6p2w7yeCMHhqsZDFjPTa0UbeBvbgO3Vj4esrjtgj6Mob3XF1QOFxJjM7H9yzrUuOROAMrH8t5kDz5YOQrweOFpbUrm5T3UAUgVdW34A6+HSmXzkhRKHDx0ELiAZQWH0TngomQDJYIgJI4EAASn0cNB6Be8kFRSPHAkU+92YraACAoKwuBUctu03zPCzAowbio7oJ0lBV8b3BqWcmBYL/2cFezEQfsJ2d4RCZJD/3UR/ss+agBcxRXvW5M9+mBpBaJuN7zNtsrWfEX1/2qWFySLKiU411Ci18pSBcksEgQLkQCA4GTCnHzUs+b5TQYF3KwtO5QevcMJxwnZxVKuZsSTcrgoy/rGw9Ka4gH+F+23RQz353Ig9yFFptalmHIq6IcqSD6WKbu2WgM6jKkAjhAdm6xlBIAbOA45N6lVbpcLoZJyuMIheNqa7ezHlSla/R3LgEjMYriDlpif8joiCIJFSABAyCQiBoGbD7mptLIpFLLalWUD5dwGmuQImU8bBSe/tfJIe/ImOr1jXUM4c+zCvwf3e3wD+3kFywiW8f46ZhX0MsOg1+DgIKUG+qKCq7cxiPapTq3scRWiIOqGSxsL9j78VP3fQoO2CPbhM9Tj/5nnxYQJllcBkUiymgB2on4HBzHwHpv8r6WI4Fz5XgqC9UgAQMgGlnC7lxP/adymUkNAedKPk2+CYCYLR+2Tjf0bC7bNGOB/agDYzMBA7G8D9QkaDToETQwWSKmBHqjP80qKeK3WpVHz3ROwd2QFXHqVEW/L9H9BKKBwXiXF75ISvUtRE8AOXJz8/4klEeCx/0myxATBPiQAIGQbG2iFM4dReaUVoLylJgDYmXWuMwxWN4KQMg0Ve6HVLRqV/ajm1p8AswE6DX97uXq2jpPOrxksWMGMgk5dDioLcFHN/jimNndle4cMwZ+oTyMIYNbhiQDG8u+6ZHpFaQKE8wvgbW2Gu6td945V7jQ309oZdJ1RwogPy7lDEOxDAgBCNhOkoNkaprM+zb5QF+kDqCGw/xB+8oIQF13+UvS4xLEyTvzcSgd5enSQ2+8AqAXwDVeWVMBgnibHlGnkUxBMiXe9n+2dMQgnsfRMEIx4uCL+AAU1E8+icbkQyclDoCoPOWtWwBXU1r31QLo3GUvHVNr/o1LzLwj2IgEAQfgfsQuSmjj8g5tatt2KA7k9WSpQyTRYWdIV4iIv0Iqc/Br0ShAgHRgHk8bbew7y3stZQvAVyw5WsySo1eB0EDBoEHQZtESEwVHnwL8wSCoe3t9lDEskBGEgXPzdPEB7zaTFZntrNoG/rhbuHq0W0z0sf7nZcI5upH3gI3G+h5eaMko48dd0fgqa2GZByCokACAIQ6NSjz/hdhsDAFNo6WTcKqUfhcGoanoDpcWbot6TJ31kPTGrw2367TnAiet6CkM2DrE1MWBgqwS3hqg+vZYDdCnD2EgOyyOm6tAYQWv2oT3geamI4QWrauBrqoe7s02XY90OwE0GB6Z2BgPinfx7DH0zloGS8+j0JHaBgpAGJAAgCPETYO2x2l4CUMiJfwUDAbtSDX2KQelWEPrYsu5N1Nf0F8kXbMTPldoxAzShp19GQDcfa2NGQQOV8GtZx7skjYfhNMX4I2nDepMGbdGBqbSflWifEA8qc+khro4/nUyPRd1uBCuq4ItGddAEcHGyP4uuISqb6n4Ad8YZJFSv35H6GWN4fxzHWZKZJQhpQgIAgpAcUUa12ylENpd1baDDgNIP+EE/QcHBLNQEa6nmZ/N5HHudx5XflMnr/lo+ZueQO4Rv+2B2Do1MU1XnghYA79H2cO0A9a5D1b86zZ40j5op9zFAYguanFzVmOondJYRhHiZxgBaG3U1Eibq9iBQVa2DJoA6t90DYGueQ+9nmUO8jGGmwAQ+P8QAyTOiGyAI6UMCAIKQfhZziylAz6a7wEwAowGMYDRbfn/2oAIAt8S5532THZAJWYfKBtqdW38WAOgAsIoZBI3MJGpldkEbM4w6Hbhy3MFUXVvzj3cIL4LbfgtAlf11qt2NEBzJeP6OlEL+U5z4JkyfJkD9ari7ba3I+TuAEo51Lo7zNSpbYHsAfzNM/jsZQLiI5ZiCIKQJmYAIgrko7/LnuKmB/UQAk1kysA0j/9N48RP0Y7IEAIQ0sDXfYud+b9XGbIE6TqSbhsg80BUllvqKnW0bF22H3974A1j7f+sQ7hWCMBxTKaypgon3MiiYMMER1fBtWA93R1qS15JBBTXvSjCIsRt/P5vwvvpB/xnANTL5F4T0IwEAQbCObqYIf8EJfwWVtPfgxVKwht4EvOO75TMRTKSY2ziHdrLSPrjQTnXuqmgPJkYWwBftsKsJMX45SPaHICSCGhdcSavNvyTjld+nCVA+Ar5IxE5NgJ4EnrsZgEsN+icdLIm4SSb/gmAOEgAQBHuIUEisgRc/wTpW03/5P1buNOryx/EsQXAM6hx2Oc9htuFHWIfJ/xjWOYv4q5AO1MLAVRQavja5IIBBEyAUz0J8FIjaUmKvjvFug42rOq+8yMl/PNELL18jAoGCkAASABAE+xHBqCzgkwnHZHsXCJlDlIP0t+0+oqlhS+N4A+ED8AtD3bIgpOt7dT6za+6ibkjCKE2AePB0d8HbuA6ucFLSA8kyqd/kP8TzyllxTv4nM1CiSpAeTyZQIgjZitQdC4IgmExr8Xbocvmkm4VMoZ7e3PV2Hs82kVU6dOdksf0TTCKH9oA3UT/INMJ5+QhVjgJclvlpbM0Sh714XwU6HgZwYpznFSWaeAeAIyic+HP2lyAIcSABAEEQBJNpKRiHdnfaE64myecm2IBa/X+Vq2622XLNjKxAZeQruz9/DyceW9ndECFjUbVjP2MpgKlaIeG8AgSqLUlkGcvyodjkP8TJ/8VxlhTVcOV/N96vpgOHzGkEIU7kxyIIgmAirSWzsDh/jBk7GCWfm2ADSjzzOjvTbb2IIifaCZf9Zb9q4nGG1P4LJuPhSvedtBI2jYjPj4AqGzA3E6CEK/geBhFfAHAB3VCGo5giiUezTCLKUqQ7RLRXEIbG7YpiTNWGvudIAEAQ7EdSRzOYktaPMa1rdbZ3g5AZqJW639PJxDamROpRGLX9N5XLCVmB3Q0RsoaDADxlUMs3BRUECFaNQdRjmkzYIgBnAvgQwEec/MejcaCCHzcCOM7w2DsAfg1guVmNFYRMIMcXRk1V83+PRAIAgmA/4gKQ4VS2L0VJxDanNEFIFx/YbVlaiiBKo+t0+ECPBHCwBu0QsosdAdzP9HnTMk82agKMNjMTYA4n7sfSTnQ4qpl5dILhec8DOMnugKQg6E6uP4zK0nZ43P/LmpMAgCDYT5F8BplNQcci5EYtVVcWhHTTBuAPdvtyq99RftRW7UGwBvk0uxshZC3bU0BvfzPH8SoIYLImwDwA8Qh5FNFm88eGx56jW8AyE9snCI7H445iRGkbfN7vjkElACAIQrahznv5HFQUsaawjN7L/bfcdPXNrBX3yBdNcCpq2eBRpuzaRiFC2DL8jt1dqM4fv6KKuSDY9R3cnBZ6M83MBOjTBFBBAJdt04VcZgqcSZV/VfM/F8ClAFbY1ShBcAJudxRjRzbB4wl/r7USABAEIduoYe3uB9zm03aoaYDtbPl2CAK+BvD3OL25TWP70Ps6fBJbUJBNLMcEu1Hqsk8D+KWZWkIRfw6CVdVmagIMRhGvwZfRDUHxJd0CFljdGEFwEn01/yOaB22x5b9mQRAEm1EDiU3kQxCEuFCr/09QrMs2pkbXw42A3Z+YKog+Smz/BI1Qlno3UIzyr2a5cyiLQIwYDV/9aiBqiftnKcUBzzFM/hfQdeM/VjRAEJxKjqr5L/luzX9/JANAEOxHNAAEQdCVVZxg2Dr7Lo40wQ3bdTTGiu2foCHlXCU/w8zMlHBuPnprLImdq2yG3/B4jJP/Y2XyLwhDo2r+q8q+X/PfH8kAEAT7kVpSa1kD4CoAC7nXbgoJmZreHPaUaNYNgjAsagRxCoBWO7tqWqQexdFv7f60vKy5loCtoCOVAP7EAMC1Zol1Rr0+9EyYAm97K7wb6s3KBlAaPVWGQNtX1AGYb8bOBCFT8LDmPx4kACAIQrbRQx/i96w87k/HHSlfNMFp/APAK3a2OQ9hFNgbf4jxIwAH6NAQQRiCKziBvoPZO6YQKirpm/z3BQHSj5rBXKTi5vzNXUPbQEEQhmBURfzXSgkACIIgmExL6Y7ocPulmwUnoby5b7a7vcXRIEoj39jdDJX6f7rdjRCEODmH39lLAJj24wkVlyLq8cDXsNaMt99Asb8nJe1fEIanKD8Aj2fwmv/+iAaAIAiCybTmjUanS8qGBceg0of/xkwZW5kamatDn+1K9X9BcAJ+OlVcZ3bJSrigCMGqGrPevgXAWyxFEgRhEPJzgygrbofbJQEAQRAELWgp3QELC8bKhyE4iYX0/e+xu82+aIcO3dZErRBBcAp+lq28CWA8HSxMIZxfiFDFKMBl2i4EQRgEZfdXVdYKtysxPQ4pARAEeymVQFzmEnHnoT1nZLZ3g+AsohS7W253qzeLxidmZAGq0LlTl8YIQgJsB+CfAE4DMI+2nmnHZE0AQXAsKjXfTCpK2pJ6dwkACIK9jJEAQCbjQlRWRQRn8RqAx3Vo8ZjwYg1a0cfXTEcWBCcyE8CtAC5lRoA5QQBzNQEEwVEU5AaRnxtAQZ6eyWMy8RAEQTAJd6QLxT110r2CU+gCcLKku3+PDtqHCoITUQI0swE8AGCWme03WRNAEBzB2KpmVJS2azv5hwQABEEQzKW05UNs1VkrvSzoTog+4ivlkxoQ260IBCEF3Mw4fBXAbqp02KzOjGkCRH3ifCNkByrR0+eNYHRFGyaMboTHE05IkM9qzjx5JwkACIIgmE1xdx0KomHpZ0FnPgLwmC7tmxBtg0sv8e9PNWiDIKSKcgX4O4DjARSa1ZtKE6C3ZhOEi8vkAxMymqL8XpQVdaNmxAbk+M2t908nEgAQBCHbUMsSeVYec1nL+yiMOOfCIGQdynP7QQCrdDnwkZG18PS5EWrDtzo1RhBSYDSASwD8wmwtsGB5FUJlI+SzEjIOVeNfVdaBipJ2FBc4TyNWAgCC75AYxQAAIABJREFUYC8V8ju0nAL2u6XMrH0ye3pYcBrzqRQuftuD84muDROEJBgF4DoAfzC780LFZQiXWH7JFQTTGDtS1fi3IT/XdqfcpJGJhyDYyyj5HVpOMQc9H3H7DEAb7c/6bxekq3He0Abn9JCQTahl9hsAtMqnPiRBugEIQqZQyGvcLSwNMAeXC8GySoQLS+SLIzgSVePv94YxKlbj7w4n7LuvG2IDKAhCtqHOe5tyczKm1W8KWYVSBn9ZpwMeFe2Bv094XzvmApikY8MEIQWO50LE9WaWAQUrRwFuNzxtzfJZCY5B1fgrgT8npvkPhaw8CoIgOJMp8rkJKbIAwOW6dWIZ2pAbbdSgJd9jgWbtEYR0oMriTgRwI4ByM3tUNAEEp5DPGv/y4o6Mm/xDMgAEQchC1NLifQDe4aGHaPE10IxDy2VIkq9FKwSn0stSmHr5BONmvkPaKQiJomwBD1f6mwAOMvPapzQBXJEIPK1N8iEJWjJu5Aa4XNG+LVORAIAgCNlGkKm8/7L6uA9Y9Q+8PO5I+cIJdqNGNS8BeE8+iYT42EFtFYRE8QDYleeFXwL4HED6zcypCYBwCJ4OkR4R7Gejj38Y5cVdyPVr5T5jGlICIAj2ouzoXPIZZAfucDcm92iZ2ixkF+sBPAygTrejzkcYxRFtVwbbB8kUEoRMYjqAW5V5jZnjE6UJEC4xteJAEIalmD7+1ZXNWTP5hwQABMF2auR3mD14wq2o6liR7d0g2I9a/X9Nx8+hACEUR7W13FeZE2s1aIcgmIkak+wC4B4A+5q5o2DZCNEEEGwhPyeIkeXtKMvQGv/hkImHINhLjmQAZBelrXMxvUvmEIJtqJzbKwFk34gndVQA4AunH4QgxIGaH8wA8DSA/czsMKUJEC6pkM9EsAxV4z+irA15Ob0ZXec/FBIAEARBsBBXNIC8YBt80ey86Ai2ogQvLwawUtePoTjapUErhqRB47YJQrpRDgH3UyAw15TepSZAuLBUPjzBFFSNf44vjFHl7X0+/m53JGsn/jEkACAIgmAxoxpeQWkkIN0uWM2rAO7Wudcnhj/SoBWDEqVjiCBkE2MA/AXAcWbOG4KVI0UTQEg7sRr/0arGPyd7avyHQ1wABEEQbGDLhjl4c9Te0vWCVai6k5uZBSAkhwoAaCtQIAgmMhrA5Sxb/LNZuwmWViLq9sDbLIk2McLF5YjkF+jRGIdREapHmbcp61f7B0ICAIIgCDZQ0LEIgAQABMt4EcD70t0p0waglxMhQcgmlFrfdQCmATgDQE/aj93lQqikHK5IGJ7WDY7r2kheAQJVNel/Y5dIRSWDL+SBKyyT/4GQAIAg2Eu1lOJkL/vXPolXxh6R7d0gmM9SAH/VXfivWv/6fzAAUK90pDRoiyBYjZo3HA2gGcC1AEzx7FTuAAhH4A72wtXb/d/HI7n5ad1PYNTYtL6fIDgFCQAIgr2USQAge/GEOzGlpwFLcsUGSTCVRwF8qnsXT4nM06AVw9LDIIAgZCt5AE5RpjYALmFALO0oTQBEo/AaMgFCpeIWIAjpQCYegiAINuEJtaCyc5V0v2AmiyjgFZReTgvdXP0UhGymiKKAjzCT0RxUSUBpxX83QRDSg2QACIKQbRQCOB/AL3ncPgCTWN+YKmv4XoKgCz8DoH0x7faRpfBGOzRoybCoyX+t5m0UBCvwANgXwOMAfiUCmYLgHCQAIAhCtqEm/FtySzciDCboQoQr/1/q/In4EEV1tAO+aPr1xEwiIk4KgvAddmcmwFkA5kvXCIL+SAmAIAiCIGQeXwN4TPfJ6paRlZgcfg8F0bUatCYulJBiowPaKfw/e/cBJclV3Q3833lynp0N2qS4CishJCGhAJZFMtGYYGwwwWQDBj6wMSJjkzGYaIJEEJiMyIgkoRxQjrvSSqvNs7OT83Sq+s7tvb3qnZ3QPdNd71XV/3dOn9mZ7Z5+9aqnu959991HXrpAtxk9i71OZD9mABBR2Eip8Z8DKK04JqOPamw87JtpTAq0KS38d5fNB3l2fita3B0WtKQiWf6dE83pSZoJ8AEAP2QXEdmLAQAic9ZUad05VUb28P6trlss4kaxFCQ7dNu/tK3HJGv+fTj4L3pUdwJosaM5RNY4AcBnNFPm1zwtRHbiEgAicyLse6PckpsRmdQa3NB5Rjh7n2pFUv7/SwtSWmmT2482Z7ufXwAOg4ZE85JdAf5bC5ByopHIQgwAEBEZ0t92Oruequ0XAH5qa6/WI48254AFLVmWQS4DIFrQ8QC+AOCNAJLsKiK7MDJHRGTIHc3HsOupmnoB/Lskl9jaq2fm70Sd6/saehNaC4CI5teh2UgtWiBwkn1FZAdmABAReS6Cmze+gd1O1fZFW/filvVOT87fFITBvxi2ub4CkUVk8P9BLQzYyBNDZAdmABAReWzHquejP5ZazpMexQAulZD16NcD+DGAvI0dc4azDUl31IKWVMUIAwBEZZOxxlt12cznuY0mkXm8gCQyJ6Y38lY9gDZTfT5TfwxGk8t++nYWkaQSUpH+MgCP2Ngpq90pNLjDFrSkarJaCJCIyiN1AN6ldQGOZZ8RmcUAAJE5ndxGyog6AK2mnnw61YNdiWazPUBBcyOAH9k4KG1CHsc7dyHlDlnQmqrpkz/lgBwLkVckCPD3ukPA0ex1InO4BIDInAQzAMIlm1yJ67vOCns3UHVJyv97NQvAKgm4eGLuj0E83Rlbl1oQWU4y156r9QBebWvNEqKgYwYAEZFHJhs2sKupmmQQ+jHZUMLGXj03f4sFragZ1gAgWrqLAPwQwMnsQyLvMQBAROSR67rOZldTNd0J4Ms29uhx7hBibqC3yufMJdHynK21S57CjGQibzEAQETkgYfXvITdTNU0qXtr99nWqxvdUazN34MYAh0AmLCgDUR+dzqAL+myAI5JiDzCiBsRhdFrATyjjOO+GcC/V6N/hpKs90hVI9v+/RbA720r/NeJDI7N32RBS4jIB6QmwPEAvgjggBY05Q4bRDXGAAARhdEGvS1mZbUCAERVtB/At23cT/vxuassaIUnrMu8IPKxVQB+AOCDAL4HYIonk6h2mG5DZE5rYZcsslk3zw5Z6GcArrStWac6eyxohWf2heQ4ibyyBsBnALyB10ZEtcUMACJz5AOunv1vxM80hXoxmXB1C/mAzP5/ErBrgb0M/lc4Wy1oCRH5WDOAiwF0APgEgHGeTKLqYwCAiMLoNgCX8MyTz8i2f2+3qQK9LOA9we1Hj3OfBa3xlBuiYyXyUieA9+jby4cYiCeqPgYAiIhqbKb+GGQjMXYzLdcVAH5lUy82II+1+dstaInn9ofseIm8JpkASQBfALCLvU9UPawBQERUY31tp2EommQ303Ls0gthq4pjneQ8YkErjOgN4TETee1tAD6lOwUQUZUwA4CIqIbGm0/HjvpV7GJajpzO/N9oU+r5Ofn70ezutqAlRBRQMk55PoA6AK8B0M8TTbR8zAAgIqqh5vE7sWGak4W0LHsBfBPAhA3dmICLM51tHPwThdNe3arPq21IEwCeC+D3ANZpbQAiWgYGAIiIaqx5ph8Nbp7dTEv1FQDWLLRf546gPbyp/0RhJx9ml+me/cMe9sXpAH4N4AkcvxAtD/+AiMxp51634dAxfB2aHRYypiW5TgMAVpDZ/x6H9biIQi4L4GsA3gLggIddcbLWQnk6lzETLR3/eIjMadR1beS9owCcXcaz5myaeaXQmQbwTgAjthz4efmbkHDHLGiJcZMhP34iCQJ8X7fp+zKALg96RCYuzwDwVQCvAPDn0J8FoiVgAICIwuiNelvMiGZqEHktrxe599jQ843I44z87Rz8P+ZBWxpCZJAD4HIArQA+CqDbg6ZIEGAtgF8CeDaAmwGk+SIgKh+XABAREdnnfl1nO2NDy05wdiHlDlnQEiKyjAQrv22gJoAsofwJgDdIqR2+KIjKxwwAIgoj2UqonNEMpzvJhBm9sL3fht5f7U6hyfVymS8R+YwsB/i6Zs19FsAKj5ovyw4u1n9/1ZaAKZHtGAAgojC6BMDnyzhux9K+aeBWSIEmJfb/V9fWGhWHi035WxErlCMgIpqXBAF+oF+9qgkADTb8F4ATNRuAiBbBAAARhZHsp77fq+POx1vhVHe8fgyXcAVWVlNpvdpje17tyOLM3JXh6n0iWg4Jmv8MQBuAj3hUEwC6HOD1+u936mc8Ec2DF5BERDW2p/si9Me44QOV5Yea/m/cyXkr6g8Skb/I7jnfAvCBMpfaVdMrAXwawEZmyRHNjwEAIjMSrC4fDlMNm9Cf6gx7N1B5pLL8x2zoq+PdQSTdcQtaQkQ+VKwJ8CYAXhYQSQF4FYDPAFjJFw7R3BgAIDIjCaCDfR98mWQbeuMNYe8GWpxcMH/Rhu3l1rvjWJu/CzHW0yKipZNMgB8DeLPHS5rk+uo5mk3VxPNHdCQGAIjMYXqaOVGv+j+Wz6DZyVnaDWQJF8BfAPxJt9QyZqU7jePzNyBaiEcQES1LXmsCXOxxJkAMwAUA7gBwun5PRIoBACIKIylMVO/FcTeP34GN0718kdFCJgF8E8BW0720OX+N6SYQUbCYrAlwLIAvATiLYx6ix/CPgYjCqMHLXVBWjNyLdsf4jm5kr2s0Vdaoxzm7+BIholrI6va7/+JxJoBk+p2t26r+Dc8s0UEMABAR1Vj99DYkXaOZ3WQvqbT3DgBjJlt4qrMHXY7xBAQiCq6c7nDyJo9rAshY53EAfgDgmXx9ETEAQETh9BoAo7r2eqHbMF8fVEMSFfqU6cJ/J7oH0OPch0hhC28iopqR97yfA3iPx5kA0IKAshThBV4tASSyFQMAREREZtyiqalGHZW/g6efiMqVWWbGUk5rnrwfwKDHvd6tNQFer7sFEIUSAwBERETeGwHwNdNZJufk7+epX5p2PzaaqAqmqzBwl5oAlwJ4A4A+j09Kj2YgvI2ZABRWnhXBIqLDxPjBY9R3ALxP118vxA1n95AHrgXwC5Pb/j0xfy+a3L2mz7VcjG8EcLPphlRova9aS2QfyQS4XAv1fRlAl4ctlOf6T9n4BMDrNKhBFBoMABCZUSeZt+x7Y9I68+pJ4bVsYgXyTLiix8iM1xc0C8CIdmQRx4zpU5IA8F4AV5luyBLwD5po+aTwyM8AtOmAvMfDPpUlAC/S9+EPA+jn+aSw4AcYEVGN7es6HwOxFLuZir6vGQDGrHN6Ued6vfz2CE8D8GK+KohCLafF+d7v8e4AQj6YXwXg45yUoTBhAICIqIYmG09CX103u5iKHgLwMS2kZcQqdxpt5lP/mwFcrLNwRrdAJCLjpCbANwzVBGgE8Ap9/jV8KVAYMABARFRD2UQL+mJ17GIqeouB7a8Ok0QWSXfU9Al5HoBT9MJ/n+nGEJFxOV0O8GYDmQBSl+kpAH4K4Gi+FCjoQhMASKcdXH3NkAUtIaKwyMU7sa3tVJ5vghaU/DGAv5jujePzN5puwgZNu20x3ZBlYFSPqPqkJsDPNTvI60wAKUZ4NoDvAThLvycKpNAEAHbumsbwiLFiy0QUQvHcIDb3XYm12cU2G6AQ2KN7Xxudej/VMZ76LzNtFwI403RDlukYX7eeyF7FmgDvNZAJAA0CfFY2SuFrhIIqFAGAsfEc9uxJW9ASIgqbuulHcGLflehwjC35JvOymtp6rcmtJU93dqDHuc90Z8ja/9f6fPYfWjyMiGojq0GA1xnIBBDnacD2ZTy/FEShCABkMg5Gxzj7T0RmpGZ24txHL2Xvh5dsM/U5qQlpsgcaCuv+jcUfiuSC+hzTjSAi60kmwC+0boqJLUuOB/DfAF7IlwoFTeADALm8i+uuN17siIhCLuJm8IxdPwx7N4SRRJ/fB2C7yWM/zdmNBrfXdPd3aF8EYW1tzII2EAWdo9lT7zaUCbACwCd0l4AkX20UFIEPAOzePW1BK4iOEAfQxG4Jl2h+CpumTVzDkEGS9v9tkw3oQAaNrvEiuHEt7LXCdEOqhNuFEXmjWBPgPQD6DfS57ArwGQD/wiAABUWgAwBbH5zAXXcbzbgkmo98iHBz+JCJ5cfQNbmrGge9kdu4+kK/znjPmGzsyfm70Wh+9v8JAP7edCOqqDMwR0Jkv6wGUl9vKBNAspf+U9/P+bdPvhfoC8jBwawFrSCaU4QppEa9GsCwpmcvdJP1QydXs6HtIzdh8+Se5f6aRm5R5AvfBXCn6YbWuSaWzx4mAeAlAFaZbggR+VaxJsCbDdUEkKzN/wDwYS1mSuRbgQ0APPzwJA705yxoCRFZKKLvf+XcqjzQdtGQHUXSdfi6CLZ7APwfgCmTR/mU3J9Md3JEt9N6ZsCCnlzCReQ9+eD8uS4nMpEJIEuZXqPLEZjFSb4VyADA9HQeA0Oc/SciO60Y+BNaHb5HBZjsO/s9AHeZPMRNbr9eLxuV1NT/oO2bf7wFbSAKo5xu0fduQzUB5D3t7QC+COA4vgLJj+JBPGsSAOjt5cU1Ec3r1wC+VMbsrCwDeLQW3Xja/ivxpzXP5BkKpkcAfF1fP8Z0OL2ImA8ASL2Kl5puBBEFilzkXwZAqpt+FUCPxwcnQYAXA2gF8K8AHuLLi/wkcAGAfN7FNddx2z8iWtB+ADcCGDPVTfXT2wopWFwIEDiy0f5r9cLUmFOdvWh099nQt5foRXKQtANIBeyYiPxGAqy/0hojXzFUnO/pAC4F8EoN/BL5QuCWAPzy1wMWtIKIaHFP3f0T9lKwOJqaeqPJo2pEHilYsQPO8wGcZ0E7qo0BACI7FGsCvFsD+yacD+AHAE7ha4L8IlABgH37jO60RERUkVhuHCdNmbpmoRrYAuCzpju2w51Gm7PddDNWAnib6UbUSJzbcBJZQ2oCfAvAuwAcMNSoM7Xuy9ODuryagiVQH2A7djEAQET+EcuPoX16L89YMMgH0DcAPGj6aDY699vQoS8CcIYF7agFWW/cELzDIvKtrO668jpDuwOIzVoY8EXc5plsF5gAwCPbJ9HXx8J/RFQWa/bQ7xi+HqdMMggQALdoGqjRD6KLclci5Q6b7s0NAJ5XWI0QTElmAFDIuRYefrEmwFsM7Q4gjtUssL/mewTZLBAvzmzWweQkS2mRr0T44WDUGpsGJ02ZISRdvof5mMz+f0dWopk8hKPcSUTMX5fL+9pFuvd/ULVqEIAojCZMv9ctQD5If6b79JtaX9ejSxJew0whspXvByCuC2zZOolHtjP9n3xFLh67ecqMSdqUotc9eBWanZwFLaElugLA90133lpnOyIw/jrq0G2xgnzhK8dYZ0E7iEyQmfaMxT1frAnw7wZrAqwG8HnNRmg21AaieQUgAOBy8E9+FOeHApU6o/cK9oc/9euF5pTJ1p/g9qPBNZX1epiXh6AadjMzAIisltWifK81WBMgpYUJ36tBQyJr+D4A8Itfcds/IvK/1MwONLh5nkl/kXTT/wTwsMlWywd5yk0jan5Sbj2AD4RgeVMXMwCIrCcfqL8G8FaDNQHaNUD8bu4OQDbx9Yf02BhTZokoOM7f8wueTX+5DsDlplt8srMPPc59ppuR0JmuliU81k8f5nGd2SMi+0mQ9qcALjZYE0C8E8CntEAqkXG+DQAMDWVwy62jFrSEiKg64rlRnDxla20lmkXWln7F8EVlwUrnHtNNEGcBeMYSHpe1oQ8r0MT6LUS+IgHGbwN4h8HlANBMhM9IzJYvHzLNt+kowyM5TEywajYRLYms4T1Vxk416r6VWgRodpD1BgD3zvegWH4MrdP7gYbVPKt2c3Xbv99pmqkx5+fvsKGj2gD8M4BVS3isfJCP16BNtVKvuwAQkX9IoPGH+l7zda3U7zXZ/enZmkH0egB7+PohU3wZABgZyeKeeyctaAkR+ZTMVv7GQNPftlAAgHxjQtM5R0w2uB55pFyjTSg6DcDf2LSzRg01sKAXkS/l9XNfZuI/ZygIIEulnqnteLYGAYzv3Urh48slAMMjWQtaQUREIfW/uv7fqMflt9hQ+E+q4b9UM17CIMm9vYl8q1gT4L2GlwNIBuKVAM4OQdFUspDvMgBk3/+77ubsPxEty5R++Neq+Nik/v7Z65R28LT53m0APmn6IDa4Y0jBijo45wH4ewva4ZVG1gAg8jX53P+Wfk5/1lAmgDgWwJd155TfA+ajuRQevgsAXHf9sAWtICKfu0sLAvXW6DDy+mE+O7Vvgi8cX0sD+DCAQdMH0eROIOFasXT+00us/O9XrUusdUBE9siV1AS4xGBNgNM0CPAGQ8sSKaR8FQCQqv+DQ9z6j4iWbUbX3llVhCedWosbOx9vQUtoDhLM+RGA6013jsz+rzJf+V8uXl8MIGwv2KSu4yUif5MMvSsAvF2r89eqKPBCJP3/KAA/APAsADczE4C84Jt1J1NTeczMsOo/EQXXeOMx5R5bkw7AyDsSLPqelKEx3efH5W803QSxFsC7LGiHlyKatktEwSDZej8G8B7DNQHkM/2XAP6Vu4yQF3wTAOjrS2OIs/9EFGA3dZxW7sGtZeEgT0n0+ec2zP6f4Ww33QRotf/nSyzCgrZ47ahwHS5R4Mng4jIdfO83eLAy8P8PAK/TWiNENeOLC8jx8Rwe3DZtQUuIiGrjgbUvr+T3+nILVx8bAPBxG2o4tDq7bOjFjQBeoLNWYRIxlCZMRLUlQYCfAHiN4UyATgDv0+KERDVjfQAgk3Ewk3YwPc30fyIKpnysBUMJBvwtldNU930mmyd7/p+bvxexQvkKo+S64WkALrD0fNWSBAAeF9zDIwo1GWj8TmsC1KpAcDmaAbxWdyoIW5CVPGL9LNJvrjBebJmoFlhEig7ZteJpGI4m2SF2+q1eiBl1tHMAje5eGzqoHcAbLWiHKW3hPGyiUCjWBKgH8FGDWwSKl2oA+mMAts+xqxDRklmdAbB7N9P+KbA28tSSmGo8EYOpdvaFnfZpdWij2pFFh2s0AaHUOwGcYktjPCZpOutCdcRE4VOsCfAWwzUBZJL2n3Q5wHq+DqmarM4A2N/HnTAosFjl1ayTAXxJxt9ltuL3uk1P1fOvZ5Kd6I03WNQ1pHJa9f820x2ScnOoc/tNNwM68H+bBe0wpewqnUTka/L+/1MAkwC+YTATQFIDn6mZV/J1nC8rqgZrAwA7dk5hz14GAIioJuTD/LkV/OJ+LRBUVZnUGtzQeQbPsJ0e1H3/J023bnP+Ghs6SJYt/T8AdRa0xZQTw3nYRKHkaPD/HQA+CWC1oU6QXVfOB7BFr1vu0rYRLZmVSwCyWQcjI9zyj4isEa/FvvujTZt4hu0kF1ffBnCr6dad4A7Y0kEXAXi6Be0w6czwHjpRKElNgB8CeC+AA4Y7QAIQXwNwngYFiJbMygyAe+4dx67dnP0noprZAeBXFaTT3aUpgVV1c3tYl1JbTwb+l9jQyDX5+y1oRSH99MWGC2LZgDsAEIWPfPZ/R2L2unTQ1FagMglxOoAvAvgggJ/xtUhLZWUAgIN/IqqxRwH8D4Byy6o71Q4A3LfulTzHdpKU/9cDGDbdujOdh23Y9k9IqsqzOOvEAACRBTPhJsjn/8+1DpDJmgCSuX0qgG9qm35ltlvIr6xbAvDzX1pR6IiIgk2205FIY7rMW7aaW/Dk4h0Yi9XzJWYfCfR8HcDdplt2srMf7c7DNuz8JEWo/h3ACtMNMWwTt28lKrBiP1IDSmsCmO4DKST9fQCv1C0LiSpiVQBgaJgz/0QUfHu6/wqDMe77b6H7dHbHqEbk0eQaT0AokvWmf2NHU4w6NsTHTkQH5bU47PssyISQbUk/BeDNDAJQpawJAAwOZnDb7eNwjU92EBHVzmTjSehPdbGH7SOp/9/V6v9GNblZtLg7beigNgCfkJ0ILWiLaaeG+/CJSGW1JoAsFdtvuFO6NEPr7QwCUCWsqQEwMZnH5CR3tSAiT6RMrWfOJNqwP87PaQvdq5X/jaeinZy/yZbeeRUr3x9ytCXtIPKCpLiXRiH7tXaOrDu/gWeg0A+/0CWE3zRcIFWCAO8HIHsKvwzAtMG2kE9YEQAYH8/hjjsnLGgJEYXEak2f81Q2uRLXd53F15h9MrrPs/HiVj3uDGKFa0rj1gB4RS22v5zFD4V/ZO3/SRa0g8IhM6vobE4HmkXurEGeM+t7maHeqgXrit8/qlXsi/ffA6Cv5DEyk72Lr6+KyHn4A4BzllgjJaLvKw1Vak9OA5VWbB1jUp2bRrMzhub87vB2wiKsCAD0HbDiYoeIqKaGWjazg+0k2yn91oaWnZS/1YJWFDJk/sGjWe+HPXiO5Tpai24RLSY7RyBxdsG4gVkD+rm+Ly0CMjEr1TynA/qirG5tS97La98vtf9v4TmrniZnEnXuNLpyxlfyWc+KAMC9901Z0AoiotpK5JmZZyG5kH7XrAtwI05x9tmy7d8GAC8B0GxBW2wgGUNNYe+EkNipA+4iGXgPlnzfO+v7kVkD/NwcW4gOzPp+ZNYM/4gO4oloCdZmtxcelHLHEHcn2YVlMB4A+OOfBsu4FxFRVckM5wsrGPRt1xniZX2yNE8+DHSewTNpl0/PWutqxCa3Hyud+xEpTCgZ9zQAp4f3JXGEdQBaLGsTHWlIM0qKg2m5wHyk5PtxANsAFGedMlr0c6zkN+U1Rb7ImfV9ftbenI7+jIg8tjK3Dy3OXkRd7iJXKaMBgDvuHMMEC/8RkfdkRu9DFTzr7wBcu9wAAFlFLuL/COBXphuVgIs6d8qWwb8UlPo327YJNkj64QTdEYHml5lVQDM/RzGy2cWepkoG13ldt158jKPZOSMl3/fqrWiAqe9E4SLr++NuDkdl7+KZXwZjAYCJiRwmJhg0JSIiI2R28LI51ud6rg0ZdDtbbHkV/JdkVFrQDlu0haA/iuvWS2e29876vn9WxtTs74f0VjQ1a7DuaCZV6fd7bNh1g4jsl3IzhcJ+7fn9WzfCAAAgAElEQVRdiLlcTrlcxgIAQ8NZDA7lyrgnEVHVyUXnnbMKKS3krpKKyhQMf9DZf+NpaMfnrRn8nwvgnyxoh01adQmAzXaXVHiHVnfvn+P74oB+VAffxe9z+rPSAf/s9Zmjs9atj3LdOhF5YV32kcLuOClndnkNWiojAQCZ/b/rbmbSEpEx+wC8AcADZTagKus8r137Qp5xe3x21tpfI56cvxlJd8SGTqkD8O4qbkkVFLIk4rgaHsuIrkPPzPq+OLie1O+LF03FdeulLxpnjnXpC33v2hD4IiJaSE+uF235XYiAE8bVZiQAMDmZRz7vlnFPIqKacOdYs1pT6br1mIrEqvEU7axIviwy8PkIgNtsaEzUngubRgDfmacmQoNuhZeswfPavl9TQgNFxWDRVEkwUN5HtpSsW3d1Tfpwyff7NeBYNDwrFZ6IiNTBNf55HJW9k11SQ54HAPbsncatt82uA0NEFGx3r3p6tY6vSXcxoKWRjfY/xr47gqR8/8iyNtngfgDP0na4XLdOZE58/LHEl3xjC9woa5UGhazxb3FG0Jrfi7jL7eFrzfMAAFP/iShsBjouxGiUY3YLyOzrx+eoTk40n9FZ6+uJyGOxiTHEpiYQnRo/9MTRqQlkeo7iqQiA9dltiLpZpFyu8feKp6Gzu+8ZQzbL1H8iCpfJVDtmIpypsMBvdDtHa1wfOzfM54OIaEGx6UkkBvcfNvgX0elJpPZyF0g/68nvxwnpm1HvHODg32OeZQBkMg6mZ1hzhojCZaTtHNzTyF3VLCA7Plw6a6sy47Lcbp+IaE7RmWkk+vbM2zmRbBrJA/uQ7eqBG61KjR2qsXo3jRjX+BvnWQCg70Aavb3cMYaIwqUufQDrsuPYlWjmmTfrlzLhHuYOICLyi9jkOBL9+xZtrWQGJIaicJJ1c/6/k0zCqePmJqYl3SzanGG05Pch7nI5uGmeBACmp/N4ZDuXXBJR+NRNb0db5nEMAJgl+6B/ctY+5kREZCFZ858Y6iu7YdGJUUTnKdXhxhNwkylku1axaKAh67MPIebmkGSavzVqHgC44veDSKcduFz6T0Qhtb73Z+jb+Fr0xer5EjDjZbO2YrPK3bELcVr+zyE5FURE84tNTyEx0Fu1HorksoVbatc2uMk6pFevZ+97ZEW+Dx25R3QDFbJJTQIAssf/5GQOW7ZOYobr/oko9Fx0pYfR18AAgMfkA+hyAFfZ3Eg3YkEjiIg8EHEcRLKZQmG/SCbtaZdHMjNI9vci27mCNQNqpN6d0TX+dwXy+IKiJgGAhx+exANbmfJPRFR09L4f4/5j38r+8JaUiP6CBgKIiJYsmp5BNP3Yta2TqoeTmnvdOc3DdREf7kesZD9/r0UnxxCPRJDt7AEijL5Wi6zxb3cG0ZzvQ9ydCMZBBVjVAwB33jWGHTu9jegREVUoCeA8AGeX+bA9WkCOkU3/kKqzPwbwF9tbPIoEBqMnoNN50ILWENFsyb49B1PJs5lD/+MmkoX15UAEmZ417LMyJA/sLWzfZ1psYhSRXA6ZlUfZ3WE+cXCNfxZJ11xghypT1QCA7PPPwT8R+YBcrX2tgmb+DsA9DAD4ynYAlwGYsb3RGURxR3QjEN2IC3PXIY4prpkksoBsMTd7//kiCQYUAwJ1Ox5ErmMFci3tvjtt0WwGyb2PHvazfFsXsm2dVX2e5P7diM5MVfV3Lkd0ZhKp3p1Ir2JNgKXqzh9AZ26bPxsfcp5tA0hEROShSwA84LcO/3P8AnQggxPzDyDljiLGmBORpwqp/tkM4hUWoosPHSjcMqvWAdEYnETS2hMXyecKGQ3Jvr2Akz/i/2MjA4VbZuXag8eSTC39uRynkPZv0+C/KJJmTYBKyRr/uJvDmuzd/mo4HYYBACIKI9kObqfeynFXYaJ2mc4Y24bbW47jC672rgbwFb82fghJ3BB7HI5zh9DgTmKFc78FrSIKtsLAf2YK8ZEBLGfrqmTvLriJFPJNLYWbG7PrUjs+OnTwWOfJbCgls/ayzCHf3IZ8Y7MueVj4d88mgQaTa/4XIzUBEpEIMqwJsKCEm0Nnvh+NzgEkuMbf9xgAIKIw2g/grZrWXw5JIx9bbj91j9wBMABQa3IF+jYAvr9C2RbpACIdWB9pQ5fbjw7nIQtaRUEWm5o4bLCWb2otDPyCbq41/ssRyaYPFrubmoAbiyGzwnyNgMLAf2aq4jX40i+FY5kcP3gsPUeum5f/k3X1NqzvX4roxCiSuezBjAc6wvrsNsTcNJLuKDsnIBgAIKIwkgJxsuhxt5fHnsjsx/kDt+L6rrP4oqsNV6v+3xukg9oZaS7cED0aF+auRQxpRHBk2i7Rkuhsd93OIwNMMqBL9AMz648/+IOAzZBK+rfMANdKJD2NSLFGQGcPck2t3vah6yIqqf6z1vgvhWyhVzyWIJLgyMGaAOsKhR3DLgoXnfkBdOYYeA4iBgCIiDyUyI2jO59Gf2zpayppXrIo8SdB3vbvz/EnoRtpHJffijp3hDUCaMkK+7Fn0oWU98XWZ0twwE3VI9veDTeZghuN+rrjozPThdn5Wg7+Z4sP9hVumZXrgFhtawQU1vhns0j070Ukz2BhuQo1AQb2I9sR3poAssZf0v1Xc41/oDEAQETkoaaJe7Gy+Tj0NzLVsMok5f+7AAI/XdGPFPpjpxVqBNS7U+hx7rOgVeQnkg4u26DFxofLbrXMZif37yqsB5d17bINnt+WB8igvxj0MEX6sFAjoLFZ+/LgQDM2PVXo4yKnoams4nsSyImNHX4eo5l0WWv86UjRiTEkEL6aAAfX+B9AozOAhMvXTtAxAEBEYdQlk1qmjnvN4I3YW/98DEXtrRLtQ1s0AFCdRbw+UKwRsDbShhXuAdYIoLIkRgYLFd6X6lCNgGis8G9Jbbe54j10HXtiYD+i2TRgwYx4oUbASPpgjQDNpihsK5jPHbqPOzlWCLQsti69UL8gzUygapKaAKlsRpcDBJ+s8Y8XZv69y4ghsxgAIKIwkmkrY1esUgug3skCDABUi1zRfwBAXzAOpzK7I02F22M1AjKIIFfNpyC/k7Xg2TSS+8rd+KQMTr6wdKCwvjwSxcy6Y+d+zEKzqHNV25/3/u7BKh9KCs/JffMNTXM/Rn93as/2wwbWNimuq5+z2yQgkM0U1txLMcZs6Yy06yIx1F9RBgdVRoIqqd5dSEsAJoCZAFE46MgPoSsXzJoOtDAGAIiIDHj8jkuw99i3suurQ/b8vyIIB7JcUiOgx53B0c421LtDrBFgGVmPLQPxfKquMGiuBUn/jsza2z1xQPZ7r2FpDNcp1AnIt7QXggKSZi/ke0llz9c1zLq/i/jYcKG6/GzZrlWF7eacuvpD/xOT6vWybn+OzAXZmC67cm1htryYiRDTavexObal8yOpsC+3bPeqQoG6RP++QByX7QrLXgb7kO3oDkxNgIbCTH8Gq7KBqpVLFWIAgIjIkLNGt+LW1k3s/uWRBfAf8fMBVFtfpA59sc2FGgF17gxWOuXudul/q3J75z2G/fHVcKtU3Ts+MVpIKy+Vbeua876x6UlENUVbCrNJ4bloczvceBy51o4j7y/F6TIzR/x8vt9fJIN+GVRHdZ27CbPXosv3cou2dcLRde/x8ZGDe8PPMzhPDPQC0WgheHDo94wMLng0CdmvPlUHp76xrPv7VaK/N5DHZTNZDpBwXWS6Vvo6EyDu5tGd348GZ5Br/IkBACIiUzrG7gMqDwA0mqxfYBlZ7/95APOP+kLsYI0AYCjSWuiEo50tqHPNFT+rtQ3ZB1HnzH989c4wMtEm7IlvWHJLZHY9MdhXWMM9e0Y9Oj0Fp77hsYG66yC1fw8g+8vPSkEvpG5HIoXBfq6tE/n6xsIAPtm3d877F3+/DKBzJQPjouSBvYWifpE5Agc2kAF5LBorBCgKwQl3kWwEKWxX4SBeKrjH0nYeP/mbBO02tgzh0dTJvjwOrvGn2RgAIDJjjoWPFDbJ9F6cN3g7bug8o5Ijb9cgQNjJ39A1AP4Y5G3/qmFv5ODLZW/szMLXi3J/RgT5wNQJkP2qj8o+suDgXyTdUSTzo9iU34v9iVMwEW1CDmWm9boOIq6L5L4d895F0oVjcit34Oq6hcck+vYU0tgXI/eNy23oQOGe6XXHFdbBxwf3l/d8pjl5Fqsj35L3j03pGzAa24D++Mry3zsMiSOP1vwIunNb+aKjIzAAQGQG8/ioIJUdwYr8DA7EOKlfIck1/iaA+UdkNKcr4xfieHcQnU4vmtw9vu6kGByszO1Bg1NZ/ceV2YNbJ/YmNiMdSWEmMvd2azIrH03PID48YN3semrXNgtaESpSyOAcAG2yIgOArK2pYlVF8oPW/I7CTYKIOcQxEbUrHs81/lQOBgCIzGDKsnlSsvrIBbjVczWAqcV+W+PEfVjRvAkHGtcErX9r7fcAfhvsQ6ydhyKdQKwTpzidSGEKHY4/B5OrcrvQlF/626lcJKcj7TiQ7kImd2RRvkg+W9gXnAhAN4BPAzgdgOyF+HYA32LHhJMEEfORekxGV1h1/LLUian+tBgGAIgorP67UE65ds7i7FDNSAWjiwGMBvT4PHNfdBXq4KA9shrHOvehzvVP8bQN2a2oc5bf3pQ7jNSkg/xMOYn4REQHxdxptOT5MU/+wwAAEYVVrcP2wdgzyD6y3v/9TP2vnhlE0RupR2/srEJE7MLc1YgiZ22NgINr/rdXZfBPREQUNgwAEFFYDdd4KUaGr6yauBHA1wN4XFaQyopXxf8KJ7gDaHcOoNndZVX7Hlvz75PCd0RERJZhAICIwuojuk6/Vvr5yqo66dPPAmAp8Rp7MNIFxLpwstOBOkxaUyNgdXYnGp19FrSEQqhetuLXw3a0ECARke8wAEBEYXUDgNtNH/toy1nY0dAT2pNQAbngvgLAn7ntn3fuj64s1AhojazBCc7dhfXyplRrzT8tapMUOwdwC7vqMF26E4CYABCUNBQ5168DcKp+/w19nyWigDqy5C0REXnCjcSQSTRjIsJYbBn2acVtcyPQkJIaAX2ROlwbOxvXxp+GHBrhlLVzfXVE4WBdYZ9/Dv498gUAN+uKkA+F4ojLEy0pHCtByLztDS6TZDZcBOBlejvOF60moiVjAICIyJBsciVubt/M7i/P/3FWyrw0ovhz/ALsjZ2Kscj6mrdH1vyv4pp/IiKiquG0ExGRIXs6z2XXl+dh3X+bLLE10g3EunGS04EGjKPdebgmDVud3YFGp5ennYiIqEoYACAiMuT+htXs+vK8EcCAHxoaNg9Ee5BCN1qia3FS/g4k3dGq9cDG7FakmPZPRERUVVwCQGTGpM5qUkjdvPENPPWLc3Td/w22NzTMZFlAP1K4JvZE3Bh/KnKRpmXVCJA1/2uz2zn4J/JGE4BjSp5pK/udKNgYACAi8thU4yZkInz7LcN2AN8s1KEjX5hEDH+OnV+oETAa3Vhxk4tr/pn2b4wMBlP65DluuRlKk2HvAKKg4xIAIiKPHWg5CaNR76qo+1QawOUAbtVq5OQjhRoBkW5sinSgyR0tu0bAmuyjLPhnVmfJVndTXHpDRBQ8DAAQEXlotPUsPMK1/+XYC+CLnIH0NwkEpCKdaIquw+b8rUi44/Mez8bsFqScobB3mU3cAG11R0REigEAIiKPuJE40vEWTEVi7PKFydr/DwLYbXMjqTxSIyCNJK6OnYdW5HB6/i+IuTOIIlN4vKT9S7V/Dv6JiIhqj4tQiYg8kkt04Zb2U9jdi7sawI9tbyRVbhRxXB07F3tjmzESPbpQ8G9lbjfX/BMREXmEGQBEZkhxpQn2vVFSoWyszAbIVOUu/bpkO7v/Kni9WH17APwbC/8FW7FGwKvTf+SafyIiIg8xAEBkhhQ462PfG/XVCta3PgLghQB2LKfBW+p77O4RO1wC4L6wd0JY+Hzw//casBJ3LxLUXVmy1dqQbgOb9aCNZM4/Afg7ffbbAHxkkZY8G8BLAWwD8ACAX1cwUXA0gGcAaNTH/FBfZ0RER2AAgMgcVjY3q7mCZ28rLFWmWrtFU/+XlWlBVKkV7aPoHWhHOlvRn/kPSv59lg7y5vN8AF/W//stgFcC6F/g/ucAuEn/LfuyP1k2ECmzXSfrY5u1mOZLAFzv4YtCMng26L9/CuCqBe4rbX25bj+4D8B3NNtqPq0Ang6gXguEXq+PK4fsbvAkAD2ahXd7jfe8PwnA3+q/y7nelkH8c3QQL8ugrq0gAHACgPfrse3VPvcqALAewLf1NSrXNa/S7+fzTAC/0f+bKOOz+AwAHwbQXVhFBLwOwKNltq1b/+7W6/fStvsrPcB4zKn0IURWYwCAiMKqv4KBpqSjRyzpp1hA67fI3tPfB/CgBW2hEFrVNYyBkRZMTCd5+pdHsqWeoL/hkUUCAOt1UNatmT+/XyQAsArA5zSjYr8GD8oNAHQAuBjABTrwfFeNAwBUHRIgeByA1RrUqK/gt8of82YNkECDKxVJJfPoah1HJMI5GwoOBgCIKKy+BeBXFRy7LVXKOnS2LGju0Nk/bjtGxnS0TCASacL4FIMARGWSgHSigs5K+aVjE3GnMPhPxHMWtIaoehgAIDIjz/3NjZP1/Nf5sN2pCi+2/OJ9XLNKpkWjDjpaxpHLt2I6zUskojI0aUZG0UI1XCRYcGzJ9zctcF/jJCsoypl/CiBuA0hkxkxJ8SgKgb9sfB1P89xkceXnAVxjY+MofCTVt6djBKkEk1GWIFlSLyWva+0X0lIyGZVjYURfiswaTyz0hzP7vlZOrcvM//qVgxz8U2AxAEBEVGOTTadgJsLZxHnIbNGnrGwZhZrM/jXVsx5lhdaWrLMeX6TQoVhRkhI+VMb9iWpK1vyvaB/jmn8KNAYAiIhqbKD5eIxGg5i1v2wyQPiSFvMiso7UBGhuYBBgicrJACCyBtf8U1gwAEBEVGPr9v8aK/Iz7OYj3aiFGHm1RVYq1gSoS/IlWmrdysH5/ovTplRtCV1aUnOru4Y5+KdQYACAyAzZ8uxh9n04RNwMOjOjYe+G2YYBXGbR7gpEc5JU4JWdI6hL2lMTQOoTbFg1gJ6OccSilY25k7q+eU33SMX7m8v95XGyNnp11+hcj6/1dqnRxZ5D+map9RuS8Xyhb5JzPz5SwfFFZxXarspG8ss5NpndXk4gS/rGkHYAXfrUko7zwFzHFpn7zNSXbAEo7p99h1jMLfSLnHem/VNYMABAROSBY/f+gN18uCsA/MKmBgWcFGbrkcnbeW4dvCZY2MrO4bLu15DKoq25/IyfhrrK7t9Yly0EJER9Ko3O1smyi5XJQGdFx8H1zTLT2d0+URg8lUMG+91tE4dmSJOJLLraJsoOIkjgQY6z0oDFLCtKBtYTGkw/pLH+YN/0dIwW+nWWppI95HP6+Fl9c3C/9572MdSnjhgst5c8Pg1goahuo/5NQbMiDgt0LmUwLscjx9XTOVJ4DVRCggayrl36pqUxXdFjUfK6aW+2b/MiCdZ0t42jo3mqnLsf9nqR12JX60ShXzj4pzBhVSoiCqu/BbC+gmP/H85WV80AgItnX4z5yEodiJTr1AruK4Px1jLv26ZF18qZlZTBfXNJhfZSMpq4FMB3qjVTGQL1cx2iDJQ6WycQi8lMbRZ9Q83F/+oouVu62M8yyCzcP5pHMp7DgeGmBXtOBoEdreOHDVYa6mbQ0+Ggd7BlwccW1jcXBuyPDTxTiQy628fRO9AKd5Hxz4r28cKg//DjzRR+vm9g4ZesBCi628cKwYOGVHrR+0MDKS1N0xgYaUIufyg21VbyGh4vHcTLoFiWa0jfyK2zZQKu21y6nWNrSYHCdGnBQZndLu0bOX+drePoH2lBOnPoT6a5pGDhtGYxFcgAWwai41OHMtUlbb1O/+2WbnEqfSF9Jm3sG2pBNrd43K34OpElKUJeAy6aMTWzeG2Zg4GbccQ1cNPePFF4wxidLG87fjmuLnl8LI/WpklEoy4GRxvKemylpG9am2YwPD7nn9cRZAAvxyavK3ltxmLOon9DpXo6xo54TROFAQMAROYM6AxCuRf7VF1PAXBRBb/xuwwAVM3bAOzUQdHxZa7vTOp9O8q4L/Ri/XEVNPiMksHBYipJBUaFM+uV/O5K2zEfSYu9xetaDK+Z/j8vn64qVnaMY//BQf2mkt/3qAxGZfDS0zmKiC6Dl9n5ng4UgwAbS+6/S7aClYHZio6RQydQBvLdbUD/yNwDGBnAd7ePznnCU8lMITV/b3/bvIcp65vnmuVMxrNY1zOInfs7533sQunRMoCSmgC7Fnj82p6hQ4+X+8v3u/vm/1MuDFo7Dh7rmu7hBdsGzS6Qviklg/gVHaPY09eBvHNEr7mlwa5VXUfOAMuAV2aGd/V2LlrYYKU8Hi6yuTbMZBa+tC7tCzknix3b7NcJCgPfg8e7r79j0QCC9F/pscm/21vGkXMimJxe/K131azZ8eaGKbhuBENjiw/SJS2/p/3Q38yiin3jOBGMTtYtev+jVgwdEQzrbougf2Txt/K1PcOFwBtRGDEAQGTODPc8NqrSwVOt17aGyXf1RubJoP+Lc62rrZW1bgZPylyDemerlwdfp0Gk5fwdT9al0rnutqjMgEYc99CvcmUGWLYNnO1gin4Mw2P1Zd2/sX4GeSdamAF1H7t/of7AYksQZBZUagLIjHnpgFdmcGcP4maT/5MAwgGZkX5str0w+OzpGF80PbpYE+DAcHPpbH0haNHTceSWajKAXdU5Vgh2zL5/POoU0tyL5LHreoawf7ANmTkGu5J1sbLk/qVkUL62ZxC9A+1IZ49Mflmsb+Tx61cNzPv42edR2iHtnCsIMFdfyL8luNI7IMc2x+9PSvvmPu8HgyPSL+2YycxxbHF5zYzOH7iJ5zG1QNXGhfqmpXGy8BobnZh/kF7aN11tUQyNNqDkb+AwB/vmsba2t0zAcaOlGRVH3H++Y2usny75GzryscWlLBz8U5gxAEBkTl5vZMatAB6q4JnLWwBM5C9Sh+EbXrb4uPx+dOSu9fIpJdf55QDOXGYAQDKAZmSAkctHVxfTlKNRt62rbfz1mtV1BJkxnZ5JnDaVPpiuXZfMndXdPvbOkgCwjMMGizPSLY1T8vuPHdMZ0GjUbeluH30BgLHFGigBh7am2FFD4w1xGfxEIm6yo2Xy1EhknpFXCQkgtLdM9gyONjXJ4C4CxFoaZ45PxLMXzHF3CWAfKP2BzOy3NU2vHhprSOhAL9raON0Vj+XmXGolWQtN9ZmOkYm6iB5nXUfL5Jr6VLp/dnA8WpjxHsPASPNhA3FZ89/Zumi3FDIBBkcPT5mXwIGk/Zez9lvWzw+MHracoJCWL1vGzSZBgMHRlsMGr4XsjUIa/ZFJNpHC8ohxDI421c9k4sWDyzfWZfOdc/z+OY9tpDk2OZM4FB1Jadp+ccnAXCSdX2bo55rJL6dvZCmBBH7mStef3TdN9QdrBwzMMTP/2PKLwy+H5LzGok0YmRVkKCxJaF14AC8BCgneDI4dvlRBlgxIzQx57RGFGQMAROYM6gVdD8+BET/Sdc/lWvwqk8hfHgHwVq2s7YnVbhZHZ6/zupPOBvAOXUJSFTLQPhQAiDgdEbhvX+j3xkoK5aWSufOiEfe8kv/Oaj2MQ6Otxrp0vBgAiEUd+Yz4aLlb7KVSmVhkvL7ORUQGaO0RuO/RAfuikolsvC6V7clmo4hE3YZ4LP9qAC+e43E5XYN/mGQym4rFnDVOLiYD+uZo1JVAx6vne95o1FkRibgpyXZIxvObE/HcJfrZeMToTgIUzY3TK7KjjU0SYEjE88e2NE59NRpxJ+b+7Y+RjIOWxumGTDa2WjIOpG3NDTOvjcdyTy2nX2KF9e9TJ8VjyXrt1zXNDTPvicXyxXUHu0uDxK1Nk42O627MSrAiUqjdsDmZyL58vt9fqI1Ql3my4xysMZBK5tvbmqeeHY06EnTau1DbohFHHnvq5EyisP6jMMPdPt4Rj+VOW+Bh8prb2dI4ORmLOgP9I40f1/oKch72FNf8L2aumgCF4EPreKHPSkkQQLI7SpcDFIMf822919o8WbhP8W+tdM3/Ypobp46oCcA1/0QHMQBAZE6W+58bNcVZfQqxGS3EuODgotpeMPVfXtcZlKv/l1Rz8I/CQDlX2IavXDKrL+n90MHorJnVRHHwdegH8VwhxRkHB0mxaMSdf3H/LPL7W5unC+nP0Ygbj8Wc1eU+9mB69KFYp8wod+utvOeOOEglcoU25J1oHHCPXuj+s9LhmyMRd8GCmYUZ7cjBUEg04jZHI+455bZNnqu4W0Ik4jbGYs4Lyn0stOBh3WMzx9Inr9F/HxGYkcFzd9t4MetC+vHZAJ610O9vaZyKyOtEPR7A18ttm2SlNNZPF59vDYAbFnnIY8Gmg49FSXbMJ8t9XujAPhnPFvd2iCTjuSujUffuue5bl0pjZaezbiZzMBMjHnWekIjnrprvd8ssfkNdeoWrzY1G3KZEPPeBctuWSmY66pKPDfiTiex8j92htTmqvRWAdOyDAOZeo0JkCAMAROZM6IcDhcBfNr6Op5lsIYHHywFc7WV7TneGTWwyIMU+X+b1k86WiOeRqGDFl8yqlg5cKlEIADSWtSVa1cmMq8wel6u5YbpwK1dDKoO1K4aQzcUKA/pytyBEYWY7V1hGINkGkvo+e4Z6GSop2lmJ5SxXWeyxC/1/Rc8r5yF1+GtVqjteON/95XVd8truXOi+0GBYW9OhuRIJ6H2w3LbJ30IxkKbKfqwPjGjgohburdESVclo2V+D3ytt3VZuplOF0su8VpcdQPbUoF3LwgAAkTmjPt4GjSow3nw6piOLb9dE5JFdWvjvgFdPeH6+F5vTP/b6/MoOK+/VHSEoIGTAKRkYlZLHSSCGKCDaKtzpphK1+r1+NLrMbFHJAHlh6ZalNmAAgMicfvzO4VUAAB95SURBVKaFhcNQ00aMRfl2S9b4hhbB9MzK/E7E3X6vj/9Dur0jERHRUrQuc7vuDQDeCOBTNvV+JXsTE1F1pbkNYDis770cPXmu9iAr3AXgI17WH7kwtxursr/x+tgvAsB1N0REZJoEAM616SwwAEBk1iPcCjAcVswMhr0LyDxZf/kPXrZC9vw/Jf01rw98BYB36t7/REREJq0D8HqteWEFBgCIzNrJAEA4bOj9adi7gMya0Jn/B71sxROycxYDryXZfP1FuvXfcoqoERERVUMMwPMAPM2W3uSiVCKztjEAYMwTdRlGuX6m1VyJ/OhPAH5Sg22uFrQ6+0uvu2qNzrS0e/3ERERE85A6ArIN5TUA9pnuJAYAiMzawwCAMS+rcHuwWxkAIJ+Sqv9fANDnVfPr4eKl0//ndW/JjP/FADZ7/cRERESLOAHA9wH8telrfy4BIDLrgWVuL0LhI+uauacgVUKq/l/lZY89M3Mr6h1PVxtAL6pe6vWTEhERlelJAP7V9HUcMwCIzLtZamXxPHhuq2ZglMuWPVy7AbRY0A7yBxn4f97Llm52xtCa3+F156zVbZbqvX5iIiKiCrwBwB26HMAIBgCIzLtZi1aRty4D8O0KntHzTcyJlulhAK/xMsuo283hiemfIuVs9/LcyUzKm5j6T0REPnAsgLcCeEh35/EcAwBE5t3Ec2DEqJeFWJwoJybJU1MA3g/A06n4ZuS8HvyLswD8La9piIjIB2QJ/vMB/AHAV70uzgvWACCyggQARngqPJfy8glvW/9Pdhw1hUFOd624yssLi7Pz/XjW1Ee87t42rfp/gtdPTEREtAwfBfBkEx3IAACRHf7M8+C5DV494WjrEzAZYd0+8oxMwX/Ry6r/4pTMlSbO8FMAPNfEExMRES2DbFf7dQCbvO5EBgCI7HA1z4PnGr16wpGGozARZXYyeeaTum2lZ56V3YI6x/PCf00APq5ZAERERH5zrC7X6/Sy3QwAENlBUnUneS6CZ7T1LGxtWBP2biBvSLr/jwBc6uUewxfk9+HozPcQ9fYtLAbg0wCO8fJJiYiIquw5AF4JIOlVxzIAQGQHqQFwN89F8LSO3opNU3vD3g3kjXsAvNnLvq6Hi868pysNiv6Ge/4TEVEASDbbvwC40KtDYQCAyA6Duh0gBVDX2INoc7I8tVRLewB8SN9LPPOczM1Ym73c6xO7DsBbvFzGQ0QF0/peQ0TVdTSATwDwJGWUi1KJ7CAfqndoJgDXswZM4+T9SLnn6XblRFUn0aXLdUshx8vu7cn+1uuzKdctzwYgf1ARr5+cKOR+rIHGOgANAE7WHXU2AmjR3ThadBCzOuydRVSh0wD8XHcGmKpl5zEAQGSPewHsYgAgmJ7w6Nfwq2PfGvZuoNq4X4vhebYIvws5PG/6JyZOpww0/h9n/4k8l9XB//aSJ75tkUa0aZCgFcBxGjg4R7+eWFhFdHAsEtW6HlG9xTXAx3EKhc0ZAD6vSwIytTp2/mER2WMLgLsAbObMVjCdON2HLfU9Ye8Gqq5+AP8GoNfLfn1S5m40OPd7fSolheZtLPxHZMTPAOys8Iklq/GGBf4/opkCrfpVAgbNAI7S4MBGHau06Nd2fR9o1v9P6WOJgkL+Jp6vNX2+BmCmFsfFAACRPSS6/jsAL/GyEmiIrdXKq+W6WzM0lmx9/9XYsu7vw97vVD1pAB8A8Ccv+3SzM4b2/EMmTqPs9/8KE09MFHJDAP6vBkuMZOeSvXp7YJ77xDUwkNSt0pI66G/QIEC7ZgSt0v9bq183ljymI+wnkHxFXq/vALBbA29VxwAAkV1+oR+0K3leau7JmmpVrrfqBRCRLb4F4DKv29LiTqHBme9avWZkTfHHmPpPZMTNmu7vGnjyHIAB/fe+ee4T08F+RJcXFL9GNWMgrtdV6zRgsFF//gT9eqxmFRDZQl6rn9XA2IPVbhMDAER2kaIfXwbwYZ6XmkvprVyV3JeoluQi/E59r/B08/0TnQk8fuZLXp/chK6HXO/1ExNR4brkDwsMvm2Q12LKWKB4WjlpS1KJvUezCNbo9mybNdtgswYa4iWBhegcPyOqFvnMuxbA4/Xvr2oBOAYAiOzzv7rOlSlrtTVU4XZGw348SAqkUQBf0OJ/nnrK9Ce8fkqZyTufS6OIjJH6RL8MSfdv19tN8/x/XGsVNOoMbaMuMejWIMF6fZ9q0cBApz6mWf8/qRkIROWS19alAN4OYGu1ggAMABDZR1Ldvq1/7FQ711aYabGs9f9EVfQNAD/SWS/PPCd7n4lzKGt9XwdgA19AREbI0rdH2fUFuZJrgS3z3KdYoyCuAYCEBgQaNJOwQ79u0Puu0loGa/U+3ZwAohISBP9r3YHjLQD6qtE5DAAQ2el7AP6Z1W1ralDTqD1zx5rnBbMnyUu3aeG/mu4RPNuzsg9gfeYXJk70RQD+TtNrichbUpzvK+zzimR0dxYssDtLtKRmQaLk++IWiMUdD07QAojHaE2DkzVYcJp+pXCQ18jf6jKXqhTCZQCAyE6PAPg5gJdzS8BgyCW6cSBWF/ZuoOWRi8kXAJjwsh/bkEeDO4ZIbXYjWojMmn2Rqf9ERkiG0btK1tZT9Tgl27vN1787FpmkiGidgqO0VsEpmkFwtC5NOEV/ntDlCLGSfydmBR/IfgkdE8j5ehOAseW0mAEAIjsN69Yfz9CCNORzdxz1fJ5CWg5ZGnSxzsh5JgEXf525Eyuzv/H65NVpBWTuiEJkxl8A/IR9by1X6xgVaxnNtx3sKs0mbdb6BU36s4R+bdRsgzoNILSUbJ+YKFnOQHb4Bw0efXA51wM8oUT2ugbALbpXPbMAfGyo/TyMRzmJSUuWBfBjDQp6uu7/helr0JW70sSZk/e9F5p4YiIqzC5+QdPZyd96F1iKUNSmdQkaNFCQ0DoExfoFca1ZUK81Cjr13xv0cRt5neqZmAYBJAD0bl3OWjEGAIjsNaIfwM9gCqx/jbWcgTs7TsdUJBb2rqClkz2AP67V/z1laPC/RmugcF9uIjP+DOAqQ/v+k/dGynjGYs2CuA5CIyU/S+rtWM0YOEqLGnZpkEAe80Se16pp1FoAEqR5FYDxSn8xAwBEdvuTVvt+Gc+T/7iRONKJ1moO/ht0cEThMapV8D3dheIoN4OnzfzcRCfLdcmLtPgfZ5SIvCdLEC+vVrVxCoxiNkh6gQPavsjBSrbA8Xots1K3UuwqqVtwnAYSUiW1CooBh5R+JqT42VCQ1JpA63Sb3J2VZAgyAEBkv3dr5PQYnit/ySU6cXP75mq2Oabr9Cgc5EL83xbYk7pmzshtQaNzr4lOlhmk1+qFHxF5T95vrmC/Uw1I8KCcD5bSLRHbNTiwRj8XjtLBb5suQyh+Tem/Y1rbICzO1J3DPqBZO9lyjpsBACL77dH03y9xKYC/7Oy+MOxdQEsn+01/FcB3ve7Dzc4YunNGBv/ifQBOMvXkRISPlWxjR2TCbn3OB+d57ojWJkjp1zq9Pm7WAMAKvd8qDSC0lAQO1uvjVgdkmZn0xVm6ZPi/9bphUQwAEPnDLwE8FcCLeb78Y0s9N3CgJZNI/pcXSbesujhcXDBzKWLukIkz9498jyMy6vMAbuQpIMu5JTVxDizQ1FhJvYL4rK8x3VJvtdYp6NAMNMky2KzBgeN1iYLtorp8QnbOOQ/A2xcrDsgAAJE/HNCZwPO4Btwfbtvw2rB3AS3dDp2F2+11H57ojJsa/K/WFEZelxCZsVffdxz2PwVEvmRd/HzBdLm+vmuRw63XoIB4fMlShB7dVvHEkvoEMf0cS5Z8jerXWleDrteaYacAeC+AawFMzHVHftAS+YcUBPwGgPfomwlZarLxJMxE+fZKSyKj7/cDuNrr7ntSfi9Om/mKibPWoDMWG0w8OREVBgkfZ+o/0ZymAfxF/+Mv89wnrksO6nQnhBWaRdCjAYMeHaC36M9TujwhrrULGvTWvsxTIIGI0wF8U7cPlkLit+oxHNZYIvIH+eP9HIBzdDkAWWqw+XgMc99/qpzMUHwUwPdN9N3G7O0mnlYuVs7XPf/5R0Nkxg0AflFJFXEiOkyuzKy9Bi1qmNBAQLQkIFBXUsdglQYSmkqC40drEKFZq/8vRAIQb9KtxOXv+2cAfgdgBgwAEPnOoO79eadGE4koOH4I4BK9kPDUs7IPoDl/t4mOlIubV2thJiLy3oBmF+5h3xPV3JTeFlOsURApWTpQHLdHS352qgYEOrQOQELrFpyg/79BlwW8UP/WZYvP6xgAIPKfXgBv0EqfK3j+lqzep+2m4JE1t9cD+GRJYSPPPDW3HUdnjCQdiKex8B+RUdfo7L/L00BkjXyZGTmVLBds1HoFWa4jJvKnKwF8TZab8/wt2SaftpuC5xEAHwRwv4kj25T+pqkOlYrLnzb15ESEfQDe7fVuI0RkhIwZbgNwNwMARP40DuCLAH7D80fka1Na2PNaEwfx0vQfTfVdSusdsPAfkRmyFvhdALax/4nChQEAIv/qA/BGieTxHBL51r8A+KmJ4lsvm/kdOnJG4g7iWQCeYurJiahQIfxydgNR+DAAQORvsmXYBQAe4N69RL4iKbef0Itwz/92N7ozSLrjpvprI4A3V2G7IyKqnKvLjT5XZjEyIgoYBgCI/E+u4l+je5MyCEBkP5nt/y2Ar5i4AD/Gncb56avQ6NxjoqOkQvHzAZxt4smJqLDnv+w2ci+7giicGAAgCgYZ/L8DwH08n0TWu0PX/e8w0dAnzfwWbfmbTPXRMbo3cYOpBhCF3BUALgOQCXtHEIUVAwBEwSAzinJF/xIT24gRUdkkY+dvAGwx1WVNzl0mz5ZsdXi0yQYQhdiYbiM8xBcBUXgxAEAUHK4OKp4AQHJ7szy3RNaQv8+HdPA/aKJRpzjjePPkf5rqD7neeAWA55hqAFHIDQP4R/1KRCHGAABR8Mgg45W6xphBACI77Nb9tm8x0ZoznSE8Mf1TRMxl/Z4A4N9MPTlRyE0D+DwAY/t+EpE9GAAgCibJ8X0ngO/w/BIZJ0W3PgzgdwByJhqzMr8fdc4jpvqhCcDrARxvqgFEISbFgX8P4Gtc909EYACAKLAk3fhh3R3gIzzNREbJ3+GlprbcOsMZwsbMD0we/5kAXqg7ABCRt/YAeBeAfex3IgIDAESBJ4GA9wF4FYBtWiyQiLzRp8txfmiqv89yBnHu9Gf1rcCIFt3zfw1fc0Se69fsm4fY9URUxAAAUfDJlf93dRbytzzfRJ7YC+C9Jgf/f53bibOnv2z6bL8YwHNNN4IohEZ0u9Hf8eQTUak4e4MoFGTd8bUAZBHwNXpR0M5T7ztxnVElu01p5o3k3c+Yauma3BaTRf/EJgAfZeo/keekAPBnNfhPRHQYZgAQhYvMSn4GwNMA3GYyL5iWpA7ACnad1eRv6p8BfFMrb3suAuBZ2S1oy99gsp+kGf8FoNvqs0UUPI4GH79g6j2IiOzGAABR+Lg6+H+eBgN2sDYA0bLJ39VWAC8wmfYvnpbbhqMz3zPZhBiAl8kqBJONIAqpPwN4B/f7J6L5MABAFF77dKtAKRD4vwAO8LVAtCQy4ybT7f8C4Fcmu/C52XtxfPoy02fxaM2CaDPdEKKQkTo/b9Lif0REc2IAgIiuBnAxgBcB+E7oe4OocvJ383Ktr2Fkn3/x/MwdWJe53PTpkzoVfwfgXF0GQETe+CWAtwB4kP1NRAthAICIxLgWCZRBzIkAfq9FhFgjgGhujm7z9zLd6u9R/ZkRKbhodPoRMRd/KFqr6cdJ0w0hCglX0/7fDmA7TzoRLYa7ABDRbFu1PsBTAfwjgNMAbARQz54yTkZ3g/qV79/VJ0GvyZKBvATJm3VNe1EawE4AVwL4KoB7TTd6hZvDk7O3oj1/vemmNGrhMRb+I/JGcYeff+Xgn4jKxQtIIpqLDHJ+DeAPAE4CcDaAVp3dS8kOYwAaAKzW79ezFz0hRZ2+pLsBPI9ZXBUb1tt2fY3v1wvo4oXzjAZYikUx4zqYla0XV2lFbbnvrQBu14CBcRdmbsKK3B9saMpLZQMCC9pBFAby/nMJgE9qMV8iorIwAEBEC5FNxO/SG3SGL6aD/7hmBcj3TQB6NCCwTv+9AUCH7gXeGKZeXjV0E3rre3AgVlftXy2D1RsBPALgNwA+DqCr2k8SAL06UH8YwP0AxnTAntbX9LjO8k/r1/FFDrn4Ws9pkMCapTGvmPkVWvJ/saAleDyAt1rQDqIwkPe0/wHwOQBDPONEVAkGAIioEpN637EKHycBguN1FvU0DQwcp0sLNupMdqQk1TpacvOdRKYPdU4WqH4AADr4lJnrSwH8HMAHdea1NeAZAU7JLa//7tdBvqTA7gFwB4CHarD3da6MIIHnWuGg0dlmQ1MkC+gVAE6woC1EQSdZTP8B4Fsa0CQiqggDAETkhQkdnEFnrktFNWOgSwsQFpcYdOt2YkndTqxBZ2HrNCW72eb3sNN2fgO7jq35hOigVn2+VAs4ngXgGO07P76/O/pamQIwov8e168P6yD/UZ3d3x3mma8T3Emcm/49Yq7xrb4lcPdXsgnBrFoJRFRdEti8G8D7AfyRfUtES8UAABGZ5mjKdu88BdUkALBCZ7ibdTnBiVrx+Gibz94TRrbgL20nevFUxWUakmFxBoCTAZwKYDOAYy0s4Diis/cygD8AYK/+bJ/+bEwr7A/pbNcQd6R4zAZ3Buekr0RT/k4bmpPSv8W1FrSFKKh6tejot7QIKRHRkjEAQES2y+jM756Sdk6a3G+9XB1jdwPeBACKerV44+80S6JVl1tIavaTtC7DBl12Uctt2mRQv0tnrHbojP5tAEZLvp/Rc5vW+2X1Z7SIp878CHV2pP6LNwC4yIJ2EAWVbPF3sc7+V3t5ExGFEAMARORH8Sqsd19T6+OWWgAXDNyC67rOrvVTzZbTWfMhTZmXAnjfm3WfdXpr1XoMKf15nWZYNMzxO2+Z9TMZyG/TFH35/3v0Z1Qjq9ysTYN/ycD5rAXtIAqatC57eq/WeiEiqhoGAIjIj+qrMIPd48VxJ7Nj6MlPoy9mWxZ+YYZ+lwXtoAr87fT/2tRdLwZw3SL3kRoBnRX8zogGn2YHoBYS1eVBicqaT2SVvGa6bQXwU72xwj8RVR0DAETkR926s4D1GiYfQM/MJvQ1cok0Bc43AHxnkYOKam2KckV0MN9cwWOiutQlVcZ9S3VUGJwo6tTHViq6zLolxy3jsWSvrVr/5nZdKnWXFnglIqoJBgCIiGpszcC16K17IfpjlY5PiKx2oMzG7bb0IBJLzCRKLDHbILLMgpyNy3gstP5H9zJ/h1hfgwyqmC49si5Vqgr2aH2WIle/fwTAgzrLP67FT62vbUNE/scAABH5UY8WufOFeHYAjfkZBgCI7JLVW1g8wNcfEREtt4gWEZEJKb8FMDfv+pYFrSAiIiKiMGMAgIj8Jl5hgTBrnD18H19sRERERGQMAwBE5Dd1VVrH6rn28fv5YiMiIiIiYxgAICK/iWrBKN9JZPbj/IFb+YIjIiIiIiMYACAiv4n7ZQvAuaSyw1iVm7KvYUREREQUeAwAEJHfyDZRK/x61homt6ArzS2eiYiIiMh7DAAQEXlsbf9V6Myn2e1ERERE5CkGAIjIb2QHgNV+Pmux3Aha89MWtISIiIiIwoQBACLyGykAmPL7WTt517ctaAURERERhQkDAETkNwkAjUE4a08cuseCVhARERFRWDAAQER+UwegOwhnrWXyIQtaQURERERhwQAAEflNLCjvXcn0Xpw3eLsFLSEiIiKiMGAAgIj8xtcFAGerywxgdW7KrkYRERERUSAxAEBEfrMiSGesYXIrOtLDFrSEiIiIiIKOAQAiIsPWH7gCHU6Gp4GIiIiIaooBACLym01BO2PR/CQ6shMWtISIiIiIgowBACLym0BsATjbibu/Y1eDiIiIiChwGAAgIr9pC+oZO3foTgtaQURERERBxQAAEfnNhqCesabJRy1oBREREREFFQMAROQ38Sq2t8mmY0+ld+NJB25Ai5OzoDVEREREFDQMABCR36ypYnsfb9uxt47dhrUzByxoCREREREFDQMAROQ33UE/Y6uH70CTyywAIiIiIqouBgCIiCxTN/0I4q7L00JEREREVcUAABH5yZPCcrYu2P5lC1pBREREREHCAAARkaVOm9jFU0NEREREVcMAABH5yYowna2ekTssaAURERERBQUDAETkJ8eH6WylZnbhiUP3WNASIiIiIgoCBgCIyE/i4TpbLpK5cbQ5WQvaQkRERER+xwAAEfnJxrCdrZax27B65v+3dye/VVZxGIBf2tsylBItyFQkUBwwYHDAGBYYY3Ttxj9NFy5NXKmJRhIcEkncSdSA0RCJoSJgbQMUocy0XNN4E5mncuWcfs+T3EW7es/3S25y33znnJMFJAEAoHYKAKAma5o4rXWTe7OkPVNAEgAAaqYAACjcwouH09tuGxMAAHOiAABqsrOp03p99L0CUgAAUDMFAEAlXpg6bFQAADwwBQBQi7VJFjR5Wk+c+bmAFAAA1EoBANRiedO/sxZdGM2OyZ8KSAIAQI0UAEAt+k0q6Z+eytDVywUkAQCgNgoAoBbrmr4FYNayMz/m+RPfp799tYA0AADURAEA1GJAAfCvZWd+SF9cCwgAwP1RAAC18OP/Gm8cetdbAAAA3BcFAFCLLUl6Tes/r419UUoUAAAqoAAAqFTflVPZfGHC+AAAuCcKAKAWw7YBXK81fTIbJ77OpkunSooFAEChFABALYYUADdrTU9m4czF0mIBAFAgBQBQg5b9/7e3aeyjbDk/Vmo8AAAKoQAAarA8yVKTur2RsY9LjQYAQCEUAEAN+jtvAXAHO4/v9XgAALgtBQBQg8WdEoA7eOz0d9kxuT997bbHBADATRQAQA1WJBk0qbtbMfltNl46WXpMAAAeAQUAwDyz9vSB9MRbAAAAXE8BANRgyCGA925wal/eOvppLXEBAPifKACAGgwkWWhS967/0tG8ObY7A+2ZWiIDANBlCgCgBn1Jek3q/iw+/1u2nv61psgAAHSRAgCoQbe2AByb79Nfdm40w9PnCkgCAMCjpgAAajB7BWCrCzkPz/fpL7owmiXTFwtIAgDAo6YAAErX6pwB0A1XmzD9zcc+zMoZJQAAQNMpAIDSLU6y2pTm5tXf388zF4/XvAQAAOZIAQDQEJvGv8pzF8aNGwCgoRQAQOlmX/9fb0pz15o+mZHx3Rm5/HftSwEA4AEoAIDS9XSuAeQh6JmZypYjH3iUAAANpAAAStfTuQWAh2jb2SMeJwBAwygAgNItSrLSlB6u9eOfZfvpg/NpSQAA3IUCAChdrzcAuqGd1Sf25KWp0fm3NAAAbkkBAJSulWSwCxmPNn3yC9qXMzyxK1vP/VlAGgAAuk0BAJRucZe2ALgUv2PjX59k29k/isgCAED3KAAAyPqJz/OKMwEAAOa1lvEChduf5KkkTyd5Ocm6JNuTbE6y1PAekvbVrDrxTV7s6cu+wZF5sSQAAK6nAABKN53kUOfz5Q1Zn00yPHur3TUlwZNJFiZZkqSvs4Wgv3OY4LUafwbAjRa0r2TdxK5c6XknvwwMlxUOAIA5UwAANTvY+ey5Zg2zP/7XzG5tTzKUZEOSVZ3/zf69OsnjSQ6Y/K3NngnQWvV29g9uKDEeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI0HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI0HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI0HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI0HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALVJ8g9q4feXH4GteQAAAABJRU5ErkJggg==',
              fit: [100, 100]
              },
          [
            { text: 'Quotations', style: 'header' },
            { text: new Date().toTimeString(), alignment: 'right' },
         
          ]
          ]
          },
        { text: 'From', style: 'subheader' },
        this.quotes.fullName,
        this.quotes.address,
        
        { text: 'To', style: 'subheader' },
        this.quotes.ownerName,
        this.quotes.ownerAddress,
        { text: 'Expiry', style: 'subheader' },
        { text: this.quotes.expiry },

        { text: 'Items', style: 'subheader' },
        {
          style: 'itemsTable',
          table: {
            widths: ['*', 75, 75],
            body: [
              [
                { text: 'Description', style: 'itemsTableHeader' },
                { text: 'Quantity', style: 'itemsTableHeader' },
                { text: 'Price', style: 'itemsTableHeader' },
              ]
            ].concat(items)
             
          }
        },
        {
          style: 'totalsTable',
          table: {
            widths: ['*', 105, 105],
            body: [
              [
                '',
                'Subtotal(of extras)',
                'R' + this.quotes.subtotal.toFixed(2),
              ],
              [
                '',
                'Discount(extras)',
                'R' + this.quotes.discountPrice.toFixed(2),
              ],
              
              [
                '',
                'Total(incl. extras)',
                'R' + this.quotes.total.toFixed(2),
              ]
            ]
          },
          layout: 'noBorders'
        },
      ],
      styles: {

       columns:{
        color:'red',
        border:'blue',

       },
        
        header: {
          fontSize: 25,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'right'
        },
        subheader: {
          fontSize: 20,
          bold: true,
          margin: [0, 20, 0, 5]
        },
        itemsTableHeader:{
          bold: true,
          fontSize: 17,
          color: 'black'
        },
        itemsTable: {
          margin: [0, 5, 0, 15]
      },

        story: {
          bold: true,
          fontSize: 15,
          color: 'black'
        },
        totalsTable: {
          bold: true,
          margin: [0, 30, 0, 0]
        }
      },
      pageSize: 'A4',
      pageOrientation: 'portrait'
    };
this.pdfObj = pdfMake.createPdf(docDefinition);
    console.log(this.pdfObj);
    this.quotes.pdfLink = 
    this.downloadUrl();
    this.downloadPdf();
   /*   firebase.storage().ref().child('Quotations').put(this.pdfObj).then((results)=>{
        console.log(results);
     }) */


  }
  // selectFile() {

  //   let  pdfObj
  //   FileChooser.open().then((uri) => {
  //     Toast.show(uri, '5000', 'top').subscribe(
  //       toast => { })
  //     FilePath.resolveNativePath(uri).then((fileentry) => {
  //       Toast.show(fileentry, '5000', 'center').subscribe(
  //         toast => { });
  //       this.makeFileIntoBlob(fileentry).then((fileblob) => {
  //         this.events.addtextbookfile(fileblob, this.navParams.get('rtextbookid'), this.textbookname, "application/pdf")

  //       })
  //     })
  //   })
  //   }
  // makeFileIntoBlob(_imagePath) {
  //   // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
  //     return new Promise((resolve, reject) => {
  //       window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

  //         fileEntry.file((resFile) => {

  //       var reader = new FileReader();
  //       reader.onloadend = (evt: any) => {
  //         var imgBlob: any = new Blob([evt.target.result], { type: 'application/pdf' });
  //         imgBlob.name = 'sample.pdf';
  //         resolve(imgBlob);
  //       };

  //       reader.onerror = (e) => {
  //         console.log('Failed file read: ' + e.toString());
  //         reject(e);
  //       };

  //   reader.readAsArrayBuffer(resFile);
  //   });
  //   });
  //   });
  //   }
  // addtextbookfile(pdfblob, textbookid, filename,mimetype):any{
  //   return  this.TextbookResoursesRef.child(filename+".pdf")
  //            .put(pdfblob,{contentType: mimetype}).then((savedfile) => {
  //               this.textbookslist.child(textbookid).child("files").push({
  //                 file: savedfile.downloadURL,
  //                 name: filename,
  //                 time:  Math.floor(new Date().getTime()/1000)
  //            });
  //        })
  //      }
  downloadUrl() {
    this.loader.create({
      duration: 2000,
      content: 'Loading'
    }).present();
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        let date = Date();
        let user = firebase.auth().currentUser.email;
        // Save the PDF to the data Directory of our App
        firebase.storage().ref('Quotations/').child(this.userMsg+'.pdf').put(blob).then((results) => {
          console.log(results);
          // results.downloadURL
          
          
        
         
          
          firebase.storage().ref('Quotations/').child(results.metadata.name).getDownloadURL().then((url) => {
            console.log(url);
            this.pdfDoc = url;
            this.quotes.pdfLink = url;
             this.loader.create({
            duration: 2000,
            content: 'Loading'
          }).present();
          this.db.doc(this.userMsg).set(this.quotes);
          this.navCtrl.setRoot(SuccessPage);
          
          })
          console.log('pdf',this.pdfDoc);
          console.log(this.quotes.pdfLink);
        })
        this.file.writeFile(this.file.dataDirectory, 'quotation.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'quotation.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
      /* this.pdfObj.upload(); */
    }
  }
  downloadPdf() {
    
  }
}
