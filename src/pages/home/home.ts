import { Component , ViewChild, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, MenuController, Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { BuilderProfileviewPage } from '../builder-profileview/builder-profileview';
import { WelcomePage } from '../welcome/welcome';
import { ViewmessagePage } from '../viewmessage/viewmessage';
import { HomeOwnerProfilePage } from '../home-owner-profile/home-owner-profile';
import { CallNumber } from '@ionic-native/call-number';
import { LoginPage } from '../login/login';
import { PopoverController } from 'ionic-angular';
import { ProfileComponent } from '../../components/profile/profile';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  // brightness: number = 20;
  // contrast: number = 0;
  // warmth: number = 1300;
  // structure: any = { lower: 33, upper: 60 };
  // text: number = 0;
  @ViewChild("map") mapElement: ElementRef;
 
//  @ViewChild("filterSearch") filterSearch: ElementRef;
  sampleArr = [];
  resultArr = [];
  db = firebase.firestore().collection('Users');
  dbRequest = firebase.firestore().collection('Request');
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
    private modalCtrl : ModalController, 
    public loader : LoadingController,
    private geolocation: Geolocation,
    private menuCtrl: MenuController,
    private callNumber: CallNumber,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public elementref: ElementRef,
    public renderer: Renderer2
    
 ) {


  }

  ngOnInit(){
    this.menuCtrl.swipeEnable(true);
    if(this.isSearchbarOpened) {
      this.color = 'primary';
    }else {
      this.color = 'yakha';
    }
   //console.log(this.platform.width());
   
  
    /* home page loads start here */
  /*   this.loader.create({
      content:"Loading..",
      duration: 1000
    }).present(); */
     let user = firebase.auth().currentUser;
     if(user){
      let userLoggedIn = this.db.doc(user.uid);
      userLoggedIn.onSnapshot(getuserLoggedIn => {
        if(getuserLoggedIn.data().builder == true) {
  
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
              disableDefaultUI: true,
              styles: [
                {
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#f5f5f5"
                    }
                  ]
                },
                {
                  "elementType": "labels.icon",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#616161"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#f5f5f5"
                    }
                  ]
                },
                {
                  "featureType": "administrative.country",
                  "elementType": "geometry.fill",
                  "stylers": [
                    {
                      "color": "#216d7b"
                    },
                    {
                      "visibility": "on"
                    },
                    {
                      "weight": 5
                    }
                  ]
                },
                {
                  "featureType": "administrative.land_parcel",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#bdbdbd"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#eeeeee"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#757575"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#e5e5e5"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9e9e9e"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "featureType": "road.arterial",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#757575"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#216d7b"
                    },
                    {
                      "saturation": 100
                    },
                    {
                      "visibility": "on"
                    },
                    {
                      "weight": 1
                    }
                  ]
                },
                {
                  "featureType": "road.local",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9e9e9e"
                    }
                  ]
                },
                {
                  "featureType": "transit.line",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#e5e5e5"
                    }
                  ]
                },
                {
                  "featureType": "transit.station",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#eeeeee"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#c9c9c9"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9e9e9e"
                    }
                  ]
                }
              ]
            }
            
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            let input = document.getElementById('search');
            let searchBox = new google.maps.places.SearchBox(input);
            /* this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
             */
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
            firebase.firestore().collection('Users').where("builder","==", true).onSnapshot((resp)=>{
  
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
              // let cards = document.querySelector('home-builder-top');
              // console.log('Cards to style', cards);
              
  
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
        this.db.where("builder","==", true).get().then(snapshot => {
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
      this.db.where('price','>=',param)
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
viewProfile(myEvent) {
  let popover = this.popoverCtrl.create(ProfileComponent,{image: myEvent});
  popover.present({
    ev: myEvent
  });
}
viewHouse(myEvent) {
  console.log('image',myEvent);
  
  let popover = this.popoverCtrl.create(ProfileComponent,{image: myEvent});
  popover.present({
    ev: myEvent
  });
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
    
     
     /* 
     for(var i = 0; i < this.elementref.nativeElement.children[1].children[1].childElementCount; i++) {
       let background = i % 2;
       if(background) {

       }else {

       }
     } */

    if(this.platform.width() > 1200) {
      this.slidesPerView = 5;
    }
 
    // On a desktop, and is wider than 768px
    else if(this.platform.width() > 768) {
      this.slidesPerView = 3;
    }
 
    // On a desktop, and is wider than 400px
    else if(this.platform.width() > 450) {
      this.slidesPerView = 2;
    }
 
    // On a desktop, and is wider than 319px
    else if(this.platform.width() > 319) {
      this.slidesPerView = 1;
    }
   
    let data = {
      builder: {},
      owner: {}
    }
    console.log();
    
    this.dbRequest.where('builderUID','==', firebase.auth().currentUser.uid).onSnapshot((res) => {
      this.owner = [];
      res.forEach((doc)=>{
          
        this.requestFound = '';      
      //  this.ownerUID = doc.data().uid; 
        
             
        this.db.doc(doc.data().hOwnerUid).get().then((res)=>{   
          data.owner = res.data();
          data.builder = doc.data();
         // console.log(res.data());
          this.owner.push(data);
          data = {
            builder: {},
            owner: {}
          }
        })
     
      
      setTimeout(()=> {
       // this.getOwners();
      }, 1000)
      console.log('Done');
      console.log(this.owner);
      
     
      
      })
    
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


moveMapEvent() {
 // console.log('changed');
  
}

loadMap(){



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

});


}


}


