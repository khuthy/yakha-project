import { PlacesProvider } from './../../providers/places/places';
import { PlacePage } from './../place/place';
import { NewPlacesPage } from './../new-places/new-places';
import { AddBricklayerPage } from './../add-bricklayer/add-bricklayer';
import { BuilderProfileviewPage } from './../builder-profileview/builder-profileview';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
/* import { Geolocation } from '@ionic-native/geolocation'; */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  lat: number = -26.2609906;
  lng: number = 27.949579399999998;
  places;

  constructor(public navCtrl: NavController,
    private modalCtrl : ModalController,
 ) {

  }
  ionViewWillEnter() {
  // this.places = this.placeProvider.getPlaces();
   // console.log(this.places);

  }
 
//viewmore
next(){
  this.modalCtrl.create(AddBricklayerPage).present();
}
// onLocateUser(){
//   this.geolocation.getCurrentPosition()
//   .then(
//     (location) => {
//       console.log('Latitude: ' + location.coords.latitude, 'Longitude: '+ location.coords.longitude);
//       this.location.lat = location.coords.latitude;
//       this.location.lng = location.coords.longitude;

//     }
//   )
// }

}
