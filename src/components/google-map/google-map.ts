
import { Component, ViewChild } from '@angular/core';
// import { google } from "google-maps";


@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapComponent {

  @ViewChild("map") mapElement;
  map: any;
  // google: google;

  constructor() {

  }

ngOnInit(){
  this.initMap();
 // console.log('wffergfefe');
}
  initMap(){
    navigator.geolocation.getCurrentPosition((position)=> {
      let geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(geolocation);

      // var circle = new google.maps.Circle(
      //     {center: geolocation, radius: position.coords.accuracy});

    let coords = new google.maps.LatLng(geolocation.lat, geolocation.lng)
    let mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)


    let marker: google.maps.Marker = new google.maps.Marker({
      map: this.map,
      position: coords
    })
  });
  }
  // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
  // let marker: google.maps.Marker = new google.maps.Marker({
  //   map: this.map,
  //   position: coords
  // })


  // geolocate() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //       let geolocation = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };
  //       var circle = new google.maps.Circle(
  //           {center: geolocation, radius: position.coords.accuracy});
  //     });
  //   }
  // }

}
