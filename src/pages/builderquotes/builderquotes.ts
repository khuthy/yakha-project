import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuccessPage } from '../success/success';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

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
    public forms: FormBuilder
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

}
