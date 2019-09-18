import { Component, ViewChild, ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
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
    price: 0,
    uid: '',
    meter: 0,
    discount: 0,
    discountAmount: 0,
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
    private cdRef : ChangeDetectorRef
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
  input= [];
  onChange(event) {
    if(event.value != 0) {
      this.input.push({input: parseFloat(event.value)});
      console.log(this.input);
    }else {
      this.input.push({input: 0})
    }
    
    
  }

  childPlus(i, index) {
     /* console.log(this.extras.length); */
     
     this.extras[index].data.quantity++;
     if(this.extras[index].data.quantity != 0 && this.extras[index].data.price != 0) {
      this.value = this.value + (parseFloat(i.data.price) * parseFloat(i.data.quantity));
     }else {
       this.value = 0;
     }
       
     
  }
  childMinus(i, index) {

    console.log(i)
    this.extras[index].data.quantity--;
    if(this.extras[index].data.quantity <= 0) {
       this.extras[index].data.quantity = 0;
      if(this.extras[index].data.quantity != 0 && this.extras[index].data.price != 0) {
        this.value = this.value + (parseFloat(i.data.price) * parseFloat(i.data.quantity));
       }else {
         this.value = 0;
       }

    }
    
  }
  test(){
    console.log(this.extras[4]);
    
  }
  createPdf() {
    /* calculations */
    for (let index = 0; index < this.extras.length; index++) {
      console.log(this.extras[index].data.price * this.extras[index].quantity);
      
    this.quotes.subtotal += (parseFloat(this.extras[index].data.price.toString()) * parseFloat(this.extras[index].quantity.toString()));
    
    
    }
    this.quotes.discountAmount = this.quotes.subtotal * (this.quotes.discount/100);
    console.log(this.extras);
    
    var items = this.extras.map((item) => {
      console.log(item);
      
      return [item.item, item.data.quantity, item.data.price];
     

  });
  
     

    var docDefinition = {
      content: [
        { text: 'Quotations', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },


        { text: 'From', style: 'subheader' },
        this.quotes.fullName,
        this.quotes.address,
        { text: 'To', style: 'subheader' },
        this.quotes.fullName,
        this.quotes.address,
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
                'Subtotal(excl. extras)',
                'R' + this.quotes.subtotal + '.00',
              ],
              [
                '',
                'Discount(extras)',
                'R' + this.quotes.discountAmount + '.00',
              ],
              
              [
                '',
                'Total(incl. extras)',
                'R' + this.total + '.00',
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
        firebase.storage().ref('Quotations/').child(user + ' ' + date).put(blob).then((results) => {
          console.log(results);
          // results.downloadURL
          firebase.storage().ref('Quotations/').child(results.metadata.name).getDownloadURL().then((url) => {
            console.log(url);
            this.pdfDoc = url;

          })
          console.log(this.pdfDoc);

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
    this.loader.create({
      duration: 2000,
      content: 'Loading'
    }).present();
    firebase.firestore().collection('Response').add(this.quotes)
    this.navCtrl.setRoot(SuccessPage);
  }
}
