import { Component, ViewChild, ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController } from 'ionic-angular';
import { SuccessPage } from '../success/success';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Quotations } from '../../app/quotation.model';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import * as firebase from 'firebase';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { style } from '@angular/animations';

 
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
  extrasValues: Quotations;
  date;
  maxDate;
  buid: string;
  userMsg: any;
  
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
     if(this.extras[index].data.price != 0 && this.extras[index].data.quantity != 0) {
      console.log('old',parseFloat(i.data.quantity),'new', this.extras[index].data.quantity);
      this.value = this.value + ((parseFloat(this.extras[index].data.price)) * (this.extras[index].data.quantity));
      
     }else { 
       this.extras[index].data.quantity = 0;
       console.log(parseFloat(i.data.quantity));
      
      this.value = this.value;
       this.toastCtrl.create({
         message: 'Please specify the price',
         showCloseButton: true,
         cssClass: 'toast'
       }).present();
     }
      
     
  }
  childMinus(i, index) {

    this.extras[index].data.quantity--; 
    if(this.extras[index].data.quantity < 0) {
      if(this.extras[index].data.price != 0) {
     this.value = this.value - (parseFloat(i.data.price) * parseFloat(i.data.quantity));
    }else {
      this.value = this.value;
      this.toastCtrl.create({
        message: 'Please specify the price',
        showCloseButton: true,
        cssClass: 'toast'
      })
    }
    }else {
      this.extras[index].data.quantity = 0;
      this.toastCtrl.create({
        message: 'Quantity cant be less than 0',
        showCloseButton: true,
        cssClass: 'toast'
      })
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
      content: [
        
        { text: 'Quotations', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },


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


       /*  { text: 'Extras costs R ' + this.quotes.dimension, style: 'story', margin: [0, 20, 0, 20] }, */
        /* { text: 'R'+ this.quotes.price +'.00', style: 'story', margin: [0, 20, 0, 20] }, */
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
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'right'
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 5]
        },
        story: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        totalsTable: {
          bold: true,
          margin: [0, 30, 0, 0]
        }
      },
      defaultStyle: {
      }
    }
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
