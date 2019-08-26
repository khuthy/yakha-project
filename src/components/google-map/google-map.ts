
import { Component, ViewChild } from '@angular/core';
import { google } from "google-maps";

declare var google;
@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapComponent {

  @ViewChild("map") mapElement;
  map: any;
  infoWindow;
  constructor() {

  }

ngOnInit(){
  this.initMap(); 
 console.log('wffergfefe');
}
  initMap(){

    navigator.geolocation.getCurrentPosition((position)=> {
      let geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };


      // var circle = new google.maps.Circle(
      //     {center: geolocation, radius: position.coords.accuracy});

    let coords = new google.maps.LatLng(geolocation.lat, geolocation.lng)
    //let coords1 = new google.maps.LatLng(-27, 26)
    let mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


     let marker: google.maps.Marker = this.infoWindow = new google.maps.Marker({
      map: this.map,
      position: coords,
      title: 'Click to view details'

    })
    let infoWindow = new google.maps.InfoWindow({
      content: "wdfuwej sdkljerf ekjrg ekljg klgrj rgljr</b>"
    });
    google.maps.event.addListener(marker, 'click', (resp)=>{
      infoWindow.open(this.map, marker)
    }) 

    /* console.log(marker); */



    // let marker1: google.maps.Marker = new google.maps.Marker({
    //   map: this.map,
    //   position: coords1,
    // })
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
