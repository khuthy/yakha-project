import { PlacesProvider } from './../../providers/places/places';
import { PlacePage } from './../place/place';
import { NewPlacesPage } from './../new-places/new-places';
import { AddBricklayerPage } from './../add-bricklayer/add-bricklayer';
import { BuilderProfileviewPage } from './../builder-profileview/builder-profileview';
import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private modalCtrl : ModalController, public loader : LoadingController
 ) {
 
  }

  ionViewDidLoad() {
  // this.places = this.placeProvider.getPlaces();
   // console.log(this.places);
    this.loader.create({
      content:"Loading..",
      duration: 2000
    }).present();
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
// addLocation(){
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position)=> {

//       let pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       };
//       firebase.firestore().collection('location').add({
//         lat: pos.lat,
//         lng : pos.lng
//       })
//     } , (error)=> {
//       console.log(error.code + 'Message:' + error.message);
//     });
//   }
// }


// createMarker(place) {
//   var marker = new google.maps.Marker({
//     map: this.map,
//     position: place.geometry.location
//   });

//   google.maps.event.addListener(marker, 'click', (res)=> {
//     res.setContent(place.name);
//     res.open(this.map);
//   });
// }

}
