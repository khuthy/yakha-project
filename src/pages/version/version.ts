import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VersionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-version',
  templateUrl: 'version.html',
})
export class VersionPage {
  tsProperty = '';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad VersionPage');
  }

  activate(cmd) {
    switch (cmd) {
      case 'about':
        if (this.tsProperty == 'about'){
          this.tsProperty = ""
        }else{
          this.tsProperty = 'about';
        }
        break;
        case 'terms':
   if (this.tsProperty =='terms'){
    this.tsProperty =""
   }else{
    this.tsProperty = 'terms';
   }
          break;
          case 'contact':
            if (this.tsProperty =='contact'){
              this.tsProperty =''
            }else{
              this.tsProperty = 'contact';
            }
        break;
        case 'disclaimer':
          if (this.tsProperty == 'disclaimer'){
            this.tsProperty =''
          }else{
            this.tsProperty = 'disclaimer';
          }
        break;
        case 'safety':
          if (this.tsProperty =='safety'){
            this.tsProperty =''
          }else{
            this.tsProperty = 'safety';
          }
        break;
      default:
        break;
    }
   }

}
