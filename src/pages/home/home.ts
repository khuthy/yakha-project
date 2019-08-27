import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, LoadingController, MenuController } from 'ionic-angular';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { BuilderProfileviewPage } from '../builder-profileview/builder-profileview';
import { WelcomePage } from '../welcome/welcome';
import { BricklayerlandingPage } from '../bricklayerlanding/bricklayerlanding';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild("map") mapElement: ElementRef;
  db = firebase.firestore();
  // changes if the content is empty
  info = false;
  builder = [];
  // lat: number = -26.2609906;
  // lng: number = 27.949579399999998;
  places;
 
  map: any;
//  marker: any;
 public lat: any;
public lng: any;
geoloc;

maps: boolean =false;
request: boolean = false;
  constructor(public navCtrl: NavController,
    private modalCtrl : ModalController, public loader : LoadingController,
    private geolocation: Geolocation,
    private menuCtrl: MenuController
 ) {

  /* home page loads start here */
  this.loader.create({
    content:"Loading..",
    duration: 1000
  }).present();
   let user = firebase.auth().currentUser;
   if(user){

    let userLoggedIn = this.db.doc(`/User/${user.uid}`);
    userLoggedIn.get().then(getuserLoggedIn => {
      if(getuserLoggedIn.data().userType == 'Homebuilder') {
        
  
        this.maps = false;
        this.request = true;
      }else {
        this.geolocation.getCurrentPosition().then((resp) => {
          let NEW_ZEALAND_BOUNDS = {
            north: -22.0913127581,
            south: -34.8191663551,
            west: 10.830120477,
            east: 32.830120477,
          };
          let coords = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          let mapOptions = {
            center : coords,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            restriction: {
              latLngBounds: NEW_ZEALAND_BOUNDS,
              strictBounds: false,
            },
            disableDefaultUI: true
          }
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          firebase.firestore().collection('builderProfile').get().then((resp)=>{
      
            resp.forEach((doc)=> {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.data().address.longitude);
              let lat = doc.id +"<br>Builder name: "+ doc.data().fullName+ "<br>Price: R" + doc.data().price;
              let coord = new google.maps.LatLng(doc.data().address.latitude, doc.data().address.longitude);
               let marker = new google.maps.Marker({
                   map: this.map,
                   position: coord,
                   title: 'Click to view details',
                 })
                      let infoWindow = new google.maps.InfoWindow({
                  content: lat
             });
             google.maps.event.addListener(marker, 'click', (resp)=>{
              infoWindow.open(this.map, marker)
              })
              google.maps.event.addListener( marker,'click', (resp) => {
                this.map.setZoom(15);
                this.map.setCenter(marker.getPosition());
              });
              let cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.6,
                map: this.map,
                center: coords,
                radius: 10000
              });
            })
           
            // });
            // // console.log(marker);
            // } else {
            //   console.log("The firestore is empty");
      
            // }
          });
      
         }).catch((error) => {
           console.log('Error getting location', error);
         });
        this.maps = true;
        this.request = false;
        this.db.collection('builderProfile').get().then(snapshot => {
          snapshot.forEach(doc => {
            this.builder.push(doc.data());
          });
          console.log('Builders: ', this.builder);
        
        });
      }
    })
   }else {
     this.navCtrl.setRoot(WelcomePage);
   }
   /* home page loads here */

  }

  ionViewDidLoad() {
   
    this.menuCtrl.swipeEnable(true);
  }

//viewmore
viewBuilderInfo(builder){
  this.navCtrl.push(BuilderProfileviewPage, builder);
}
// viewRoom(room){
//   // receive the room data from the html and navigate to the next page with it
//   this.navCtrl.push(OwnerViewHotelPage, {room});
// }


loadMap(){



  // let watch = this.geolocation.watchPosition();
  // watch.subscribe((data) => {
  //  // data can be a set of coordinates, or an error (if an error occurred).
  //  this.lat = data.coords.latitude;
  //  this.lng = data.coords.longitude;

  //  let coords = new google.maps.LatLng(21, -27);
  //  let mapOptions = {
  //   center : coords,
  //   zoom: 15,
  //   mapTypeId: google.maps.MapTypeId.ROADMAP
  // }
  // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  // });
}
initMap(){

  navigator.geolocation.getCurrentPosition((position)=> {
    let geolocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    let NEW_ZEALAND_BOUNDS = {
      north: -22.0913127581,
      south: -34.8191663551,
      west: 10.830120477,
      east: 32.830120477,
    };

    // var circle = new google.maps.Circle(
    //     {center: geolocation, radius: position.coords.accuracy});

  let coords = new google.maps.LatLng(geolocation.lat, geolocation.lng)
  //let coords1 = new google.maps.LatLng(-27, 26)
  let mapOptions: google.maps.MapOptions = {
    center: coords,
    zoom:11,
    mapTypeId: google.maps.MapTypeId.ROADMAP,

    restriction: {
      latLngBounds: NEW_ZEALAND_BOUNDS,
      strictBounds: false,
    },
    disableDefaultUI: true

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
  console.log(this.map);

  firebase.firestore().collection('location').get().then((resp)=>{

    resp.forEach((doc)=> {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id,  doc.data().lat);
      let lat = doc.id +"<br>Latitude: "+ doc.data().lat+ "<br>Longitude: " + doc.data().lng;
      let coord = new google.maps.LatLng(doc.data().lat, doc.data().lng);
       let marker = new google.maps.Marker({
           map: this.map,
           position: coord,
           title: 'Click to view details',
         })
              let infoWindow = new google.maps.InfoWindow({
          content: lat
     });
     google.maps.event.addListener(marker,'click', (resp)=>{
      marker.setAnimation(google.maps.Animation.BOUNCE);
      })
    google.maps.event.addListener(marker, 'click', (resp)=>{
      infoWindow.open(this.map, marker)
      })
      google.maps.event.addListener( marker,'click', (resp) => {
        this.map.setZoom(13);
        this.map.setCenter(marker.getPosition());
      });
      google.maps.event.addListener(marker ,'center_changed', (res) => {

        window.setTimeout((timeout) => {
          this.map.panTo(marker.getPosition());
        }, 3000);
      });
    })
    // });
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




 // let coordi = new google.maps.LatLng(this.lat, this.lng);





  // let marker1: google.maps.Marker = new google.maps.Marker({
  //   map: this.map,
  //   position: coords1,
  // })
});


}

// autoCompleteMap() {
//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: -33.8688, lng: 151.2195},
//     zoom: 13
//   });
//   var card = document.getElementById('pac-card');
//   var input = document.getElementById('pac-input');
//   var types = document.getElementById('type-selector');
//   var strictBounds = document.getElementById('strict-bounds-selector');

//   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

//   var autocomplete = new google.maps.places.Autocomplete(input);

//   // Bind the map's bounds (viewport) property to the autocomplete object,
//   // so that the autocomplete requests use the current map bounds for the
//   // bounds option in the request.
//   autocomplete.bindTo('bounds', map);

//   // Set the data fields to return when the user selects a place.
//   autocomplete.setFields(
//       ['address_components', 'geometry', 'icon', 'name']);

//   var infowindow = new google.maps.InfoWindow();
//   var infowindowContent = document.getElementById('infowindow-content');
//   infowindow.setContent(infowindowContent);
//   var marker = new google.maps.Marker({
//     map: map,
//     anchorPoint: new google.maps.Point(0, -29)
//   });

//   autocomplete.addListener('place_changed', function() {
//     infowindow.close();
//     marker.setVisible(false);
//     var place = autocomplete.getPlace();
//     if (!place.geometry) {
//       // User entered the name of a Place that was not suggested and
//       // pressed the Enter key, or the Place Details request failed.
//       window.alert("No details available for input: '" + place.name + "'");
//       return;
//     }

//     // If the place has a geometry, then present it on a map.
//     if (place.geometry.viewport) {
//       map.fitBounds(place.geometry.viewport);
//     } else {
//       map.setCenter(place.geometry.location);
//       map.setZoom(17);  // Why 17? Because it looks good.
//     }
//     marker.setPosition(place.geometry.location);
//     marker.setVisible(true);

//     var address = '';
//     if (place.address_components) {
//       address = [
//         (place.address_components[0] && place.address_components[0].short_name || ''),
//         (place.address_components[1] && place.address_components[1].short_name || ''),
//         (place.address_components[2] && place.address_components[2].short_name || '')
//       ].join(' ');
//     }

//     infowindowContent.children['place-icon'].src = place.icon;
//     infowindowContent.children['place-name'].textContent = place.name;
//     infowindowContent.children['place-address'].textContent = address;
//     infowindow.open(map, marker);
//   });

//   // Sets a listener on a radio button to change the filter type on Places
//   // Autocomplete.
//   function setupClickListener(id, types) {
//     var radioButton = document.getElementById(id);
//     radioButton.addEventListener('click', function() {
//       autocomplete.setTypes(types);
//     });
//   }

//   setupClickListener('changetype-all', []);
//   setupClickListener('changetype-address', ['address']);
//   setupClickListener('changetype-establishment', ['establishment']);
//   setupClickListener('changetype-geocode', ['geocode']);

//   document.getElementById('use-strict-bounds')
//       .addEventListener('click', function() {
//         console.log('Checkbox clicked! New state=' + this.checked);
//         autocomplete.setOptions({strictBounds: this.checked});
//       });
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


