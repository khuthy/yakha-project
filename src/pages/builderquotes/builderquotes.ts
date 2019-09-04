import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
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
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  formattedAddress='';
  options = {
    componentRestrictions: {
      country: ['ZA']
    }
  }
  quotesForm: FormGroup;
  quotes = {
  expiry: '',
  address: '',
  dimension: '',
  price: 0,
  uid: '',
  ownerUID: null,
  hOwnerUID: null
  }
  pdfObj = null;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  uid: any;
  validation_messages = {
    'expiry': [
      { type: 'required', message: 'Expiry date is required.' }
    ],
    'address': [
      { type: 'required', message: 'Address is required.' }
    ],
  'dimension': [ {
      type: 'required', message: 'Dimension is required'
    }],
  'price': [ 
    {type: 'required', message: 'Price is required.'},
     {type: 'maxlength', message: 'Amount is too large'}
]
}
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
     // this.quotes.hOwnerUID = this.navParams.data;
      this.uid = firebase.auth().currentUser.uid;
    this.authUser.setUser(this.uid);
    this.quotes.uid = this.uid;
      this.quotesForm = this.forms.group({
        expiry: new FormControl('', Validators.compose([Validators.required])),
        address: new FormControl('', Validators.compose([Validators.required])),
        dimension: new FormControl('', Validators.compose([Validators.required])),
        price: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(7)]))
      })
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.db.collection('HomeOwnerQuotation').doc(this.navParams.data).get().then((res)=>{
      this.quotes.dimension = res.data().length + 'x' + res.data().width + 'x' + res.data().height;
      this.length = res.data().length;
      this.height = res.data().height;
      this.width = res.data().width;
    })

    this.db.collection('builderProfile').where('uid','==', firebase.auth().currentUser.uid).get().then((res)=>{
        res.forEach((doc)=>{
          this.quotes.address = doc.data().address;
          this.quotes.price = Number(doc.data().price) * (this.length*this.width*this.height)*2 + (Number(doc.data().price) * (this.length*this.width*this.height)*2)*.15;
        })
    })
  }
  public handleAddressChange(addr: Address) {
    this.quotes.address = addr.formatted_address ;
   // console.log(this.location)
    
  }

  
  // getQuoteInfo(){
   
  // }
  createPdf() {
    var docDefinition = {
      content: [
        { text: 'Quotations', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },

        { text: 'Expiry', style: 'subheader' },
        { text: this.quotes.expiry },

        { text: 'Address', style: 'subheader' },
        this.quotes.address,

        { text: this.quotes.dimension, style: 'story', margin: [0, 20, 0, 20] },
        { text: 'R'+ this.quotes.price+'.00', style: 'story', margin: [0, 20, 0, 20] }, 
        

        {
         
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
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
         firebase.storage().ref('Quotations/').child(user+' '+date).put(blob).then((results)=>{
       console.log(results);
      // results.downloadURL
          firebase.storage().ref('Quotations/').child(results.metadata.name).getDownloadURL().then((url)=>{
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
  downloadPdf(){
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
