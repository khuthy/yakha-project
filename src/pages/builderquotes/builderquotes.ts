import { Component, ViewChild } from '@angular/core';
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
import { ThrowStmt } from '@angular/compiler';

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
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
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
    extras: [],

    price: 0,
    uid: '',
    meter: null,
    discount: null,
    discountAmount: null,
    ownerUID: null,
    hOwnerUID: null
  }
  pdfObj = null;
  db = firebase.firestore();
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
    'price': [
      { type: 'required', message: 'Price is required.' },
      { type: 'maxlength', message: 'Amount is too large' }
    ]
  }
  ownerAddress: any;
  count = 0;
  extras = [];
  total: number = 0;
  extrasValues: Quotations;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public forms: FormBuilder,
    private fileOpener: FileOpener,
    private file: File,
    private plt: Platform,
    private authUser: AuthServiceProvider,
    private loader: LoadingController
  ) {
    this.quotes.hOwnerUID = this.navParams.data;
    this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
    this.quotes.uid = this.uid;
    this.quotesForm = this.forms.group({
      fullName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])),
      expiry: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.compose([Validators.required])),
      dimension: new FormControl('', Validators.compose([Validators.required])),
      price: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(7)]))
    })
  }

  ionViewDidLoad() {


    // console.log(this.navParams.data);
    this.db.collection('HomeOwnerQuotation').doc(this.quotes.hOwnerUID).collection('extras').onSnapshot((res) => {

      res.docs.forEach(doc => {
        this.extras = [...this.extras, {name: doc.id,quantity: doc.data().quantity,price: doc.data().price,}]
      })
    })
    this.db.collection('HomeOwnerQuotation').doc(this.quotes.hOwnerUID).onSnapshot((res) => {
      this.quotes.ownerAddress = res.data().ownerAddress;
      let num = parseFloat((res.data().price) + this.quotes.dimension)
      this.total = num;
      //  this.quotes.price = num;
      this.quotes.ownerName = res.data().ownerName;
    })

    this.db.collection('builderProfile').where('uid', '==', firebase.auth().currentUser.uid).get().then((res) => {
      res.forEach((doc) => {
        this.quotes.address = doc.data().address;
        this.quotes.fullName = doc.data().fullName;


      })
    })
    this.db.collection('HomeOwnerProfile').where('uid', '==', this.quotes.hOwnerUID).get().then((res) => {
      res.forEach((doc) => {
        //this.quotes.ownerAddress = doc.data().ownerAddress;
        //console.log(doc.data());
        this.quotes.ownerName = doc.data().fullname;
        // this.quotes.price = Number(doc.data().price) * (this.length*this.width*this.height)*2 + (Number(doc.data().price) * (this.length*this.width*this.height)*2)*.15;
      })
    })

  }
  public handleAddressChange(addr: Address) {
    this.quotes.address = addr.formatted_address;
    //this.quotes.ownerAddress = addr.formatted_address;
    // console.log(this.location)

  }

  childPlus(i) {

  }
  childMinus(i) {
    console.log('excalate')
  }


  // getQuoteInfo(){

  // }
  createPdf() {

    console.log('this.dimension');
    

   /* var docDefinition = {
      content: [

        { text: 'Quotations', style: 'header' },
        { image: '../../assets/imgs/logo.png', alignment: 'left' },
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
            ].concat()
          }
        },


        // { text: 'Extras costs R ' + this.quotes.dimension, style: 'story', margin: [0, 20, 0, 20] },
        // { text: 'R'+ this.quotes.price+'.00', style: 'story', margin: [0, 20, 0, 20] },
        {
          style: 'totalsTable',
          table: {
            widths: ['*', 105, 105],
            body: [
              [
                '',
                'House cost(excl. extras)',
                'R' + this.quotes.price + '.00',
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
    // this.downloadPdf();
    //  firebase.storage().ref().child('Quotations').put(this.pdfObj).then((results)=>{
    //     console.log(results);
    //  })
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
      this.pdfObj.upload();
    }
  }
  downloadPdf() {
    this.loader.create({
      duration: 2000,
      content: 'Loading'
    }).present();
    firebase.firestore().collection('HomeOwnerQuotation').doc(this.navParams.data).update({
      doc: this.pdfDoc,
      response_date: Date(),
      createBy: firebase.auth().currentUser.email,
      // uid: firebase.auth().currentUser.ui
    })
    this.navCtrl.setRoot(SuccessPage);
  }
}
