import { Component, ViewChild, ElementRef, style } from '@angular/core';
import { NavController, ModalController, LoadingController, MenuController, Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { BuilderProfileviewPage } from '../builder-profileview/builder-profileview';
import { WelcomePage } from '../welcome/welcome';
import { BricklayerlandingPage } from '../bricklayerlanding/bricklayerlanding';
import { MessagesPage } from '../messages/messages';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import { HomeOwnerProfilePage } from '../home-owner-profile/home-owner-profile';
import { CallNumber } from '@ionic-native/call-number';
import { LoginPage } from '../login/login';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // brightness: number = 20;
  // contrast: number = 0;
  // warmth: number = 1300;
  // structure: any = { lower: 33, upper: 60 };
  // text: number = 0;
  @ViewChild("map") mapElement: ElementRef;
//  @ViewChild("filterSearch") filterSearch: ElementRef;
  sampleArr = [];
  resultArr = [];
  db = firebase.firestore();
  isSearchbarOpened = false;
  color: string = 'yakha';
  slidesPerView : number = 1;
  // changes if the content is empty
  items: any;
  info = false;
  builder = [];
  owner =[];
  // lat: number = -26.2609906;
  // lng: number = 27.949579399999998;
  places;
  requestFound: string = '';
  map: any;
//  marker: any;
 public lat: any;
public lng: any;
geoloc;
status: string = '';
maps: boolean =false;
request: boolean = false;
  ownerUID: string;
  ownerName ;
  ownerImage: any;
  bUID: string;
  price = 0;
  
  constructor(public navCtrl: NavController,
    private modalCtrl : ModalController, public loader : LoadingController,
    private geolocation: Geolocation,
    private menuCtrl: MenuController,
    private callNumber: CallNumber,
    public platform: Platform,
    
 ) {
   this.price = 0;
   console.log(this.price);
   
  this.menuCtrl.swipeEnable(true);
  if(this.isSearchbarOpened) {
    this.color = 'primary';
  }else {
    this.color = 'yakha';
  }
 //console.log(this.platform.width());
 

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

        if(getuserLoggedIn.data().status == true) {
          this.maps = false;
        this.request = true;
        }

      }
      else
       {
        this.geolocation.getCurrentPosition().then((resp) => {
          let NEW_ZEALAND_BOUNDS = {
            north: -22.0913127581,
            south: -34.8191663551,
            west: 10.830120477,
            east: 32.830120477,
          };
          let coords1 = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        //  console.log(resp.coords.latitude, resp.coords.longitude);
          
          let mapOptions = {
            center : coords1,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            restriction: {
              latLngBounds: NEW_ZEALAND_BOUNDS,
              strictBounds: false,
            },
            disableDefaultUI: true
          }
          
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          let input = document.getElementById('pac-input');
          let searchBox = new google.maps.places.SearchBox(input);
          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
          //this.db.collection('builder')
          this.map.addListener('bounds_changed', (res) => {
            searchBox.setBounds(this.map.getBounds());
          });
          let  markers = [];
          searchBox.addListener('places_changed', (res)=> {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
              return;
            }
            markers.forEach((marker)=> {
              marker.setMap(null);
            });
            markers = [];
            let bounds = new google.maps.LatLngBounds();
          places.forEach((place)=> {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            let icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            markers.push(new google.maps.Marker({
              map: this.map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          this.map.fitBounds(bounds);
        });
          let marker1 = new google.maps.Marker({
            map: this.map,
            position: coords1,
            title: 'Click to view details',
          })
          let infoWindow = new google.maps.InfoWindow({
            content: 'My location'
       });
       google.maps.event.addListener(marker1, 'click', (resp)=>{
        infoWindow.open(this.map, marker1)
        })
       
        google.maps.event.addListener( marker1,'click', (resp) => {
          this.map.setZoom(15);
          this.map.setCenter(marker1.getPosition());
        });
          firebase.firestore().collection('builderProfile').onSnapshot((resp)=>{

            resp.forEach((doc)=> {
              // doc.data() is never undefined for query doc snapshots
              let certified = (doc.data().certified == true) ? 'Certified': 'Not certified';
              let lat = "<br>Builder name: "+ doc.data().fullName+ "<br>Price: R" + doc.data().price + '<br>'+certified;
              let coord = new google.maps.LatLng(doc.data().lat, doc.data().lng);
           
               let marker = new google.maps.Marker({
                   map: this.map,
                   position: coord,
                   draggable: false,
                  animation: google.maps.Animation.DROP,
                   title: 'Click to view details',
                 })
                      let infoWindow = new google.maps.InfoWindow({
                  content: lat
             });
             google.maps.event.addListener(marker, 'click', (resp)=>{
               //infoWindow.open(this.map, marker)
               this.viewBuilderInfo(doc.data());
              })
              google.maps.event.addListener( marker,'click', (resp) => {
                this.map.setZoom(15);
                this.map.setCenter(marker.getPosition());
              });
           /*    let cityCircle = new google.maps.Circle({
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 0.8,
                fillColor: '#FFFFFF',
                fillOpacity: 0.8,
                map: this.map,
                center: coord,
                radius: 10000
              }); */
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
         this.builder = [];
         this.maps = true;
        this.request = false;
      this.db.collection('builderProfile').get().then(snapshot => {
          snapshot.forEach(doc => {
          this.builder.push(doc.data());
          this.bUID = doc.id;
        });
        //console.log('Builders: ', this.builder);

      });

      }
      // else {
      //   console.log('you are in the waiting list. please wait for 24 hours');

      // }

    })
   }else {
     this.navCtrl.setRoot(WelcomePage);
   }
   /* home page loads here */

  }
  back() {
    this.navCtrl.setRoot(LoginPage);
  }
  setPriceRange(param){
    this.price = param;
   // console.log("Price range = "+ this.price);
   if(this.price>=0){
     this.builder = [];
      this.db.collection('builderProfile').where('price','>=',param)
    .onSnapshot((res)=>{
     // console.log(res.);
      res.forEach((doc)=>{
        // this.db.collection('builderProfile').get().then(snapshot => {
        //   snapshot.forEach(doc => {
            this.builder.push(doc.data());
            this.bUID = doc.id;
        //   });
        //   console.log('Builders: ', this.builder);

        // });
      })
    })
   }
}
  callJoint(phoneNumber) {
    this.callNumber.callNumber(phoneNumber, true);
}
// this.callNumber.callNumber("18001010101", true)
//   .then(res => console.log('Launched dialer!', res))
//   .catch(err => console.log('Error launching dialer', err));
initializeItems() {
  
  this.items = [
    'Amsterdam',
    'Bogota',
    
  ];
}
// search(event){
//     let searchKey : string = event.target.value;
//     let firstLetter = searchKey.toUpperCase();
    
//    if(searchKey.length == 0){
//      this.sampleArr = [];
//      this.resultArr = [];
//    }
//     if(this.sampleArr.length == 0){
//       firebase.firestore().collection('builderProfile').where('fullName', '==',firstLetter)
//       .onSnapshot((res)=>{
//         res.forEach((doc)=>{
//          this.sampleArr.push(doc.data())
//          // console.log(doc.data());  
//         })
//       })
//     } 
//     else{
//       this.resultArr = [];
//       this.sampleArr.forEach((val)=>{
//         let name: string = val['Name'];
//         if(name.toUpperCase().startsWith(searchKey.toUpperCase())){
//           if(true){
//              this.resultArr.push(val);
//             // console.log(this.resultArr);
             
//           }
         
//         }
//       })
//     }
// }
getItems(ev: any) {
  // Reset items back to all of the items
  this.initializeItems();

  // set val to the value of the searchbar
  const val = ev.target.value;

  // if the value is an empty string don't filter the items
  if (val && val.trim() != '') {
    this.items = this.items.filter((item) => {
      return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  }else {
    this.items = [];
  }
}
  ionViewDidLoad() {
     
     

    if(this.platform.width() > 1200) {
      this.slidesPerView = 5;
    }
 
    // On a desktop, and is wider than 768px
    else if(this.platform.width() > 768) {
      this.slidesPerView = 3;
    }
 
    // On a desktop, and is wider than 400px
    else if(this.platform.width() > 400) {
      this.slidesPerView = 2;
    }
 
    // On a desktop, and is wider than 319px
    else if(this.platform.width() > 319) {
      this.slidesPerView = 1;
    }
   this.getOwners();
    let data = {
      builder: {},
      owner: {}
    }
    this.db.collection('HomeOwnerQuotation').where('builderUID','==', firebase.auth().currentUser.uid).onSnapshot(snapshot => {
      this.owner = [];
      if(!snapshot.empty) {
        this.requestFound = '';
        snapshot.forEach(doc => {
        
        this.ownerUID = doc.data().uid;
          
          
        this.db.collection('HomeOwnerProfile').doc(this.ownerUID).get().then((res)=>{   
          data.owner = res.data();
          data.builder = doc.data();
         // console.log(res.data());
          this.owner.push(data);
          data = {
            builder: {},
            owner: {}
          }
        })
      });
      console.log(this.owner);
      
      }else {
        this.requestFound = 'You do not have any messages.';
      }
      
     // console.log('Owners: ', this.owner);
    });
    
  }

//viewmore
viewBuilderInfo(builder){
  this.navCtrl.push(BuilderProfileviewPage, builder);
}
viewRequest(user) {
  this.navCtrl.push(ViewmessagePage, user);
}
// viewRoom(room){
//   // receive the room data from the html and navigate to the next page with it
//   this.navCtrl.push(OwnerViewHotelPage, {room});
// }
viewOwner(owner){
  this.navCtrl.push(HomeOwnerProfilePage,owner);
}

getOwners(){
  
  
}

moveMapEvent() {
 // console.log('changed');
  
}

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

  // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
  // console.log(this.map);

  // firebase.firestore().collection('location').get().then((resp)=>{

  //   resp.forEach((doc)=> {
  //     // doc.data() is never undefined for query doc snapshots
  //     console.log(doc.id,  doc.data().lat);
  //     let lat = doc.id +"<br>Latitude: "+ doc.data().lat+ "<br>Longitude: " + doc.data().lng;
  //     let coord = new google.maps.LatLng(doc.data().lat, doc.data().lng);
  //      let marker = new google.maps.Marker({
  //          map: this.map,
  //          position: coord,
  //          title: 'Click to view details',
  //        })
  //             let infoWindow = new google.maps.InfoWindow({
  //         content: lat
  //    });
  //    google.maps.event.addListener(marker,'click', (resp)=>{
  //     marker.setAnimation(google.maps.Animation.BOUNCE);
  //     })
  //   google.maps.event.addListener(marker, 'click', (resp)=>{
  //     infoWindow.open(this.map, marker)
  //     })
  //     google.maps.event.addListener( marker,'click', (resp) => {
  //       this.map.setZoom(13);
  //       this.map.setCenter(marker.getPosition());
  //     });
  //     google.maps.event.addListener(marker ,'center_changed', (res) => {

  //       window.setTimeout((timeout) => {
  //         this.map.panTo(marker.getPosition());
  //       }, 3000);
  //     });
  //   })
  //   // });
  //   // // console.log(marker);
  //   // } else {
  //   //   console.log("The firestore is empty");

  //   // }
  // });
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


