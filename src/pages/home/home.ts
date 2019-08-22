import { PlacesProvider } from './../../providers/places/places';
import { PlacePage } from './../place/place';
import { NewPlacesPage } from './../new-places/new-places';
import { AddBricklayerPage } from './../add-bricklayer/add-bricklayer';
import { BuilderProfileviewPage } from './../builder-profileview/builder-profileview';
import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import * as firebase from 'firebase';
declare var google;
/* import { Geolocation } from '@ionic-native/geolocation'; */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // lat: number = -26.2609906;
  // lng: number = 27.949579399999998;
  places;
  @ViewChild("map") mapElement;
  map: any;
  constructor(public navCtrl: NavController,
    private modalCtrl : ModalController,
 ) {
  this.initMap();
  }

  ionViewDidLoad() {
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
initMap(){

  navigator.geolocation.getCurrentPosition((position)=> {
    let geolocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    // let NEW_ZEALAND_BOUNDS = {
    //   north: 16.3449768409,
    //   south: -34.8191663551,
    //   west: 32.830120477,
    //   east: -22.0913127581,
    // };

    // var circle = new google.maps.Circle(
    //     {center: geolocation, radius: position.coords.accuracy});

  let coords = new google.maps.LatLng(geolocation.lat, geolocation.lng)
  //let coords1 = new google.maps.LatLng(-27, 26)
  let mapOptions: google.maps.MapOptions = {
    center: coords,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    // restriction: {
    //   latLngBounds: NEW_ZEALAND_BOUNDS,
    //   strictBounds: false,
    // },


  }
  const infowindow = new google.maps.InfoWindow();

  // let request = {
  //   query: 'Museum of Contemporary Art Australia',
  //   fields: ['name', 'geometry'],
  // };
  //e.maps.places.PlacesService
 // let service = new google.maps.places.PlacesService(map);

  // service.findPlaceFromQuery(request, (results, status) => {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     for (var i = 0; i < results.length; i++) {
  //       this.createMarker(results[i]);
  //     }

  //     map.setCenter(results[0].geometry.location);
  //   }
  // });

  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

  firebase.firestore().collection('location').get().then((resp)=>{
    resp.forEach((doc)=> {
      // doc.data() is never undefined for query doc snapshots
      console.log(/*doc.id, */ doc.data());
      let coord = new google.maps.LatLng(doc.data().lat, doc.data().lng);
      let marker: google.maps.Marker = new google.maps.Marker({
           map: this.map,
           position: coord,
           title: 'Click to view details',
         })
             //  let infoWindow = new google.maps.InfoWindow({
    //    content:    resp.data().username + "<br>" + "from: " + resp.data().place + "<br>Costs: " + resp.data().price
    //  });
    //  google.maps.event.addListener(marker, 'click', (resp)=>{
    //    infoWindow.open(this.map, marker)
    //  })

    // // console.log(marker);
    // } else {
    //   console.log("The firestore is empty");

    // }
  });
    // if(resp.exists){

    //   this.lat = resp.data().lat;
    //   this.lng = resp.data().lng;
    //   let coord = new google.maps.LatLng(this.lat, this.lng)
    //   let marker: google.maps.Marker = this.infoWindow = new google.maps.Marker({
    //    map: this.map,
    //    position: coord,
    //    title: 'Click to view details',
    //  })



    //  let infoWindow = new google.maps.InfoWindow({
    //    content:    resp.data().username + "<br>" + "from: " + resp.data().place + "<br>Costs: " + resp.data().price
    //  });
    //  google.maps.event.addListener(marker, 'click', (resp)=>{
    //    infoWindow.open(this.map, marker)
    //  })

    // // console.log(marker);
    // } else {
    //   console.log("The firestore is empty");

    // }
  // firebase.firestore().collection('location').doc('coords').get().then((resp)=>{
  //  if(resp.exists){

  //    this.lat = resp.data().lat;
  //    this.lng = resp.data().lng;
  //    let coord = new google.maps.LatLng(this.lat, this.lng)
  //    let marker: google.maps.Marker = this.infoWindow = new google.maps.Marker({
  //     map: this.map,
  //     position: coord,
  //     title: 'Click to view details',
  //   })



  //   let infoWindow = new google.maps.InfoWindow({
  //     content:    resp.data().username + "<br>" + "from: " + resp.data().place + "<br>Costs: " + resp.data().price
  //   });
  //   google.maps.event.addListener(marker, 'click', (resp)=>{
  //     infoWindow.open(this.map, marker)
  //   })

  //  // console.log(marker);
  //  } else {
  //    console.log("The firestore is empty");

  //  }
  })



 // let coordi = new google.maps.LatLng(this.lat, this.lng);





  // let marker1: google.maps.Marker = new google.maps.Marker({
  //   map: this.map,
  //   position: coords1,
  // })
});


}

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
