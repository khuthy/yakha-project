import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SuccessPage } from '../success/success';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import * as firebase from 'firebase';

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

  quotesForm: FormGroup;
  quotes = {
  expiry: '',
  address: '',
  dimension: '',
  price: ''
  }
  pdfObj = null;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  
  validation_messages = {
    'expiry': [
      { type: 'required', message: 'Expiry date is required.' }
    ],
    'address': [
      { type: 'required', message: 'Address is required.' }
    ],
  'dimension': [ {
      type: 'required', message: 'dimension type is required'
    }],
  'price': [ 
    {type: 'required', message: 'price is required.'},
     {type: 'maxlength', message: 'Too large'}
]
}
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public forms: FormBuilder,
    private fileOpener: FileOpener,
    private file: File,
    private plt: Platform
    ) {
      this.quotesForm = this.forms.group({
        expiry: new FormControl('', Validators.compose([Validators.required])),
        address: new FormControl('', Validators.compose([Validators.required])),
        dimension: new FormControl('', Validators.compose([Validators.required])),
        price: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(7)]))
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuilderquotesPage');
  }

  createQuotes() {
    console.log('navigations');
    
    this.navCtrl.setRoot(SuccessPage)
  }
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
        { text: this.quotes.price, style: 'story', margin: [0, 20, 0, 20] }, 
        

        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ',
          ]
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
  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'quotation.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'quotation.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

}
